// Vite plugin that serves POST /api/chat from the dev (and preview) server, so
// the Gemini key stays on the server and never reaches the browser.
//
// Request:  { messages: [{ role: "user" | "model", text }], glucoseContext }
// Response: { answer, recipe? } or { error }

const SYSTEM_PROMPT = `
You are Glu, a friendly assistant inside a blood sugar tracking app.
The user's profile, glucose history and today's readings are below. Use them:
refer to specific numbers, times, trends and meals when they are relevant,
and tailor food and exercise suggestions to the user's condition, medications,
goals and allergies.

Rules:
- Reply in the same language the user writes in.
- Keep answers short and practical, in plain text without Markdown.
- You are not a doctor. For medication changes, readings below 70 or above
  250 mg/dL, or symptoms, tell the user to contact their care team.
- When the user asks for a recipe or meal, fill in "recipe" as well as
  "answer". Otherwise leave "recipe" out.
`.trim();

const RESPONSE_SCHEMA = {
    type: "OBJECT",
    properties: {
        answer: { type: "STRING" },
        recipe: {
            type: "OBJECT",
            properties: {
                title: { type: "STRING" },
                description: { type: "STRING" },
                ingredients: { type: "ARRAY", items: { type: "STRING" } },
                steps: { type: "ARRAY", items: { type: "STRING" } },
            },
            required: ["title", "description", "ingredients", "steps"],
        },
    },
    required: ["answer"],
};

export default function geminiChat({ apiKey, model = "gemini-3.8-flash" }) {

    async function handleChat(req, res) {

        function send(status, body) {
            res.statusCode = status;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(body));
        }

        if (req.method !== "POST") {
            return send(405, { error: "Use POST" });
        }

        if (!apiKey) {
            return send(500, { error: "GEMINI_KEY is missing from .env.local" });
        }

        try {
            let body = "";
            for await (const chunk of req) {
                body += chunk;
            }
            const { messages, glucoseContext } = JSON.parse(body);

            const request = {
                method: "POST",
                headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
                body: JSON.stringify({
                    systemInstruction: { parts: [{ text: `${SYSTEM_PROMPT}\n\n${glucoseContext}` }] },
                    contents: messages.map((message) => ({
                        role: message.role,
                        parts: [{ text: message.text }],
                    })),
                    generationConfig: {
                        responseMimeType: "application/json",
                        responseSchema: RESPONSE_SCHEMA,
                        // Less thinking = much faster replies, still good enough for chat.
                        thinkingConfig: { thinkingLevel: "low" },
                    },
                }),
            };

            // Gemini sometimes answers 503 "high demand" or another 5xx; try a few times before giving up.
            let response;
            for (let attempt = 1; attempt <= 3; attempt++) {
                response = await fetch(
                    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
                    request
                );
                if (response.status < 500) {
                    break;
                }
                await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
            }

            const data = await response.json();

            if (!response.ok) {
                return send(502, { error: data.error?.message ?? "Gemini request failed" });
            }

            const text = data.candidates?.[0]?.content?.parts
                ?.filter((part) => !part.thought)
                .map((part) => part.text)
                .join("");

            if (!text) {
                return send(502, { error: "Gemini returned no answer" });
            }

            send(200, JSON.parse(text));
        } catch (error) {
            send(500, { error: error.message });
        }
    }

    return {
        name: "gemini-chat",
        configureServer(server) {
            server.middlewares.use("/api/chat", handleChat);
        },
        configurePreviewServer(server) {
            server.middlewares.use("/api/chat", handleChat);
        },
    };
}

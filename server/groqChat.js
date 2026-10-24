// Vite plugin that serves POST /api/chat from the dev (and preview) server, so
// the Groq key stays on the server and never reaches the browser.
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

Always reply with a JSON object in this shape:
{ "answer": string, "recipe"?: { "title": string, "description": string, "ingredients": string[], "steps": string[] } }
Include "recipe" only when the user asks for a recipe or meal.
`.trim();

export default function groqChat({ apiKey, model = "openai/gpt-oss-20b" }) {

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
            return send(500, { error: "GROQ_DEV is missing from .env.local" });
        }

        try {
            let body = "";
            for await (const chunk of req) {
                body += chunk;
            }
            const { messages, glucoseContext } = JSON.parse(body);

            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
                body: JSON.stringify({
                    model,
                    messages: [
                        { role: "system", content: `${SYSTEM_PROMPT}\n\n${glucoseContext}` },
                        ...messages.map((message) => ({
                            role: message.role === "model" ? "assistant" : "user",
                            content: message.text,
                        })),
                    ],
                    response_format: { type: "json_object" },
                    // Less reasoning = faster replies; accuracy matters less than speed here.
                    reasoning_effort: "low",
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                return send(502, { error: data.error?.message ?? "Groq request failed" });
            }

            const text = data.choices?.[0]?.message?.content;

            if (!text) {
                return send(502, { error: "Groq returned no answer" });
            }

            send(200, JSON.parse(text));
        } catch (error) {
            send(500, { error: error.message });
        }
    }

    return {
        name: "groq-chat",
        configureServer(server) {
            server.middlewares.use("/api/chat", handleChat);
        },
        configurePreviewServer(server) {
            server.middlewares.use("/api/chat", handleChat);
        },
    };
}

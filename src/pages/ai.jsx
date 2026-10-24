import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { glucoseContext } from "../glucoseContext";

const QUICK_QUESTIONS = [
    { label: "Exercise Plan", question: "Make me a simple exercise plan for today based on my glucose." },
    { label: "Low Calorie Recipe", question: "Suggest a low calorie recipe for me." },
    { label: "Low Blood Sugar Recipe", question: "Suggest a recipe that will keep my blood sugar steady." },
];

/** Sends the whole conversation to /api/chat and returns { answer, recipe }. */
async function getReply(chats) {

    let messages = [];

    for (let chat of chats) {
        messages.push({ role: "user", text: chat.question });

        if (chat.answer) {
            messages.push({ role: "model", text: JSON.stringify({ answer: chat.answer, recipe: chat.recipe }) });
        }
    }

    try {
        let response = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ messages, glucoseContext }),
        });
        let reply = await response.json();

        if (!response.ok) {
            return { error: reply.error ?? "Something went wrong" };
        }

        return reply;
    } catch (error) {
        return { error: error.message };
    }
}

function RecipeCard({ recipe }) {

    let [currentStep, setCurrentStep] = useState(0);

    return (
        // col-start-2 keeps the card under the bubbles in the chat grid.
        <div className="card card-bordered bg-base-100 shadow-xl mt-2 w-full col-start-2">
            <div className="card-body gap-4">
                <div>
                    <h2 className="card-title">{recipe.title}</h2>
                    <p className="text-sm opacity-80">{recipe.description}</p>
                </div>

                <div>
                    <h3 className="font-semibold mb-1">Ingredients</h3>
                    <ul className="list-disc list-inside text-sm">
                        {recipe.ingredients.map((ingredient) => (
                            <li key={ingredient}>{ingredient}</li>
                        ))}
                    </ul>
                </div>

                <div className="rounded-box bg-base-200 p-4">
                    <div className="flex justify-between text-sm font-semibold mb-2">
                        <span>Step {currentStep + 1} of {recipe.steps.length}</span>
                        <span>How to make it</span>
                    </div>
                    <p>{recipe.steps[currentStep]}</p>
                </div>

                <div className="card-actions justify-between items-center">
                    <button
                        className="btn btn-sm"
                        type="button"
                        onClick={() => setCurrentStep((step) => Math.max(0, step - 1))}
                        disabled={currentStep === 0}
                    >
                        Previous
                    </button>
                    <progress
                        className="progress progress-primary w-24"
                        value={currentStep + 1}
                        max={recipe.steps.length}
                        aria-label={`Step ${currentStep + 1} of ${recipe.steps.length}`}
                    />
                    <button
                        className="btn btn-sm btn-primary"
                        type="button"
                        onClick={() => setCurrentStep((step) => Math.min(recipe.steps.length - 1, step + 1))}
                        disabled={currentStep === recipe.steps.length - 1}
                    >
                        {currentStep === recipe.steps.length - 1 ? "Done" : "Next"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function AIPage() {

    let { question } = useParams();
    let firstQuestion = question ? decodeURIComponent(question) : "";

    let [message, setMessage] = useState("");

    // Each chat is { question, answer?, recipe?, error?, loading? }.
    let [chats, setChats] = useState(
        firstQuestion === "" ? [] : [{ question: firstQuestion, loading: true }]
    );

    let loading = chats.some((chat) => chat.loading);
    let bottomRef = useRef(null);
    let askedFirstQuestion = useRef(false);

    function showReply(index, reply) {
        setChats((oldChats) =>
            oldChats.map((chat, i) => (i === index ? { ...chat, ...reply, loading: false } : chat))
        );
    }

    async function ask(text) {

        if (text.trim() === "" || loading) {
            return;
        }

        // Failed questions are left out so the AI only sees answered ones.
        let history = [...chats.filter((chat) => !chat.error), { question: text }];

        setChats((oldChats) => [...oldChats, { question: text, loading: true }]);
        setMessage("");

        showReply(chats.length, await getReply(history));
    }

    // A question typed on the home page arrives in the URL; answer it once.
    useEffect(() => {
        if (firstQuestion !== "" && !askedFirstQuestion.current) {
            askedFirstQuestion.current = true;
            getReply([{ question: firstQuestion }]).then((reply) => showReply(0, reply));
        }
    }, [firstQuestion]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chats]);

    return (
        <div className="flex-grow flex flex-col items-center text-base-content">

            <div className="text-xl font-bold mt-10 mb-10">
                Chat with AI
            </div>

            <div className="flex space-x-5 text-base-content">

                {QUICK_QUESTIONS.map((quick) => (
                    <button
                        key={quick.label}
                        className="btn"
                        disabled={loading}
                        onClick={() => ask(quick.question)}
                    >
                        {quick.label}
                    </button>
                ))}

            </div>

            <div className="w-96 mt-8 text-base-content">

                {chats.map((chat, i) => (

                    <div key={i}>

                        <div className="chat chat-end">

                            <div className="chat-header">
                                You
                            </div>

                            <div className="chat-bubble">
                                {chat.question}
                            </div>

                        </div>

                        <div className="chat chat-start">

                            <div className="chat-header">
                                AI
                            </div>

                            {chat.loading && (
                                <div className="chat-bubble">
                                    <span className="loading loading-dots loading-sm" />
                                </div>
                            )}

                            {chat.error && (
                                <div className="chat-bubble chat-bubble-error">
                                    {chat.error}
                                </div>
                            )}

                            {chat.answer && (
                                <div className="chat-bubble whitespace-pre-wrap">
                                    {chat.answer}
                                </div>
                            )}

                            {chat.recipe && <RecipeCard recipe={chat.recipe} />}

                        </div>

                    </div>

                ))}

                <div ref={bottomRef} />

            </div>

            <div className="join w-96 mt-5 mb-10">

                <input
                    className="input input-bordered join-item flex-grow text-base-content"
                    type="text"
                    placeholder="Ask about your blood sugar..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            ask(message);
                        }
                    }}
                />

                <button
                    className="btn join-item"
                    disabled={loading}
                    onClick={() => ask(message)}
                >
                    ➤
                </button>

            </div>

        </div>
    );
}

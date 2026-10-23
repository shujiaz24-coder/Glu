import { useState } from "react";
import { useParams } from "react-router";

const sampleRecipe = {
    title: "Grilled Chicken & Quinoa Bowl",
    ingredients: [
        "1 chicken breast",
        "1/2 cup quinoa",
        "1 cup spinach",
        "1/2 cup chopped tomatoes and cucumber",
        "1/4 avocado",
        "Olive oil, salt, and pepper"
    ],
    steps: [
        "Rinse the quinoa, then simmer it in 1 cup of water until tender, about 15 minutes.",
        "Season the chicken with salt and pepper. Cook in a lightly oiled pan until golden and cooked through, about 6-7 minutes per side. Rest, then slice.",
        "Wash the spinach and chop the tomatoes, cucumber, and avocado.",
        "Add quinoa and spinach to a bowl. Top with chicken and vegetables, then drizzle with a little olive oil."
    ]
};

export default function AIPage() {

    let { question } = useParams();
    let firstQuestion = question ? decodeURIComponent(question) : "";

    let [message, setMessage] = useState("");
    let [currentStep, setCurrentStep] = useState(0);

    let [chats, setChats] = useState(
        firstQuestion === ""
            ? [
                {
                    question: "Suggest a balanced lunch",
                    recipe: sampleRecipe
                }
            ]
            : [
                {
                    question: firstQuestion,
                    answer: "AI response will appear here"
                }
            ]
    );

    function sendMessage() {

        if (message.trim() !== "") {

            let newChat = {
                question: message,
                answer: "AI response will appear here"
            };

            setChats((oldChats) => [...oldChats, newChat]);
            setMessage("");
        }

    }

    return (
        <div className="flex-grow flex flex-col items-center text-base-content">

            <div className="text-xl font-bold mt-10 mb-10">
                Chat with AI
            </div>

            <div className="flex space-x-5 text-base-content">

                <button className="btn">
                    Exercise Plan
                </button>

                <button className="btn">
                    Low Calorie Recipe
                </button>

                <button className="btn">
                    Low Blood Sugar Recipe
                </button>

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

                            {chat.recipe ? (
                                <div className="card card-bordered bg-base-100 shadow-xl mt-2 w-full">
                                    <div className="card-body gap-4">
                                        <div>
                                            <h2 className="card-title">{chat.recipe.title}</h2>
                                            <p className="text-sm opacity-80">A balanced lunch with protein, whole grains, and fresh vegetables.</p>
                                        </div>

                                        <div>
                                            <h3 className="font-semibold mb-1">Ingredients</h3>
                                            <ul className="list-disc list-inside text-sm">
                                                {chat.recipe.ingredients.map((ingredient) => (
                                                    <li key={ingredient}>{ingredient}</li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="rounded-box bg-base-200 p-4">
                                            <div className="flex justify-between text-sm font-semibold mb-2">
                                                <span>Step {currentStep + 1} of {chat.recipe.steps.length}</span>
                                                <span>How to make it</span>
                                            </div>
                                            <p>{chat.recipe.steps[currentStep]}</p>
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
                                                max={chat.recipe.steps.length}
                                                aria-label={`Step ${currentStep + 1} of ${chat.recipe.steps.length}`}
                                            />
                                            <button
                                                className="btn btn-sm btn-primary"
                                                type="button"
                                                onClick={() => setCurrentStep((step) => Math.min(chat.recipe.steps.length - 1, step + 1))}
                                                disabled={currentStep === chat.recipe.steps.length - 1}
                                            >
                                                {currentStep === chat.recipe.steps.length - 1 ? "Done" : "Next"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="chat-bubble">
                                    {chat.answer}
                                </div>
                            )}

                        </div>

                    </div>

                ))}

            </div>

            <div className="join w-96 mt-5 mb-10">

                <input
                    className="input input-bordered join-item flex-grow text-base-content"
                    type="text"
                    placeholder="Type here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            sendMessage();
                        }
                    }}
                />

                <button
                    className="btn join-item"
                    onClick={sendMessage}
                >
                    ➤
                </button>

            </div>

        </div>
    );
}

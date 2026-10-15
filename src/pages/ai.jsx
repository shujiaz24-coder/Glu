import { useState } from "react";
import { useParams } from "react-router";

export default function AIPage() {

    let { question } = useParams();
    let firstQuestion = question ? decodeURIComponent(question) : "";

    // rest of your code...

    let [message, setMessage] = useState("");

    let [chats, setChats] = useState(
        firstQuestion === ""
            ? []
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

                            <div className="chat-bubble">
                                {chat.answer}
                            </div>

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

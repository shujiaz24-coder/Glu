import { useState } from "react";
import { Link } from "react-router";
import { graphPoints, timeLabels } from "../glucoseChartData";

export default function HomePage() {

    let [time, setTime] = useState("AM");
    let [month, setMonth] = useState("April");
    let [date, setDate] = useState("4");
    let [tip, setTip] = useState(0);
    let [message, setMessage] = useState("");

    let tips = [
        {
            tip: "Choose low-GI foods like whole grains, leafy greens, and lean proteins.",
            image: "https://nutritionconnect.org/sites/default/files/2025-03/Sustainable%20Diet%20Index%20canva_12.png",
        },
        {
            tip: "Try not to skip meals.",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxKOOALithyUYh22De7598LF7Nh1NyU9dKKCXmJW4q9sKuCe_2tOLLKhlU&s=10"
        },
        {
            tip: "Drink more water and less sugary drinks.",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQs8ygDPjaj3sn31jGhzEw3n97mudtpiKnE49C5oGvLW6KyaxUjVjdWloo3&s=10"
        }
    ];

    let bloodSugar = time === "AM" ? 86 : 94;


    function sendMessage() {

        if (message.trim() !== "") {

            window.location.href =
                `/ai/${encodeURIComponent(message)}`;

        }

    }

    return (
        <div className="p-8">

            <div className="flex justify-center">

                <div className="join w-2/3">

                    <input
                        className="input input-bordered join-item flex-grow"
                        type="text"
                        placeholder="Hello Shujia! Here's your health at a glance"
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

            <div className="flex justify-between mt-10">

                <div className="flex gap-3">

                    <select
                        className="select select-bordered w-44"
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                    >
                        <option>January</option>
                        <option>February</option>
                        <option>March</option>
                        <option>April</option>
                        <option>May</option>
                        <option>June</option>
                        <option>July</option>
                        <option>August</option>
                        <option>September</option>
                        <option>October</option>
                        <option>November</option>
                        <option>December</option>
                    </select>

                    <select
                        className="select select-bordered w-24"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    >
                        {Array.from({ length: 31 }, (_, i) => (
                            <option key={i + 1}>
                                {i + 1}
                            </option>
                        ))}
                    </select>

                </div>

                <div>

                    <button
                        className={`mr-2 px-5 py-2 btn rounded-lg border-none ${time === "AM" ? "btn-accent" : "btn-ghost"}`}
                        onClick={() => setTime("AM")}
                    >
                        AM
                    </button>

                    <button
                        className={`px-5 py-2 btn rounded-lg border-none ${time === "PM" ? "btn-accent" : "btn-ghost"}`}
                        onClick={() => setTime("PM")}
                    >
                        PM
                    </button>

                </div>

            </div>

            <Link to="/bloodsugar" className="block">

                <button className="btn btn-ghost w-full h-auto p-0 mt-8">

                    <div className="w-full text-left">

                        <div className="p-5">

                            <div className="text-xl">
                                Blood Sugar
                            </div>

                            <div className="text-accent text-6xl mt-3">
                                {bloodSugar}
                            </div>

                            <div>
                                mg/dl
                            </div>

                            <div className="mt-3">
                                {month} {date} - {time}
                            </div>

                        </div>

                        <div className="border-t border-base-300 h-60 flex items-center justify-center overflow-hidden">
                            <svg viewBox="0 0 470 190" className="w-full h-full" aria-label="Blood sugar graph" role="img">
                                <line x1="52" x2="52" y1="12" y2="160" stroke="#94a3b8" strokeOpacity="0.25" strokeWidth="1.2" />
                                <line x1="52" x2="440" y1="160" y2="160" stroke="#94a3b8" strokeOpacity="0.25" strokeWidth="1.2" />

                                {[0, 1, 2, 3].map((line) => (
                                    <g key={line}>
                                        <line
                                            x1="52"
                                            x2="440"
                                            y1={18 + line * 35}
                                            y2={18 + line * 35}
                                            stroke="#94a3b8"
                                            strokeOpacity="0.12"
                                            strokeDasharray="6 8"
                                        />
                                        <text
                                            x="20"
                                            y={22 + line * 35}
                                            fontSize="9"
                                            fill="#64748b"
                                            textAnchor="end"
                                        >
                                            {140 - line * 20}
                                        </text>
                                    </g>
                                ))}

                                {graphPoints.map((point, index, arr) => {
                                    const previousPoint = arr[index - 1] || point;

                                    return (
                                        <g key={`segment-${index}`}>
                                            <line
                                                x1={previousPoint.x + 52}
                                                x2={point.x + 52}
                                                y1={previousPoint.y}
                                                y2={point.y}
                                                stroke="#ED608B"
                                                strokeWidth="4"
                                                strokeLinecap="round"
                                            />
                                            <circle
                                                cx={point.x + 52}
                                                cy={point.y}
                                                r="4.5"
                                                fill="#ED608B"
                                            />
                                        </g>
                                    );
                                })}

                                {timeLabels.map(({ hour, label }) => (
                                    <text
                                        key={hour}
                                        x={52 + (hour / 24) * 388}
                                        y="176"
                                        fontSize="10"
                                        fill="#64748b"
                                        textAnchor="middle"
                                    >
                                        {label}
                                    </text>
                                ))}
                            </svg>
                        </div>

                    </div>

                </button>

            </Link>

            <div className="border-none mt-8 p-5 bg-white shadow-black box-shadow">

                <div className="text-xl">
                    Food Tip
                </div>

                <p className="mt-3">
                    {tips[tip].tip}
                </p>

                <div className="mt-5 flex items-center justify-center">
                    <img className="w-1/2" src={tips[tip].image} alt="Food Image" />
                </div>

                <button
                    className="btn mt-5 bg-accent text-white"
                    onClick={() => setTip((tip + 1) % tips.length)}
                >
                    Next Tip
                </button>

            </div>

        </div>
    );
}
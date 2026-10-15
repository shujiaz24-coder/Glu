import { useState } from "react";
import { Link } from "react-router";
import { graphPoints, timeLabels } from "../glucoseChartData";

export default function BloodSugarPage() {

    let [time, setTime] = useState("AM");
    let [month, setMonth] = useState("April");
    let [date, setDate] = useState("4");

    let days = [
        { day: "Thu", date: "1" },
        { day: "Fri", date: "2" },
        { day: "Sat", date: "3" },
        { day: "Sun", date: "4" },
        { day: "Mon", date: "5" },
        { day: "Tue", date: "6" },
        { day: "Wed", date: "7" }
    ];

    let bloodSugar = time === "AM" ? 86 : 94;
    return (
        <div className="flex-grow p-8">

            <Link to="/">
                <button className="btn text-white bg-accent">
                    ← Back
                </button>
            </Link>

            <div className="text-2xl font-bold text-center mt-5">
                Your Blood Sugar Level
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

            <div className="flex justify-between mt-8">

                {days.map((item) => (

                    <button
                        key={item.date}
                        className={
                            date === item.date
                                ? "btn btn-accent btn-sm"
                                : "btn btn-sm btn-ghost"
                        }
                        onClick={() => setDate(item.date)}
                    >
                        <div className="flex flex-col">
                            <span>{item.day}</span>
                            <span>{item.date}</span>
                        </div>
                    </button>

                ))}

            </div>

            <div className="mt-10">

                <span className=" text-accent text-6xl font-bold">
                    {bloodSugar}
                </span>

                <span className="ml-3">
                    mg/dl
                </span>

                <div className="mt-2">
                    {month} {date} - {time}
                </div>

            </div>

            <div className="mt-8 overflow-hidden rounded-2xl border border-base-200 bg-transparent">
                <svg viewBox="0 0 470 190" className="block h-64 w-full" aria-label="Blood sugar graph" role="img">
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

            <div className="grid grid-cols-2 gap-5 mt-8">

                <div className="card border-none bg-primary shadow-black box-shadow">
                    <div className="card-body">
                        <div>Today Glucose Average</div>
                        <div className="text-4xl font-bold text-important-number1">98</div>
                        <div>mg/dl</div>
                        <div>Goal &lt;100</div>
                        <div>VS yesterday &lt;4%</div>
                    </div>
                </div>

                <div className="card border-none bg-primary shadow-black box-shadow">
                    <div className="card-body">
                        <div>Yesterday Glucose Average</div>
                        <div className="text-4xl font-bold text-accent">103</div>
                        <div>mg/dl</div>
                        <div>Goal &lt;100</div>
                        <div>VS all time &lt;2%</div>
                    </div>
                </div>

                <div className="card border-none bg-primary shadow-black box-shadow">
                    <div className="card-body">
                        <div>Glucose Standard Deviation</div>
                        <div className="text-4xl font-bold  text-accent">1.7</div>
                        <div>Goal &lt;1.4</div>
                        <div>VS yesterday &gt;17.5% </div>
                    </div>
                </div>

                <div className="card border-none bg-primary shadow-black box-shadow">
                    <div className="card-body">
                        <div>Blood Sugar Average</div>
                        <div className="text-4xl font-bold  text-important-number1">100</div>
                        <div>mg/dl</div>
                        <div>Goal &lt;120</div>
                        <div>VS yesterday &lt;3.4%</div>
                    </div>
                </div>

                <div className="card border-none bg-primary shadow-black box-shadow">
                    <div className="card-body">
                        <div>Maximum Blood Sugar Level</div>
                        <div className="text-4xl font-bold  text-important-number1">112</div>
                        <div>mg/dl</div>
                        <div>at 19:08</div>
                        <div>High blood sugar 0.0%</div>
                    </div>
                </div>

                <div className="card border-none bg-primary shadow-black box-shadow">
                    <div className="card-body">
                        <div>Lowest Blood Sugar Level</div>
                        <div className="text-4xl font-bold  text-important-number1">92</div>
                        <div>mg/dl</div>
                        <div>at 6:58</div>
                        <div>Low blood sugar 0.0%</div>
                    </div>
                </div>

            </div>

        </div>
    );
}
import glucoseSample from "../data/glucose-sample.json";
import patientHistory from "../data/patient-history.json";
import { average, high, latest, low, percentHigh, percentLow, readings, standardDeviation } from "./glucoseChartData";

// Everything the AI should know about the user, as plain text for the prompt.
// The profile and history are fake for now (see data/patient-history.json).

const { profile, a1c, dailySummaries, todayMeals } = patientHistory;

const today = [
    `Date: ${glucoseSample.date}`,
    `Latest reading: ${latest.value} ${glucoseSample.unit} at ${latest.time}`,
    `Average: ${Math.round(average)}, standard deviation: ${standardDeviation.toFixed(1)}`,
    `High: ${high.value} at ${high.time}, low: ${low.value} at ${low.time}`,
    `Above range: ${percentHigh.toFixed(1)}%, below range: ${percentLow.toFixed(1)}%`,
    `Readings every 15 minutes (time=value): ${readings.map((r) => `${r.time}=${r.value}`).join(" ")}`,
];

export const glucoseContext = `
## Patient profile
Name: ${profile.name}
Age: ${profile.age}
Condition: ${profile.condition}
Medications: ${profile.medications.join("; ")}
Target range: ${profile.targetRange}
Goals: ${profile.goals.join("; ")}
Allergies: ${profile.allergies.join(", ")}
Activity: ${profile.activity}

## A1C history
${a1c.map((test) => `${test.date}: ${test.value}%`).join("\n")}

## Previous 7 days (mg/dL)
${dailySummaries.map((day) =>
    `${day.date}: avg ${day.average}, low ${day.low}, high ${day.high}, ${day.percentInRange}% in range` +
    (day.note ? ` (${day.note})` : "")
).join("\n")}

## Today's meals
${todayMeals.map((meal) => `${meal.time}: ${meal.meal}`).join("\n")}

## Today's glucose (${glucoseSample.unit})
${today.join("\n")}
`.trim();

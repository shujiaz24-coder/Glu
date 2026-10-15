import glucoseSample from "../data/glucose-sample.json";

export const graphPoints = glucoseSample.readings.map((reading) => {
    const [hours, minutes] = reading.time.slice(11, 16).split(":").map(Number);
    const minutesSinceMidnight = hours * 60 + minutes;

    return {
        x: (minutesSinceMidnight / (24 * 60)) * 388,
        y: 18 + (140 - reading.value) * 1.75,
    };
});

export const timeLabels = Array.from({ length: 9 }, (_, index) => {
    const hour = index * 3;

    return {
        hour,
        label: `${hour % 12 || 12} ${hour < 12 || hour === 24 ? "AM" : "PM"}`,
    };
});

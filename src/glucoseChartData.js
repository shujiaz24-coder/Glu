import glucoseSample from "../data/glucose-sample.json";

// Same thresholds as the iOS app's GlucoseRange.
const LOW = 70;
const HIGH = 140;

/** The day's readings, oldest first, with minutes since local midnight. */
export const readings = glucoseSample.readings.map((reading) => {
    // "2026-10-14T07:45:00-07:00" -> "07:45", the local time it was taken.
    const time = reading.time.slice(11, 16);
    const [hours, minutes] = time.split(":").map(Number);

    return {
        time,
        minutes: hours * 60 + minutes,
        value: reading.value,
    };
});

const values = readings.map((reading) => reading.value);

/** The most recent reading. */
export const latest = readings[readings.length - 1];

export const average = values.reduce((sum, value) => sum + value, 0) / values.length;

export const standardDeviation = Math.sqrt(
    values.reduce((sum, value) => sum + (value - average) ** 2, 0) / values.length
);

/** The highest and lowest readings, with the time each was taken. */
export const high = readings.reduce((max, reading) => (reading.value > max.value ? reading : max));
export const low = readings.reduce((min, reading) => (reading.value < min.value ? reading : min));

/** Percentage of readings above or below the target range. */
export const percentHigh = (values.filter((value) => value > HIGH).length / values.length) * 100;
export const percentLow = (values.filter((value) => value < LOW).length / values.length) * 100;

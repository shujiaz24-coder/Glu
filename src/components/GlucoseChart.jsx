import { useId } from "react";
import { high, latest, readings } from "../glucoseChartData";

// Matches the chart in the iOS app's TodayView.swift: a smoothed line over a
// pink-to-blue fill, midnight to midnight, y axis from 60 to at least 160.

// Colors from the iOS app's Theme.swift.
const GLU_PINK = "#E3457A";
const GLU_BLUE = "#59B3E8";
const GRID = "#94a3b8";
const LABEL = "#64748b";

const WIDTH = 470;
const HEIGHT = 190;
const PLOT = { left: 8, right: WIDTH - 34, top: 10, bottom: HEIGHT - 26 };

const Y_MIN = 60;
const Y_MAX = Math.max(160, high.value + 10);
const Y_TICKS = Array.from({ length: Math.floor((Y_MAX - Y_MIN) / 20) + 1 }, (_, i) => Y_MIN + i * 20);
const HOUR_TICKS = [0, 6, 12, 18, 24];

function xFor(minutes) {
    return PLOT.left + (minutes / (24 * 60)) * (PLOT.right - PLOT.left);
}

function yFor(value) {
    return PLOT.bottom - ((value - Y_MIN) / (Y_MAX - Y_MIN)) * (PLOT.bottom - PLOT.top);
}

function hourLabel(hour) {
    return `${hour % 12 || 12} ${hour < 12 ? "AM" : "PM"}`;
}

/** A Catmull-Rom curve through `points`, like `.interpolationMethod(.catmullRom)`. */
function smoothPath(points) {
    return points.reduce((path, point, i, arr) => {
        if (i === 0) {
            return `M ${point.x} ${point.y}`;
        }

        const p0 = arr[i - 2] || arr[i - 1];
        const p1 = arr[i - 1];
        const p3 = arr[i + 1] || point;
        const c1x = p1.x + (point.x - p0.x) / 6;
        const c1y = p1.y + (point.y - p0.y) / 6;
        const c2x = point.x - (p3.x - p1.x) / 6;
        const c2y = point.y - (p3.y - p1.y) / 6;

        return `${path} C ${c1x} ${c1y} ${c2x} ${c2y} ${point.x} ${point.y}`;
    }, "");
}

const points = readings.map((reading) => ({ x: xFor(reading.minutes), y: yFor(reading.value) }));
const linePath = smoothPath(points);
const areaPath = `${linePath} L ${points[points.length - 1].x} ${yFor(Y_MIN)} L ${points[0].x} ${yFor(Y_MIN)} Z`;

export default function GlucoseChart({ className }) {
    const gradientId = useId();

    return (
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className={className} aria-label="Blood sugar graph" role="img">
            <defs>
                <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor={GLU_PINK} stopOpacity="0.55" />
                    <stop offset="100%" stopColor={GLU_BLUE} stopOpacity="0.15" />
                </linearGradient>
            </defs>

            {Y_TICKS.map((value) => (
                <g key={value}>
                    <line x1={PLOT.left} x2={PLOT.right} y1={yFor(value)} y2={yFor(value)} stroke={GRID} strokeOpacity="0.35" strokeWidth="0.6" />
                    <text x={PLOT.right + 6} y={yFor(value) + 3} fontSize="9" fill={LABEL}>
                        {value}
                    </text>
                </g>
            ))}

            {HOUR_TICKS.map((hour) => (
                <g key={hour}>
                    <line x1={xFor(hour * 60)} x2={xFor(hour * 60)} y1={PLOT.top} y2={PLOT.bottom} stroke={GRID} strokeOpacity="0.35" strokeWidth="0.6" />
                    {hour < 24 && (
                        <text x={xFor(hour * 60) + 3} y={PLOT.bottom + 14} fontSize="9" fill={LABEL}>
                            {hourLabel(hour)}
                        </text>
                    )}
                </g>
            ))}

            <path d={areaPath} fill={`url(#${gradientId})`} />
            <path d={linePath} fill="none" stroke={GLU_PINK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx={xFor(latest.minutes)} cy={yFor(latest.value)} r="5" fill={GLU_BLUE} />
        </svg>
    );
}

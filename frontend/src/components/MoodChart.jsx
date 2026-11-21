import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

const ACCENT = "#8d79b8";
const GRID = "#e5e0c8";
const MUTED = "#6b705a";

const moodWord = (m) =>
  m >= 9 ? "Great" : m >= 7 ? "Good" : m >= 5 ? "Okay" : m >= 3 ? "Low" : "Rough";

function MoodTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { date, mood } = payload[0].payload;
  if (mood == null) return null;
  const label = new Date(date + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric",
  });
  return (
    <div className="chart-tooltip">
      <span className="chart-tooltip-date">{label}</span>
      <span className="chart-tooltip-value">{mood}/10 · {moodWord(mood)}</span>
    </div>
  );
}

function MoodChart({ days }) {
  const data = days.map((d) => ({
    ...d,
    tick: new Date(d.date + "T00:00:00").getDate(),
  }));

  return (
    <div className="mood-chart">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 6, left: -22, bottom: 0 }}>
          <defs>
            <linearGradient id="moodFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={ACCENT} stopOpacity={0.45} />
              <stop offset="100%" stopColor={ACCENT} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke={GRID} strokeDasharray="3 3" />
          <XAxis dataKey="tick" tickLine={false} axisLine={false} interval={1}
            tick={{ fontSize: 10, fill: MUTED }} />
          <YAxis domain={[0, 10]} ticks={[0, 5, 10]} tickLine={false} axisLine={false}
            tick={{ fontSize: 10, fill: MUTED }} />
          <Tooltip content={<MoodTooltip />} cursor={{ stroke: ACCENT, strokeDasharray: "3 3" }} />
          <Area
            type="monotone"
            dataKey="mood"
            stroke={ACCENT}
            strokeWidth={2.5}
            fill="url(#moodFill)"
            connectNulls={false}
            dot={{ r: 3, fill: ACCENT, strokeWidth: 0 }}
            activeDot={{ r: 5 }}
            animationDuration={900}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default MoodChart;
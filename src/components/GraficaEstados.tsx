import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer
} from "recharts";

interface GraficaEstadosProps {
    data: {
        verdes: number;
        amarillos: number;
        rojas: number;
    };
}

const RADIAN = Math.PI / 180;

const renderCustomLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent
}: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    if (percent < 0.05) return null;
    return (
        <text
            x={x}
            y={y}
            fill="white"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={12}
            fontWeight={700}
        >
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

export default function GraficaEstados({ data }: GraficaEstadosProps) {
    const chartData = [
        { name: "En tiempo", value: data.verdes, color: "#10b981" },
        { name: "Precaución", value: data.amarillos, color: "#f59e0b" },
        { name: "Crítico", value: data.rojas, color: "#ef4444" },
    ];

    const total = chartData.reduce((sum, d) => sum + d.value, 0);

    return (
        <div>
            <div className="chart-title">
                <span className="chart-title-icon pie">📊</span>
                Distribución por Estado
            </div>

            <div style={{
                display: "flex",
                gap: "30px",
                alignItems: "center",
                justifyContent: "center",
                flexWrap: "wrap",
            }}>
                <div style={{ width: "240px", height: "240px" }}>
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie
                                data={chartData}
                                dataKey="value"
                                outerRadius={100}
                                innerRadius={55}
                                paddingAngle={4}
                                strokeWidth={0}
                                labelLine={false}
                                label={renderCustomLabel}
                            >
                                {chartData.map((entry, i) => (
                                    <Cell
                                        key={i}
                                        fill={entry.color}
                                        style={{
                                            filter: `drop-shadow(0 2px 4px ${entry.color}30)`,
                                        }}
                                    />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    background: "#ffffff",
                                    border: "1px solid rgba(0,0,0,0.06)",
                                    borderRadius: "12px",
                                    boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                                    color: "#0f172a",
                                    fontSize: "13px",
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    minWidth: "200px",
                }}>
                    {chartData.map((item, i) => {
                        const pct = total > 0 ? ((item.value / total) * 100).toFixed(1) : "0";
                        return (
                            <div
                                key={i}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "12px",
                                    padding: "10px 14px",
                                    borderRadius: "10px",
                                    background: "var(--bg-surface)",
                                    border: "1px solid rgba(0,0,0,0.04)",
                                    transition: "all 0.2s ease",
                                }}
                            >
                                <div style={{
                                    width: "10px",
                                    height: "10px",
                                    borderRadius: "3px",
                                    background: item.color,
                                    boxShadow: `0 0 6px ${item.color}30`,
                                    flexShrink: 0,
                                }} />
                                <div style={{ flex: 1 }}>
                                    <div style={{
                                        fontSize: "12px",
                                        color: "var(--text-secondary)",
                                        fontWeight: 500,
                                    }}>
                                        {item.name}
                                    </div>
                                </div>
                                <div style={{
                                    fontSize: "16px",
                                    fontWeight: 700,
                                    color: item.color,
                                }}>
                                    {item.value}
                                </div>
                                <div style={{
                                    fontSize: "11px",
                                    color: "var(--text-muted)",
                                    fontWeight: 500,
                                }}>
                                    {pct}%
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
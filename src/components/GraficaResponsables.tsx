import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    Cell
} from "recharts";

const generarId = (texto: string) => {
    return texto
        ?.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/g, "-");
};

interface GraficaResponsablesProps {
    data: any[];
    onResponsableClick?: (responsable: string) => void;
}

export default function GraficaResponsables({ data, onResponsableClick }: GraficaResponsablesProps) {
    const agrupado = Object.values(
        data.reduce((acc: any, f: any) => {
            if (!f?.responsable) return acc;
            if (!acc[f.responsable]) {
                acc[f.responsable] = { responsable: f.responsable, total: 0, count: 0 };
            }
            acc[f.responsable].total += f.dias_proceso || 0;
            acc[f.responsable].count += 1;
            return acc;
        }, {})
    ).map((r: any) => ({
        responsable: r.responsable,
        promedio: r.count > 0 ? Math.round(r.total / r.count) : 0,
    }));

    agrupado.sort((a: any, b: any) => b.promedio - a.promedio);

    const getColor = (value: number) => {
        if (value > 2) return "#ef4444";
        if (value > 1) return "#f59e0b";
        return "#10b981";
    };

    const getGlow = (value: number) => {
        if (value > 2) return "rgba(239, 68, 68, 0.2)";
        if (value > 1) return "rgba(245, 158, 11, 0.2)";
        return "rgba(16, 185, 129, 0.2)";
    };

    const CustomTooltip = ({ active, payload }: any) => {
        if (!active || !payload?.length) return null;
        const d = payload[0].payload;
        return (
            <div style={{
                background: "#ffffff",
                border: "1px solid rgba(0,0,0,0.08)",
                borderRadius: "12px",
                padding: "12px 16px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
            }}>
                <div style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#0f172a",
                    marginBottom: "4px",
                }}>
                    {d.responsable}
                </div>
                <div style={{
                    fontSize: "12px",
                    color: getColor(d.promedio),
                    fontWeight: 700,
                }}>
                    {d.promedio} días promedio
                </div>
            </div>
        );
    };

    return (
        <div>
            <div className="chart-title">
                <span className="chart-title-icon bar">📈</span>
                Promedio de días por Responsable
            </div>

            <div style={{ width: "100%", height: 320, overflowY: "auto", overflowX: "hidden" }}>
                <div style={{ width: "100%", height: Math.max(300, agrupado.length * 40) }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            layout="vertical"
                            data={agrupado}
                            margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="rgba(0,0,0,0.05)"
                                horizontal={true}
                                vertical={false}
                            />
                            <XAxis
                                type="number"
                                tick={{ fontSize: 11, fill: "#94a3b8" }}
                                axisLine={{ stroke: "rgba(0,0,0,0.08)" }}
                                tickLine={false}
                            />
                            <YAxis
                                type="category"
                                dataKey="responsable"
                                tick={(props: any) => {
                                    const { x, y, payload } = props;
                                    // Limitar largo de nombres para que no se corten
                                    const text = payload.value.length > 20 
                                        ? payload.value.substring(0, 20) + "..." 
                                        : payload.value;
                                    return (
                                        <text x={x} y={y} dy={4} textAnchor="end" fill="#94a3b8" fontSize={11}>
                                            {text}
                                        </text>
                                    );
                                }}
                                width={140}
                                axisLine={false}
                                tickLine={false}
                                interval={0}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(99, 102, 241, 0.04)" }} />
                            <Bar
                                dataKey="promedio"
                                radius={[0, 6, 6, 0]}
                                style={{ cursor: "pointer" }}
                                maxBarSize={24}
                                onClick={(data: any) => {
                                    if (!data?.responsable) return;
                                    
                                    onResponsableClick?.(data.responsable);

                                    // Retrasar el scroll por un pequeño margen visual
                                    setTimeout(() => {
                                        const id = `responsable-${generarId(data.responsable)}`;
                                        const element = document.getElementById(id);
                                        if (element) {
                                            element.scrollIntoView({ behavior: "smooth", block: "center" });
                                            element.classList.add("highlighted");
                                            setTimeout(() => element.classList.remove("highlighted"), 2500);
                                        }
                                    }, 100);
                                }}
                            >
                                {agrupado.map((entry: any, index: number) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={getColor(entry.promedio)}
                                        style={{
                                            filter: `drop-shadow(0 2px 4px ${getGlow(entry.promedio)})`,
                                        }}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div style={{
                display: "flex",
                justifyContent: "center",
                gap: "20px",
                marginTop: "12px",
            }}>
                {[
                    { label: "En tiempo (≤1 día)", color: "#10b981" },
                    { label: "Precaución (2 días)", color: "#f59e0b" },
                    { label: "Crítico (>2 días)", color: "#ef4444" },
                ].map((item, i) => (
                    <div key={i} style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        fontSize: "11px",
                        color: "var(--text-muted)",
                        fontWeight: 500,
                    }}>
                        <div style={{
                            width: "8px",
                            height: "8px",
                            borderRadius: "2px",
                            background: item.color,
                        }} />
                        {item.label}
                    </div>
                ))}
            </div>
        </div>
    );
}
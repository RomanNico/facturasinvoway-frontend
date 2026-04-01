import { useEffect, useRef } from "react";

interface KPIProps {
    titulo: string;
    valor: number | string;
    color: string;
    onClick?: () => void;
}

const iconMap: Record<string, string> = {
    blue: "📊",
    green: "✅",
    yellow: "⚠️",
    red: "🔴",
};

const KPI = ({ titulo, valor, color, onClick }: KPIProps) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const handleMove = (e: MouseEvent) => {
            const rect = el.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            el.style.setProperty("--mouse-x", `${x}%`);
            el.style.setProperty("--mouse-y", `${y}%`);
        };

        el.addEventListener("mousemove", handleMove);
        return () => el.removeEventListener("mousemove", handleMove);
    }, []);

    return (
        <div
            ref={ref}
            className={`kpi ${color}`}
            onClick={onClick}
            id={`kpi-${color}-${titulo.toLowerCase().replace(/\s/g, "-")}`}
            style={{ position: "relative" }}
        >
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "12px",
            }}>
                <div className="kpi-title">{titulo}</div>
                <span style={{
                    fontSize: "18px",
                    opacity: 0.7,
                    lineHeight: 1,
                }}>
                    {iconMap[color] || "📊"}
                </span>
            </div>
            <div className="kpi-value">{valor}</div>
        </div>
    );
};

export default KPI;
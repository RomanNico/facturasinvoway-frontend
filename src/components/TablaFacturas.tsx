import { useState } from "react";
import type { Factura } from "../types/factura";
import Semaforo from "./Semaforo";

interface Props {
    facturas: Factura[];
}

const generarId = (texto: string) => {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/g, "-");
};

const formatearFecha = (fecha: string) => {
    if (!fecha) return "—";
    const f = new Date(fecha);
    return f.toLocaleDateString("es-CO");
};

const getInitials = (name: string) => {
    if (!name) return "?";
    const parts = name.trim().split(/\s+/);
    return parts.length > 1
        ? (parts[0][0] + parts[1][0]).toUpperCase()
        : parts[0].substring(0, 2).toUpperCase();
};

const avatarColors = [
    "linear-gradient(135deg, #6366f1, #8b5cf6)",
    "linear-gradient(135deg, #3b82f6, #60a5fa)",
    "linear-gradient(135deg, #8b5cf6, #c084fc)",
    "linear-gradient(135deg, #06b6d4, #22d3ee)",
    "linear-gradient(135deg, #10b981, #34d399)",
    "linear-gradient(135deg, #f59e0b, #fbbf24)",
    "linear-gradient(135deg, #ec4899, #f472b6)",
];

const getAvatarColor = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return avatarColors[Math.abs(hash) % avatarColors.length];
};

const TablaFacturas = ({ facturas }: Props) => {
    const [abiertos, setAbiertos] = useState<Record<string, boolean>>({});

    const toggle = (responsable: string) => {
        setAbiertos(prev => ({
            ...prev,
            [responsable]: !prev[responsable],
        }));
    };

    const agrupadas = Object.entries(
        facturas.reduce((acc: Record<string, Factura[]>, f) => {
            if (!acc[f.responsable]) acc[f.responsable] = [];
            acc[f.responsable].push(f);
            return acc;
        }, {})
    );

    if (agrupadas.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-state-icon">📋</div>
                <div className="empty-state-text">No hay facturas para mostrar</div>
            </div>
        );
    }

    return (
        <div>
            <div className="section-label">
                Facturas por responsable
            </div>

            {agrupadas.map(([responsable, lista], groupIndex) => {
                const abierto = abiertos[responsable] ?? true;
                const idResponsable = `responsable-${generarId(responsable)}`;

                const verdes = lista.filter(f => f.estado === "verde").length;
                const amarillas = lista.filter(f => f.estado === "amarillo").length;
                const rojas = lista.filter(f => f.estado === "rojo").length;

                return (
                    <div
                        key={responsable}
                        id={idResponsable}
                        className="responsable-group"
                        style={{ animationDelay: `${groupIndex * 0.05}s` }}
                    >
                        <div
                            className="responsable-header"
                            onClick={() => toggle(responsable)}
                        >
                            <div className="responsable-info">
                                <span className={`responsable-arrow ${abierto ? "open" : ""}`}>
                                    ▶
                                </span>
                                <div
                                    className="responsable-avatar"
                                    style={{ background: getAvatarColor(responsable) }}
                                >
                                    {getInitials(responsable)}
                                </div>
                                <div>
                                    <span className="responsable-name">{responsable}</span>
                                    <span className="responsable-count"> · {lista.length} facturas</span>
                                    <div style={{
                                        display: "flex",
                                        gap: "8px",
                                        marginTop: "4px",
                                    }}>
                                        {verdes > 0 && (
                                            <span style={{
                                                fontSize: "10px",
                                                padding: "1px 6px",
                                                borderRadius: "999px",
                                                background: "rgba(16,185,129,0.1)",
                                                color: "#059669",
                                                fontWeight: 600,
                                            }}>
                                                {verdes} ✓
                                            </span>
                                        )}
                                        {amarillas > 0 && (
                                            <span style={{
                                                fontSize: "10px",
                                                padding: "1px 6px",
                                                borderRadius: "999px",
                                                background: "rgba(245,158,11,0.1)",
                                                color: "#d97706",
                                                fontWeight: 600,
                                            }}>
                                                {amarillas} ⚠
                                            </span>
                                        )}
                                        {rojas > 0 && (
                                            <span style={{
                                                fontSize: "10px",
                                                padding: "1px 6px",
                                                borderRadius: "999px",
                                                background: "rgba(239,68,68,0.1)",
                                                color: "#dc2626",
                                                fontWeight: 600,
                                            }}>
                                                {rojas} ●
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {abierto && (
                            <div className="responsable-table-wrapper">
                                <div className="card" style={{
                                    padding: "0",
                                    overflow: "hidden",
                                    borderRadius: "0 0 16px 16px",
                                    borderTop: "none",
                                    marginTop: "-4px",
                                }}>
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Documento</th>
                                                <th>Proveedor</th>
                                                <th>Fecha Alta</th>
                                                <th>Días Alta</th>
                                                <th>Fecha UO</th>
                                                <th>Días UO</th>
                                                <th>Estado</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {lista.map((f) => (
                                                <tr key={f.documento}>
                                                    <td style={{
                                                        fontWeight: 600,
                                                        fontFamily: "'Courier New', monospace",
                                                        fontSize: "12px",
                                                    }}>
                                                        {f.documento}
                                                    </td>
                                                    <td>{f.proveedor}</td>
                                                    <td>{formatearFecha(f.fecha_alta)}</td>
                                                    <td>
                                                        <span style={{
                                                            fontWeight: 600,
                                                            color: (f.dias_alta ?? 0) > 20
                                                                ? "#dc2626"
                                                                : (f.dias_alta ?? 0) > 10
                                                                    ? "#d97706"
                                                                    : "#059669",
                                                        }}>
                                                            {f.dias_alta ?? 0}
                                                        </span>
                                                    </td>
                                                    <td>{formatearFecha(f.fecha_entrada)}</td>
                                                    <td>
                                                        <span style={{
                                                            fontWeight: 600,
                                                            color: (f.dias_proceso ?? 0) > 2
                                                                ? "#dc2626"
                                                                : (f.dias_proceso ?? 0) > 1
                                                                    ? "#d97706"
                                                                    : "#059669",
                                                        }}>
                                                            {f.dias_proceso ?? 0}
                                                        </span>
                                                    </td>
                                                    <td><Semaforo estado={f.estado} /></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default TablaFacturas;
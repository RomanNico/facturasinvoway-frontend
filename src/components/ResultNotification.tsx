import { useEffect, useState } from "react";

interface UploadResult {
    total_excel: number;
    nuevas: number;
    aprobadas: number;
    correos_enviados: number;
    correos_error: number;
}

interface Props {
    result: UploadResult;
    onClose: () => void;
}

const ResultNotification = ({ result, onClose }: Props) => {
    const [exiting, setExiting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setExiting(true);
            setTimeout(onClose, 400);
        }, 8000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const handleClose = () => {
        setExiting(true);
        setTimeout(onClose, 400);
    };

    return (
        <div className={`result-notification ${exiting ? "exit" : ""}`} id="upload-result">
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
            }}>
                <div className="result-header">
                    <div className="result-icon">✅</div>
                    <div>
                        <div className="result-title">Archivo procesado</div>
                        <div className="result-subtitle">Sincronización completada</div>
                    </div>
                </div>
                <button
                    onClick={handleClose}
                    style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--text-muted)",
                        fontSize: "16px",
                        padding: "4px",
                        lineHeight: 1,
                    }}
                >
                    ✕
                </button>
            </div>

            <div className="result-stats">
                <div className="result-stat blue">
                    <div className="result-stat-value">{result.total_excel}</div>
                    <div className="result-stat-label">En archivo</div>
                </div>
                <div className="result-stat green">
                    <div className="result-stat-value">{result.nuevas}</div>
                    <div className="result-stat-label">Nuevas</div>
                </div>
                <div className="result-stat purple">
                    <div className="result-stat-value">{result.aprobadas}</div>
                    <div className="result-stat-label">Aprobadas</div>
                </div>
            </div>

            {result.correos_enviados > 0 && (
                <div style={{
                    marginTop: "12px",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    background: "rgba(99, 102, 241, 0.06)",
                    fontSize: "12px",
                    color: "var(--text-secondary)",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                }}>
                    <span>📧</span>
                    <span>
                        {result.correos_enviados} correo{result.correos_enviados !== 1 ? "s" : ""} enviado{result.correos_enviados !== 1 ? "s" : ""} automáticamente
                    </span>
                </div>
            )}

            {result.correos_enviados === -1 && (
                <div style={{
                    marginTop: "12px",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    background: "rgba(99, 102, 241, 0.06)",
                    fontSize: "12px",
                    color: "var(--text-secondary)",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                }}>
                    <span>⏳</span>
                    <span>
                        Enviando alertas a responsables en segundo plano...
                    </span>
                </div>
            )}

            {result.correos_error > 0 && (
                <div style={{
                    marginTop: "6px",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    background: "rgba(239, 68, 68, 0.06)",
                    fontSize: "12px",
                    color: "#dc2626",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                }}>
                    <span>⚠️</span>
                    <span>{result.correos_error} correo{result.correos_error !== 1 ? "s" : ""} con error</span>
                </div>
            )}
        </div>
    );
};

export default ResultNotification;

import { useEffect, useState } from "react";

const steps = [
    { icon: "📄", text: "Leyendo Excel" },
    { icon: "🔍", text: "Validando datos" },
    { icon: "🧠", text: "Sincronizando base de datos" },
    { icon: "📧", text: "Enviando alertas por correo" },
    { icon: "✅", text: "Finalizando proceso" },
];

const LoadingModal = ({ visible }: { visible: boolean }) => {
    const [activeStep, setActiveStep] = useState(0);

    useEffect(() => {
        if (!visible) {
            setActiveStep(0);
            return;
        }
        const interval = setInterval(() => {
            setActiveStep(prev => (prev < steps.length - 1 ? prev + 1 : prev));
        }, 1500);
        return () => clearInterval(interval);
    }, [visible]);

    if (!visible) return null;

    return (
        <div className="modal-overlay" id="loading-modal">
            <div className="modal">
                <div className="spinner" />

                <h3>Procesando archivo...</h3>

                <p style={{
                    fontSize: "12px",
                    color: "var(--text-muted)",
                    marginBottom: "20px",
                }}>
                    Los correos se enviarán automáticamente
                </p>

                <ul className="steps">
                    {steps.map((step, i) => (
                        <li
                            key={i}
                            style={{
                                color: i <= activeStep ? "var(--text-primary)" : "var(--text-muted)",
                                transition: "all 0.4s ease",
                                opacity: i <= activeStep ? 1 : 0.35,
                                transform: i === activeStep ? "translateX(4px)" : "none",
                            }}
                        >
                            <span style={{
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "24px",
                                height: "24px",
                                borderRadius: "6px",
                                background: i < activeStep
                                    ? "rgba(16, 185, 129, 0.1)"
                                    : i === activeStep
                                        ? "rgba(99, 102, 241, 0.1)"
                                        : "rgba(0, 0, 0, 0.03)",
                                fontSize: "12px",
                                flexShrink: 0,
                                transition: "all 0.3s ease",
                                color: i < activeStep ? "#059669" : undefined,
                            }}>
                                {i < activeStep ? "✓" : step.icon}
                            </span>
                            {step.text}
                        </li>
                    ))}
                </ul>

                <div style={{
                    marginTop: "20px",
                    height: "3px",
                    borderRadius: "999px",
                    background: "rgba(0, 0, 0, 0.04)",
                    overflow: "hidden",
                }}>
                    <div style={{
                        height: "100%",
                        width: `${((activeStep + 1) / steps.length) * 100}%`,
                        background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
                        borderRadius: "999px",
                        transition: "width 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
                    }} />
                </div>
            </div>
        </div>
    );
};

export default LoadingModal;
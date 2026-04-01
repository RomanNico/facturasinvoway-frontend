import { useState, useEffect } from "react";

const Header = () => {
    const [dateTime, setDateTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setDateTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const formattedDate = dateTime.toLocaleDateString("es-CO", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const formattedTime = dateTime.toLocaleTimeString("es-CO", {
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <div className="header-pro" id="main-header">
            <div className="header-left">
                <img src={`${import.meta.env.BASE_URL}logo.png`} alt="Invo-way Logo" className="logo" />
                <div>
                    <h1 style={{
                        fontSize: "20px",
                        fontWeight: 700,
                        background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        letterSpacing: "-0.02em",
                        lineHeight: 1.2,
                    }}>
                        Invo-way
                    </h1>
                    <span style={{
                        fontSize: "11px",
                        color: "var(--text-muted)",
                        fontWeight: 500,
                        letterSpacing: "0.04em",
                        textTransform: "uppercase",
                    }}>
                        Control de Facturación
                    </span>
                </div>
            </div>

            <div className="header-right" style={{ textAlign: "right" }}>
                <h1 style={{
                    fontSize: "22px",
                    fontWeight: 700,
                    background: "linear-gradient(135deg, #0f172a, #475569)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    letterSpacing: "-0.02em",
                }}>
                    Dashboard
                </h1>
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    justifyContent: "flex-end",
                    marginTop: "2px",
                }}>
                    <span style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: "#10b981",
                        boxShadow: "0 0 8px rgba(16, 185, 129, 0.5)",
                        animation: "pulse-dot 2s ease-in-out infinite",
                    }} />
                    <span style={{
                        fontSize: "11px",
                        color: "var(--text-muted)",
                        fontWeight: 500,
                    }}>
                        {formattedDate} · {formattedTime}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Header;
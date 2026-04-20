import { useState, useEffect } from "react";

const Header = () => {
    const [dateTime, setDateTime] = useState(new Date());

    // Estado mock para preparar la integración SSO
    const [user] = useState({
        name: "USUARIO COMWARE",
        role: "USUARIO CORPORATIVO",
        initial: "U",
        avatarColor: "#9e7f5b" // Color marrón de la imagen
    });

    useEffect(() => {
        const timer = setInterval(() => setDateTime(new Date()), 1000);
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
        second: "2-digit",
        hour12: true,
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

            <div className="header-right" style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                <div style={{ textAlign: "right" }}>
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

                {/* Contenedor de usuario (SSO Placeholder) */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    background: "var(--bg-surface)",
                    border: "1px solid rgba(0,0,0,0.05)",
                    padding: "6px 16px 6px 6px",
                    borderRadius: "999px",
                    boxShadow: "var(--shadow-sm)",
                    transition: "var(--transition-base)"
                }}>
                    <div style={{
                        width: "38px",
                        height: "38px",
                        borderRadius: "50%",
                        background: user.avatarColor,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontWeight: "700",
                        fontSize: "16px",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                    }}>
                        {user.initial}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                        <span style={{
                            fontSize: "13px",
                            fontWeight: 700,
                            color: "#0f3b73", // Un azul corporativo oscuro como en la imagen
                            lineHeight: 1.2,
                            letterSpacing: "0.01em"
                        }}>
                            {user.name}
                        </span>
                        <span style={{
                            fontSize: "10px",
                            fontWeight: 600,
                            color: "#7e96b8", // Azul/gris claro para el rol
                            letterSpacing: "0.05em",
                            textTransform: "uppercase",
                            marginTop: "2px"
                        }}>
                            {user.role}
                        </span>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Header;
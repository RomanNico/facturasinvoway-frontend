import { useEffect, useState, useCallback } from "react";
import { getFacturas } from "./services/api";
import type { Factura } from "./types/factura";

import TablaFacturas from "./components/TablaFacturas";
import KPI from "./components/KPI";
import SubirExcel from "./components/SubirExcel";
import GraficaEstados from "./components/GraficaEstados";
import GraficaResponsables from "./components/GraficaResponsables";
import Header from "./components/Header";
import ResultNotification from "./components/ResultNotification";

import "./styles/index.css";

interface UploadResult {
    total_excel: number;
    nuevas: number;
    aprobadas: number;
    correos_enviados: number;
    correos_error: number;
}

function App() {
    const [facturas, setFacturas] = useState<Factura[]>([]);
    const [busqueda, setBusqueda] = useState("");
    const [filtroEstado, setFiltroEstado] = useState<string | null>(null);
    const [verGraficas, setVerGraficas] = useState(false);
    const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);

    const cargarFacturas = async () => {
        const data = await getFacturas();
        setFacturas(data);
    };

    useEffect(() => {
        cargarFacturas();
    }, []);

    const facturasFiltradas = facturas.filter((f) => {
        const texto = busqueda.toLowerCase();
        return (
            (f.documento?.toLowerCase().includes(texto) ||
                f.proveedor?.toLowerCase().includes(texto) ||
                f.responsable?.toLowerCase().includes(texto)) &&
            (filtroEstado === null || f.estado === filtroEstado)
        );
    });

    const total = facturasFiltradas.length;
    const verdes = facturasFiltradas.filter(f => f.estado === "verde").length;
    const amarillas = facturasFiltradas.filter(f => f.estado === "amarillo").length;
    const rojas = facturasFiltradas.filter(f => f.estado === "rojo").length;
    const sla = total > 0 ? ((verdes / total) * 100).toFixed(1) : "0";

    const handleUploadResult = useCallback((result: UploadResult) => {
        setUploadResult(result);
    }, []);

    const handleCloseResult = useCallback(() => {
        setUploadResult(null);
    }, []);

    return (
        <div className="container">
            <Header />

            <SubirExcel onSuccess={cargarFacturas} onResult={handleUploadResult} />

            <input
                className="input"
                placeholder="Buscar por factura, proveedor o responsable..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                id="search-input"
            />

            {/* Filtro activo */}
            {filtroEstado && (
                <div className="filter-pill">
                    Filtro: <strong style={{ color: "var(--text-primary)" }}>
                        {filtroEstado === "verde" ? "En tiempo" : filtroEstado === "amarillo" ? "Precaución" : "Crítico"}
                    </strong>
                    <button onClick={() => setFiltroEstado(null)} id="btn-clear-filter">
                        ✕
                    </button>
                </div>
            )}

            <div className="kpi-container">
                <KPI titulo="Total" valor={total} color="blue" onClick={() => setFiltroEstado(null)} />
                <KPI titulo="En tiempo" valor={verdes} color="green" onClick={() => setFiltroEstado("verde")} />
                <KPI titulo="Precaución" valor={amarillas} color="yellow" onClick={() => setFiltroEstado("amarillo")} />
                <KPI titulo="Críticas" valor={rojas} color="red" onClick={() => setFiltroEstado("rojo")} />
                <KPI titulo="SLA" valor={`${sla}%`} color="blue" />
            </div>

            <button
                className="btn-toggle-charts"
                onClick={() => setVerGraficas(!verGraficas)}
                style={{ marginBottom: "24px" }}
                id="btn-toggle-charts"
            >
                <svg
                    width="14" height="14"
                    viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round"
                    style={{
                        transition: "transform 0.3s ease",
                        transform: verGraficas ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                >
                    <polyline points="6 9 12 15 18 9" />
                </svg>
                {verGraficas ? "Ocultar análisis" : "Ver análisis gráfico"}
            </button>

            {verGraficas && (
                <div className="charts-section">
                    <div className="charts-grid">
                        <div className="chart-card">
                            <GraficaEstados data={{ verdes, amarillos: amarillas, rojas }} />
                        </div>
                        <div className="chart-card">
                            <GraficaResponsables
                                data={facturas}
                                onResponsableClick={() => {
                                    // Eliminamos setBusqueda para no filtrar la tabla 
                                    // y permitir que el scroll funcione correctamente
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}

            <div className="card animate-in" style={{ marginTop: "4px" }}>
                <TablaFacturas facturas={facturasFiltradas} />
            </div>

            {/* Notificación de resultados */}
            {uploadResult && (
                <ResultNotification result={uploadResult} onClose={handleCloseResult} />
            )}
        </div>
    );
}

export default App;
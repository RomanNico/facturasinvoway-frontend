import { useState } from "react";
import { subirExcel } from "../services/api";
import LoadingModal from "./LoadingModal";

interface UploadResult {
    total_excel: number;
    nuevas: number;
    aprobadas: number;
    correos_enviados: number;
    correos_error: number;
}

interface Props {
    onSuccess: () => void;
    onResult: (result: UploadResult) => void;
}

const SubirExcel = ({ onSuccess, onResult }: Props) => {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [dragOver, setDragOver] = useState(false);

    const handleUpload = async () => {
        if (!file) return alert("Selecciona un archivo");

        try {
            setLoading(true);
            const result = await subirExcel(file);
            onSuccess();
            setFile(null);

            // Reset file input
            const input = document.getElementById("fileInput") as HTMLInputElement;
            if (input) input.value = "";

            onResult(result);
        } catch {
            alert("❌ Error subiendo archivo");
        } finally {
            setLoading(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) setFile(droppedFile);
    };

    return (
        <>
            <div className="upload-box" id="upload-section">
                <label
                    htmlFor="fileInput"
                    className="upload-label"
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    style={{
                        borderColor: dragOver ? "var(--accent-blue)" : undefined,
                        background: dragOver ? "rgba(99, 102, 241, 0.06)" : undefined,
                        transition: "all 0.25s ease",
                    }}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    {file ? (
                        <span style={{ color: "var(--accent-blue)", fontWeight: 600 }}>{file.name}</span>
                    ) : (
                        "Seleccionar o arrastrar archivo Excel"
                    )}
                </label>

                <input
                    type="file"
                    id="fileInput"
                    accept=".xlsx,.xls"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    hidden
                />

                <button
                    className="button"
                    onClick={handleUpload}
                    id="btn-upload"
                    style={{
                        opacity: file ? 1 : 0.5,
                        pointerEvents: file ? "auto" : "none",
                    }}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="16 16 12 12 8 16" />
                        <line x1="12" y1="12" x2="12" y2="21" />
                        <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                    </svg>
                    Subir y enviar alertas
                </button>
            </div>

            <LoadingModal visible={loading} />
        </>
    );
};

export default SubirExcel;
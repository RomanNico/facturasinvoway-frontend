import axios from "axios";

const api = axios.create({
    baseURL: "/api" 
});

export const getFacturas = async () => {
    const res = await api.get("/facturas");
    return res.data;
};

export const aprobarFactura = async (documento: string) => {
    await api.delete(`/facturas/${documento}`);
};

export const subirExcel = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await api.post("/facturas/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return res.data;
};
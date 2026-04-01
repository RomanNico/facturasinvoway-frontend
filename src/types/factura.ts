export interface Factura {
    id: number;
    fecha_alta: string;
    documento: string;
    identificador: string;
    proveedor: string;
    responsable: string;
    fecha_entrada: string;
    dias_proceso: number;
    dias_alta: number;
    estado: "verde" | "amarillo" | "rojo";
}
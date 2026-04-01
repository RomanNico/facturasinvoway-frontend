const Semaforo = ({ estado }: { estado: string }) => {
    return (
        <span className={`badge ${estado}`}>
            {estado === "verde" ? "En tiempo" : estado === "amarillo" ? "Precaución" : "Crítico"}
        </span>
    );
};

export default Semaforo;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function FinalizarPedido() {

    const navigate = useNavigate();

    const [dataEntrega, setDataEntrega] = useState("");
    const [horaEntrega, setHoraEntrega] = useState("");
    const [pedido, setPedido] = useState(null);

    useEffect(() => {
        const pedidoSalvo = JSON.parse(sessionStorage.getItem("pedido"));

        if (!pedidoSalvo) {
            navigate("/");
            return;
        }

        setPedido(pedidoSalvo);
    }, []);

    useEffect(() => {
        if (!horaEntrega) {
            const horarios = gerarHorarios();
            setHoraEntrega(horarios[0]);
        }
    }, []);

    const getMinDate = () => {
        const hoje = new Date();
        hoje.setDate(hoje.getDate() + 5);
        return hoje.toISOString().split("T")[0];
    };

    function finalizarPedido() {

        if (!dataEntrega) {
            alert("Selecione uma data!");
            return;
        }

        if (!horaEntrega) {
            alert("Selecione um horário!");
            return;
        }

        const pedidoAtualizado = {
            ...pedido,
            dataEntrega: dataEntrega,
            horaEntrega: horaEntrega
        };

        console.log("PEDIDO ATUALIZADO:", pedidoAtualizado);

        sessionStorage.setItem("pedido", JSON.stringify(pedidoAtualizado));

        navigate("/pagamento");
    }

    const cancelarPedido = () => {
        const confirmar = window.confirm("Deseja cancelar o pedido?");

        if (!confirmar) return;

        sessionStorage.removeItem("pedido");
        navigate("/");
    };

    const gerarHorarios = () => {
        const horarios = [];
        let hora = 7;
        let minuto = 0;

        while (hora < 20 || (hora === 20 && minuto === 0)) {
            const h = String(hora).padStart(2, "0");
            const m = String(minuto).padStart(2, "0");

            horarios.push(`${h}:${m}`);

            minuto += 30;

            if (minuto === 60) {
                minuto = 0;
                hora++;
            }
        }

        return horarios;
    };

    return (
        <div style={styles.container}>

            <h1 style={styles.titulo}>🧾 Finalizar Pedido</h1>

            <div style={styles.grid}>

                <div style={styles.notaFiscal}>

                    <h2 style={styles.tituloNota}>Sweet Box</h2>

                    <div style={styles.linhaSeparador} />

                    {pedido?.itens?.map((item, index) => (

                        <div key={index} style={{ marginBottom: "15px" }}>

                            <div style={styles.linhaItem}>

                                <span style={styles.nomeProduto}>
                                    {item.nomeProduto || "Produto"}
                                </span>

                                <span>{item.quantidade}x</span>

                                <span>
                                    R$ {Number(item.precoTotal || item.precoUnitario || 0).toFixed(2)}
                                </span>

                            </div>

                            <div style={styles.parametros}>
                                {item.parametrosBolo?.map((p, i) => (
                                    <div key={i}>
                                        • {p.valorEscolhido}
                                        {p.quantidade ? ` (${p.quantidade})` : ""}
                                    </div>
                                ))}
                            </div>

                            <div style={styles.linhaSeparador} />

                        </div>

                    ))}

                    <div style={styles.totalNota}>
                        <strong>TOTAL</strong>
                        <strong>
                            R$ {Number(pedido?.valorTotal || 0).toFixed(2)}
                        </strong>
                    </div>

                </div>

                <div style={styles.card}>
                    <h2 style={styles.subtitulo}>📅 Entrega</h2>

                    <label style={styles.label}>Data</label>
                    <input
                        type="date"
                        value={dataEntrega}
                        min={getMinDate()}
                        onChange={(e) => setDataEntrega(e.target.value)}
                        onKeyDown={(e) => e.preventDefault()}
                        onFocus={(e) => e.target.showPicker && e.target.showPicker()}
                        style={styles.input}
                    />

                    <label style={styles.label}>Horário</label>
                    <div style={styles.horariosContainer}>
                        {gerarHorarios().map((hora, index) => (
                            <button
                                key={index}
                                onClick={() => setHoraEntrega(hora)}
                                style={{
                                    ...styles.horarioBtn,
                                    background: horaEntrega === hora ? "#c79081" : "#f3e5dc",
                                    color: horaEntrega === hora ? "#fff" : "#5a3e36"
                                }}
                            >
                                {hora}
                            </button>
                        ))}
                    </div>

                    <button style={styles.botao} onClick={finalizarPedido}>
                        ✅ Ir para Pagamento
                    </button>

                    <button style={styles.botaoCancelar} onClick={cancelarPedido}>
                        ❌ Cancelar Pedido
                    </button>
                </div>

            </div>

        </div>
    );
}

const styles = {

    container:{
        padding:"40px",
        background:"#f7eee7",
        minHeight:"100vh",
        fontFamily:"'Segoe UI', sans-serif"
    },

    titulo:{
        fontSize:"32px",
        color:"#5a3e36",
        marginBottom:"30px",
        fontWeight:"800",
        textAlign:"center"
    },

    grid:{
        display:"grid",
        gridTemplateColumns:"1fr 1fr",
        gap:"30px"
    },

    card:{
        background:"#fff",
        padding:"25px",
        borderRadius:"18px",
        boxShadow:"0 10px 25px rgba(0,0,0,0.08)",
        border:"1px solid #f1e4dc"
    },

    subtitulo:{
        color:"#6a4b3b",
        marginBottom:"15px"
    },

    label:{
        marginTop:"10px",
        display:"block",
        color:"#6a4b3b",
        fontWeight:"600"
    },

    input:{
        width:"100%",
        padding:"10px",
        marginTop:"5px",
        borderRadius:"10px",
        border:"1px solid #ddd",
        marginBottom:"10px"
    },

    botao:{
        width:"100%",
        marginTop:"15px",
        background:"linear-gradient(135deg, #c79081, #dfa579)",
        color:"#fff",
        border:"none",
        padding:"12px",
        borderRadius:"10px",
        cursor:"pointer",
        fontWeight:"600"
    },

    botaoCancelar:{
        width:"100%",
        marginTop:"10px",
        background:"linear-gradient(135deg, #ff9a9e, #ff4d4d)",
        color:"#fff",
        border:"none",
        padding:"12px",
        borderRadius:"10px",
        cursor:"pointer",
        fontWeight:"600"
    },

    notaFiscal:{
        background:"#fff",
        padding:"20px",
        borderRadius:"15px",
        border:"1px dashed #c9a38a",
        fontFamily:"monospace",
        boxShadow:"0 5px 15px rgba(0,0,0,0.05)"
    },

    tituloNota:{
        textAlign:"center",
        color:"#5a3e36",
        marginBottom:"10px"
    },

    linhaSeparador:{
        borderBottom:"1px dashed #ccc",
        margin:"10px 0"
    },

    linhaItem:{
        display:"grid",
        gridTemplateColumns:"1fr auto auto",
        gap:"10px",
        fontSize:"14px",
        alignItems:"center"
    },

    nomeProduto:{
        fontWeight:"600",
        color:"#4b2e2b"
    },

    parametros:{
        fontSize:"12px",
        color:"#666",
        marginLeft:"5px",
        marginTop:"5px"
    },

    totalNota:{
        display:"flex",
        justifyContent:"space-between",
        marginTop:"15px",
        fontSize:"18px",
        color:"#8b5a3c"
    },

    horariosContainer: {
        display: "flex",
        flexWrap: "wrap",
        gap: "10px",
        marginTop: "10px"
    },

    horarioBtn: {
        padding: "10px 14px",
        borderRadius: "8px",
        border: "none",
        cursor: "pointer",
        fontWeight: "600",
        transition: "0.2s"
    }
};
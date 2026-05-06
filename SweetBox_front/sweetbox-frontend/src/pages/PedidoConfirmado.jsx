import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PedidoConfirmado() {

    const navigate = useNavigate();
    const [pedido, setPedido] = useState(null);

    useEffect(() => {
        const pedidoSalvo = JSON.parse(sessionStorage.getItem("pedidoFinal"));
        console.log("PEDIDO FINAL:", pedidoSalvo);

        if (!pedidoSalvo) {
            navigate("/");
            return;
        }

        setPedido(pedidoSalvo);
        console.log("PEDIDO FINAL:", pedidoSalvo);
    }, []);

    function formatarDataBR(data) {
        if (!data) return "";

        return new Date(data).toLocaleDateString("pt-BR");
    }

    return (
        <div style={styles.container}>

            <div style={styles.card}>

                <h1 style={styles.titulo}>🎉 Pedido Confirmado!</h1>

                <p style={styles.subtitulo}>
                    Seu pedido foi realizado com sucesso 💖
                </p>

                <div style={styles.divisor} />

                <div style={styles.info}>
                    <p><strong>📅 Data da retirada:</strong> {formatarDataBR(pedido?.dataEntrega)}</p>
                    <p><strong>⏰ Horário:</strong> {pedido?.horaEntrega}</p>
                    <p><strong>💳 Pagamento:</strong> {pedido?.pagamento?.metodo}</p>
                </div>

                <div style={styles.divisor} />

                <div style={styles.resumo}>
                    {pedido?.itens?.map((item, index) => (
                        <div key={index} style={styles.item}>
                            <span>{item.nomeProduto}</span>
                            <span>{item.quantidade}x</span>
                            <span>
                                R$ {Number(
                                    item.precoTotal || item.precoUnitario || 0
                                ).toFixed(2)}
                            </span>
                        </div>
                    ))}
                </div>

                <div style={styles.total}>
                    <strong>Total</strong>
                    <strong>R$ {Number(pedido?.valorTotal || 0).toFixed(2)}</strong>
                </div>

                <button
                    style={styles.botao}
                    onClick={() => navigate("/")}
                >
                    🏠 Voltar para o início
                </button>

            </div>

        </div>
    );
}

const styles = {

    container: {
        minHeight: "100vh",
        background: "#f7eee7",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px"
    },

    card: {
        background: "#fff",
        padding: "30px",
        borderRadius: "20px",
        width: "100%",
        maxWidth: "500px",
        boxShadow: "0 15px 35px rgba(0,0,0,0.1)",
        textAlign: "center"
    },

    titulo: {
        color: "#5a3e36",
        marginBottom: "10px"
    },

    subtitulo: {
        color: "#8b5a3c",
        marginBottom: "20px"
    },

    divisor: {
        borderBottom: "1px dashed #ccc",
        margin: "15px 0"
    },

    info: {
        textAlign: "left",
        fontSize: "14px",
        color: "#5a3e36"
    },

    resumo: {
        marginTop: "10px"
    },

    item: {
        display: "flex",
        justifyContent: "space-between",
        fontSize: "14px",
        marginBottom: "5px"
    },

    total: {
        marginTop: "15px",
        display: "flex",
        justifyContent: "space-between",
        fontSize: "18px",
        color: "#8b5a3c"
    },

    botao: {
        marginTop: "25px",
        width: "100%",
        padding: "12px",
        borderRadius: "10px",
        border: "none",
        background: "linear-gradient(135deg, #c79081, #dfa579)",
        color: "#fff",
        fontWeight: "600",
        cursor: "pointer"
    }
};
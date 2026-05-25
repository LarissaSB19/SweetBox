import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";

export default function Pagamento() {

    const navigate = useNavigate();

    const [pedido, setPedido] = useState(null);
    const [metodo, setMetodo] = useState("");
    const [codigoPix, setCodigoPix] = useState("");

    useEffect(() => {
        const pedidoSalvo = JSON.parse(sessionStorage.getItem("pedido"));

        if (!pedidoSalvo) {
            navigate("/");
            return;
        }

        setPedido(pedidoSalvo);
    }, []);

    async function finalizarPagamento() {
        

        if (!pedido) return;

        if (!metodo) {
            alert("Selecione um método de pagamento!");
            return;
        }

        const pedidoFinal = {
            ...pedido,    
            dataEntrega: pedido.dataEntrega + "T00:00:00",
            horaEntrega: pedido.horaEntrega + ":00",
            pagamento: {
                metodo: metodo === "pix" ? "PIX" : "Pagar na retirada",
                statusPagamento: metodo === "pix" ? "Aprovado" : "Pendente",
                dataPagamento: metodo === "pix"
                    ? new Date().toISOString()
                    : null
            }
        };

        console.log("ENVIANDO PRO BACK:", pedidoFinal);

        try {
            const response = await fetch("http://localhost:5179/api/Pedido", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(pedidoFinal)
            });

            const data = await response.json();

            console.log("RESPOSTA BACK:", JSON.stringify(data, null, 2));

            if (!response.ok) {
                throw new Error("Erro ao salvar pedido");
            }

            if (!response.ok) {
                throw new Error("Erro ao salvar pedido");
            }

            sessionStorage.removeItem("pedido");

            alert("Pedido salvo com sucesso! 🎉");
            sessionStorage.setItem("pedidoFinal", JSON.stringify(pedidoFinal));

            navigate("/pedidoConfirmado");

        } catch (erro) {
            console.error("ERRO:", erro);
            alert("Erro ao salvar no banco!");
        }
    }

    function formatarDataBR(data) {
        if (!data) return "";

        const [ano, mes, dia] = data.split("-");
        return `${dia}/${mes}/${ano}`;
    }

    function gerarPixFake() {
        const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let codigo = "PIX-";

        for (let i = 0; i < 40; i++) {
            codigo += caracteres.charAt(
                Math.floor(Math.random() * caracteres.length)
            );
        }

        return codigo;
    }

    return (
        <div style={styles.container}>

            <h1 style={styles.titulo}>💳 Pagamento</h1>

            <div style={styles.grid}>

                <div style={styles.resumo}>

                    <h2 style={styles.subtitulo}>🧾 Resumo</h2>

                    <div style={styles.linhaSeparador} />

                    {pedido?.itens?.map((item, index) => (
                        <div key={index} style={{ marginBottom: "20px" }}>

                            <div style={styles.linhaProduto}>

                                <span style={styles.nomeProduto}>
                                    {item.nomeProduto || "Produto"}
                                </span>

                                <span style={styles.infoDireita}>
                                    {item.quantidade}x R$ {
                                        Number(
                                            item.precoTotal || item.precoUnitario || 0
                                        ).toFixed(2)
                                    }
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

                    <div style={styles.entregaInfo}>
                        <p><strong>📅 Data da retirada:</strong> {formatarDataBR(pedido?.dataEntrega)}</p>
                        <p><strong>⏰ Horário:</strong> {pedido?.horaEntrega}</p>
                    </div>

                    <div style={styles.total}>
                        <strong>Total</strong>
                        <strong>R$ {Number(pedido?.valorTotal || 0).toFixed(2)}</strong>
                    </div>

                </div>

                <div style={styles.card}>

                    <h2 style={styles.subtitulo}>Forma de pagamento</h2>

                    <div style={styles.opcoes}>

                        <button
                            style={{
                                ...styles.opcaoBtn,
                                background: metodo === "retirada" ? "#c79081" : "#f3e5dc"
                            }}
                            onClick={() => setMetodo("retirada")}
                        >
                            💵 Pagar na retirada
                        </button>

                        <button
                            id="btnPix"
                            style={{
                                ...styles.opcaoBtn,
                                background: metodo === "pix" ? "#c79081" : "#f3e5dc"
                            }}
                            onClick={() => {
                                setMetodo("pix");
                                setCodigoPix(gerarPixFake());
                            }}
                        >
                            📱 PIX
                        </button>

                    </div>
                    <div style={{
                        flex: 1,
                        overflowY: "auto",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}>
                        {metodo === "retirada" && (
                            <div style={styles.pixBox}>
                                <h4 style={{ fontSize: "16px", color: "#5a3e36" }}>
                                    O pagamento será realizado no momento da retirada do pedido.
                                </h4>
                            </div>
                        )}

                        {metodo === "pix" && (
                            <div style={styles.pixBox}>
                                <p>Escaneie o QR Code para pagar:</p>

                                <div style={styles.qrContainer}>
                                    <QRCode
                                        value={codigoPix}
                                        size={180}
                                    />
                                </div>

                                <p style={styles.codigoPix}>
                                    {codigoPix}
                                </p>

                                <p style={{ fontSize: "12px", color: "#666" }}>
                                    (Simulação)
                                </p>
                            </div>
                        )}
                    </div>
                    <button 
                        id="confirmarPagamento"
                        style={styles.botao} onClick={finalizarPagamento}>
                        ✅ Confirmar Pagamento
                    </button>

                </div>

            </div>

        </div>
    );
}

const styles = {

    container: {
        padding: "40px",
        background: "#f7eee7",
        minHeight: "100vh"
    },

    titulo: {
        textAlign: "center",
        fontSize: "30px",
        color: "#5a3e36",
        marginBottom: "30px"
    },

    grid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "30px"
    },

    resumo: {
        background: "#fff",
        padding: "20px",
        borderRadius: "15px",
        border: "1px dashed #c9a38a"
    },

    item: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "10px"
    },

    total: {
        marginTop: "20px",
        display: "flex",
        justifyContent: "space-between",
        fontSize: "18px",
        color: "#8b5a3c"
    },

    card: {
        background: "#fff",
        padding: "25px",
        borderRadius: "18px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.08)",

        height: "500px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
    },

    subtitulo: {
        marginBottom: "15px",
        color: "#6a4b3b"
    },

    opcoes: {
        display: "flex",
        gap: "10px",
        marginBottom: "15px"
    },

    opcaoBtn: {
        flex: 1,
        padding: "12px",
        border: "none",
        borderRadius: "10px",
        cursor: "pointer",
        fontWeight: "600"
    },

    input: {
        width: "100%",
        padding: "10px",
        marginBottom: "10px",
        borderRadius: "10px",
        border: "1px solid #ddd"
    },

    pixBox: {
        textAlign: "center",
        marginBottom: "15px"
    },

    qrFake: {
        width: "150px",
        height: "150px",
        background: "#eee",
        margin: "10px auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "10px"
    },

    botao: {
        width: "100%",
        marginTop: "15px",
        background: "linear-gradient(135deg, #c79081, #dfa579)",
        color: "#fff",
        border: "none",
        padding: "12px",
        borderRadius: "10px",
        cursor: "pointer",
        fontWeight: "600"
    },

    entregaInfo: {
        marginTop: "15px",
        padding: "10px",
        background: "#f3e5dc",
        borderRadius: "10px",
        fontSize: "14px",
        color: "#5a3e36"
    },

    parametroLinha: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontSize: "12px",
        marginBottom: "4px"
    },

    preco: {
        fontWeight: "600",
        color: "#8b5a3c"
    },

    linhaProduto: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontWeight: "600",
        marginBottom: "5px"
    },

    nomeProduto: {
        color: "#4b2e2b"
    },

    infoDireita: {
        color: "#4b2e2b"
    },

    parametros: {
        fontSize: "12px",
        color: "#666",
        marginLeft: "5px",
        marginTop: "5px"
    },

    linhaSeparador: {
        borderBottom: "1px dashed #ccc",
        marginTop: "10px"
    },

    qrContainer: {
        background: "#fff",
        padding: "15px",
        borderRadius: "12px",
        width: "fit-content",
        margin: "15px auto",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
    },

    codigoPix: {
        fontSize: "11px",
        wordBreak: "break-all",
        background: "#f8f8f8",
        padding: "10px",
        borderRadius: "8px",
        marginTop: "10px"
    },
};
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Pagamento() {

    const navigate = useNavigate();

    const [pedido, setPedido] = useState(null);
    const [metodo, setMetodo] = useState("");
    const [numeroCartao, setNumeroCartao] = useState("");
    const [nomeCartao, setNomeCartao] = useState("");
    const [cvv, setCvv] = useState("");

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

        if (metodo === "cartao") {
            if (!numeroCartao || !nomeCartao || !cvv) {
                alert("Preencha os dados do cartão!");
                return;
            }
        }

        const pedidoFinal = {
            ...pedido,    
            dataEntrega: pedido.dataEntrega + "T00:00:00",
            horaEntrega: pedido.horaEntrega + ":00",
            pagamento: {
                metodo: metodo === "cartao" ? "Cartão" : "PIX",
                status: "Aprovado",
                dataPagamento: new Date().toISOString()
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

            console.log("RESPOSTA BACK:", data);

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

    function formatarCartao(valor) {
        return valor
            .replace(/\D/g, "")
            .slice(0, 16)
            .replace(/(\d{4})(?=\d)/g, "$1 ");
    }

    function formatarCVV(valor) {
        return valor
            .replace(/\D/g, "")
            .slice(0, 3);
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
                                background: metodo === "cartao" ? "#c79081" : "#f3e5dc"
                            }}
                            onClick={() => setMetodo("cartao")}
                        >
                            💳 Cartão
                        </button>

                        <button
                            style={{
                                ...styles.opcaoBtn,
                                background: metodo === "pix" ? "#c79081" : "#f3e5dc"
                            }}
                            onClick={() => setMetodo("pix")}
                        >
                            📱 PIX
                        </button>

                    </div>

                    <div style={{ flex: 1, overflowY: "auto" }}>
                        {metodo === "cartao" && (
                            <div>

                                <input
                                    placeholder="Número do cartão"
                                    value={numeroCartao}
                                    onChange={(e) => setNumeroCartao(formatarCartao(e.target.value))}
                                    maxLength={19}
                                    style={styles.input}
                                />

                                <input
                                    placeholder="Nome no cartão"
                                    value={nomeCartao}
                                    onChange={(e) => setNomeCartao(e.target.value)}
                                    style={styles.input}
                                />

                                <input
                                    placeholder="CVV"
                                    value={cvv}
                                    onChange={(e) => setCvv(formatarCVV(e.target.value))}
                                    maxLength={3}
                                    style={styles.input}
                                />

                            </div>
                        )}

                        {metodo === "pix" && (
                            <div style={styles.pixBox}>
                                <p>Escaneie o QR Code para pagar:</p>

                                <div style={styles.qrFake}>
                                    QR CODE PIX
                                </div>

                                <p style={{ fontSize: "12px", color: "#666" }}>
                                    (Simulação)
                                </p>
                            </div>
                        )}
                    </div>
                    <button style={styles.botao} onClick={finalizarPagamento}>
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
};
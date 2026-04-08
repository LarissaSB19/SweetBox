import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5179/api/Pedido";

export default function GerenciarPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [filtroStatus, setFiltroStatus] = useState("");
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    carregarPedidos();
  }, []);

  async function carregarPedidos() {
    try {
      const resp = await fetch(API_URL);
      const data = await resp.json();
      setPedidos(data);
    } catch (err) {
      console.error("Erro ao carregar pedidos:", err);
    }
  }

  async function atualizarStatus(pedido, novoStatus) {
    try {
      const resp = await fetch(`${API_URL}/${pedido.idPedido}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          statusPedido: novoStatus
        })
      });

      if (!resp.ok) {
        const erro = await resp.text();
        console.error("Erro ao atualizar:", erro);
        return;
      }

      setPedidos((prevPedidos) =>
        prevPedidos.map((p) =>
          p.idPedido === pedido.idPedido
            ? { ...p, statusPedido: novoStatus }
            : p
        )
      );

    } catch (err) {
      console.error("Erro na requisição:", err);
    }
  }

  const pedidosFiltrados = filtroStatus
    ? pedidos.filter(p => p.statusPedido === filtroStatus)
    : pedidos;

  return (
    <div style={container}>
        <button type="button" id="btnVoltar" className="btn btn-sm" style={{backgroundColor: "#ccac99"}} onClick={() => navigate(-1)}>Voltar</button>
        <h1 style={titulo}>📦 Gerenciamento de Pedidos</h1>

        <div style={filtroBox}>
            <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            style={inputStyle}
            >
            <option value="">Todos</option>
            <option value="Pendente">Pendente</option>
            <option value="Em Preparo">Em Preparo</option>
            <option value="Finalizado">Finalizado</option>
            <option value="Cancelado">Cancelado</option>
            </select>

            <button onClick={carregarPedidos} style={btnAtualizar}>
            Atualizar
            </button>
        </div>

        <div style={gridPedidos}>
            {pedidosFiltrados.map((p) => (
            <div
              key={p.idPedido}
              style={cardPedido}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 12px 25px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.08)";
              }}
            >
                <div style={cardHeader}>
                  <strong>Pedido #{p.idPedido}</strong>
                  <span style={getStatusStyle(p.statusPedido)}>
                      {p.statusPedido}
                  </span>
                </div>

                <p><strong>Data:</strong> {new Date(p.dataPedido).toLocaleString()}</p>
                <p><strong>Valor:</strong> R$ {p.valorTotal.toFixed(2)}</p>
                <p><strong>Cliente:</strong> {p.usuario?.nome || "—"}</p>

                <div style={acoesBox}>
                <button
                  style={{
                    ...btnAcao,
                    opacity: p.statusPedido === "Em Preparo" ? 0.5 : 1,
                    cursor: p.statusPedido === "Em Preparo" ? "not-allowed" : "pointer"
                  }}
                  onClick={() => {
                    if (window.confirm("Deseja realmente alterar o status para 'Em Preparo'?")) {
                      atualizarStatus(p, "Em Preparo");
                    }
                  }}
                  disabled={p.statusPedido === "Em Preparo"}
                >
                  Preparar
                </button>

                <button
                  style={{
                    ...btnAcao,
                    opacity: p.statusPedido === "Finalizado" ? 0.5 : 1,
                    cursor: p.statusPedido === "Finalizado" ? "not-allowed" : "pointer"
                  }}
                  onClick={() => {
                    if (window.confirm("Deseja realmente alterar o status para 'Finalizado'?")) {
                      atualizarStatus(p, "Finalizado");
                    }
                  }}
                  disabled={p.statusPedido === "Finalizado"}
                >
                  Finalizar
                </button>

                <button
                  style={{
                    ...btnCancelar,
                    opacity: p.statusPedido === "Cancelado" ? 0.5 : 1,
                    cursor: p.statusPedido === "Cancelado" ? "not-allowed" : "pointer"
                  }}
                  onClick={() => {
                    if (window.confirm("Deseja realmente alterar o status para 'Cancelado'?")) {
                      atualizarStatus(p, "Cancelado");
                    }
                  }}
                  disabled={p.statusPedido === "Cancelado"}
                >
                  Cancelar
                </button>
                </div>

                <button
                style={btnDetalhes}
                onClick={() => setPedidoSelecionado(p)}
                >
                Ver detalhes
                </button>
            </div>
            ))}
        </div>

        {pedidoSelecionado && (
            <div style={modalBackground} onClick={() => setPedidoSelecionado(null)}>
            <div style={modalContent} onClick={(e) => e.stopPropagation()}>
                <h2>Pedido #{pedidoSelecionado.idPedido}</h2>
                <p><strong>Cliente:</strong> {pedidoSelecionado.usuario?.nome}</p>
                <p><strong>Data:</strong> {new Date(pedidoSelecionado.dataPedido).toLocaleString()}</p>
                <p><strong>Status:</strong> {pedidoSelecionado.statusPedido}</p>

                <h3 style={{ marginTop: "15px" }}>🧾 Itens do pedido</h3>

                {pedidoSelecionado.pedidoItens?.map((item, index) => (
                <div key={index} style={itemCard}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <strong style={{ fontSize: "16px" }}>
                        {item.produto?.nomeProduto}
                    </strong>
                    <span>R$ {item.precoUnitario.toFixed(2)}</span>
                    </div>
                    <div style={{ fontSize: "13px", color: "#666", marginBottom: "5px" }}>
                    {item.quantidade}x
                    </div>
                    <div style={{ fontSize: "13px", color: "#444" }}>
                    {item.pedidoItemParametroBolo?.map((p, i) => (
                        <div key={i}>• {p.valorEscolhido} ({p.quantidade})</div>
                    ))}
                    </div>
                </div>
                ))}

                <h3>Total: R$ {pedidoSelecionado.valorTotal.toFixed(2)}</h3>

                <button
                onClick={() => setPedidoSelecionado(null)}
                style={btnFecharModal}
                >
                Fechar
                </button>
            </div>
            </div>
        )}
    </div>
  );
}

const container = {
  padding: "30px",
  fontFamily: "'Segoe UI', sans-serif",
  background: "linear-gradient(135deg, #fdfbfb, #ebedee)",
  minHeight: "100vh"
};

const titulo = {
  textAlign: "center",
  marginBottom: "20px",
  color: "#5a3e36",
  fontSize: "28px",
  fontWeight: "700"
};

const gridPedidos = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
  gap: "20px",
  marginTop: "20px"
};

const cardPedido = {
  background: "#fff",
  padding: "20px",
  borderRadius: "16px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
  transition: "all 0.25s ease",
  cursor: "pointer",
  border: "1px solid #eee"
};

const cardHeader = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "10px"
};

const filtroBox = {
  display: "flex",
  justifyContent: "center",
  gap: "10px",
  marginBottom: "20px"
};

const acoesBox = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: "10px"
};

const inputStyle = {
  padding: "8px",
  borderRadius: "5px",
  border: "1px solid #ccc",
  minWidth: "150px"
};

const btnAtualizar = {
  padding: "8px 15px",
  backgroundColor: "#7b4d4d",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  transition: "0.2s",
};

const btnAcao = {
  padding: "8px",
  background: "linear-gradient(135deg, #5bc0de, #31b0d5)",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  flex: 1,
  marginRight: "5px",
  fontWeight: "600",
  transition: "0.2s"
};

const btnCancelar = {
  padding: "8px",
  background: "linear-gradient(135deg, #ff6b6b, #d9534f)",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  flex: 1,
  fontWeight: "600",
  transition: "0.2s"
};

const btnDetalhes = {
  marginTop: "12px",
  width: "100%",
  padding: "10px",
  background: "linear-gradient(135deg, #6a11cb, #2575fc)",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
  letterSpacing: "0.5px"
};

const modalBackground = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 2000
};

const modalContent = {
  background: "#fff",
  padding: "25px",
  borderRadius: "16px",
  width: "420px",
  maxHeight: "80vh",
  overflowY: "auto",
  boxShadow: "0 15px 40px rgba(0,0,0,0.2)",
  animation: "fadeIn 0.3s ease"
};

const itemCard = {
  background: "#f9f9f9",
  borderRadius: "10px",
  padding: "12px",
  marginBottom: "12px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
};

const btnFecharModal = {
  marginTop: "10px",
  padding: "10px",
  width: "100%",
  background: "#ccc",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold"
};

function getStatusStyle(status) {
  const base = {
    padding: "6px 12px",
    borderRadius: "20px",
    color: "white",
    fontSize: "12px",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: "0.5px"
  };

  switch (status) {
    case "Pendente":
      return { ...base, background: "#f0ad4e" };
    case "Em Preparo":
      return { ...base, background: "#3498db" };
    case "Finalizado":
      return { ...base, background: "#2ecc71" };
    case "Cancelado":
      return { ...base, background: "#e74c3c" };
    default:
      return base;
  }
}
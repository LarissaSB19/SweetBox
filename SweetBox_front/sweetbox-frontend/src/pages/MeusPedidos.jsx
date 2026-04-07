import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MeusPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [menuAberto, setMenuAberto] = useState(false);
  const [pedidoAberto, setPedidoAberto] = useState(null);

  const navigate = useNavigate();

  const irParaHome = () => navigate("/");
  const irParaPerfil = () => navigate("/perfil");

  useEffect(() => {
    recarregarPedidos();
  }, []);

  const cancelarPedido = async (id) => {
    if (!window.confirm("Tem certeza que deseja cancelar este pedido?")) return;

    const pedido = pedidos.find((p) => (p.idPedido ?? p.IdPedido) === id);
    if (!pedido) return;

    const atualizado = { ...pedido, statusPedido: "Cancelado" };

    try {
      const resp = await fetch(`http://localhost:5179/api/Pedido/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(atualizado),
      });

      if (!resp.ok) throw new Error("Erro ao atualizar pedido");

      await recarregarPedidos();
    } catch (err) {
      console.error("Erro ao cancelar:", err);
    }
  };

  const recarregarPedidos = () => {
    const usuario = JSON.parse(sessionStorage.getItem("usuario"));
    const idUsuario = usuario?.idUsuario;

    fetch(`http://localhost:5179/api/Usuario/perfil/${idUsuario}`)
      .then((res) => res.json())
      .then((data) => setPedidos(data.pedidos || []));
  };

  const getStatus = (p) => p.statusPedido ?? p.StatusPedido;
  const getId = (p) => p.idPedido ?? p.IdPedido;
  const getValor = (p) => p.valorTotal ?? p.ValorTotal;
  const getData = (p) => p.dataPedido ?? p.DataPedido;
  const getItens = (p) => p.pedidoItens ?? p.PedidoItens ?? [];

  const pedidosAtivos = pedidos.filter(
    (p) => getStatus(p) !== "Finalizado" && getStatus(p) !== "Cancelado"
  );

  const pedidosFinalizados = pedidos.filter(
    (p) => getStatus(p) === "Finalizado" || getStatus(p) === "Cancelado"
  );

  const renderPedido = (p, ativo = true) => {
    const id = getId(p);
    const status = getStatus(p);
    const itens = getItens(p);
    const aberto = pedidoAberto === id;

    const badgeColor =
      status === "Entregue"
        ? "#8DC891"
        : status === "Cancelado"
        ? "#D17A7A"
        : "#D6B88A";

    return (
      <div key={id} style={{ ...styles.card, cursor: aberto ? "default" : "pointer" }}>
        <div style={styles.cardHeader}>
          <div>
            <strong style={styles.tituloPedido}>Pedido #{id}</strong>
            <p style={styles.dataPedido}>{new Date(getData(p)).toLocaleDateString()}</p>
          </div>
          <span style={{ ...styles.badge, background: badgeColor }}>{status}</span>
        </div>

        {aberto && (
          <div style={styles.itens}>
            {itens.length === 0 ? (
              <p style={styles.semItens}>Sem itens</p>
            ) : (
              itens.map((item, index) => {
                const nome = item.produto?.nomeProduto ?? item.produto?.nome ?? "Produto";
                const quantidade = item.quantidade ?? item.Quantidade;
                const preco = item.precoUnitario ?? item.PrecoUnitario;
                return (
                  <div key={index} style={styles.item}>
                    <span>{quantidade}x {nome}</span>
                    <span>R$ {Number(preco).toFixed(2)}</span>
                  </div>
                );
              })
            )}
          </div>
        )}

        <div style={styles.cardFooter}>
          {ativo && status !== "Cancelado" && status !== "Entregue" && (
            <button style={styles.btnCancelar} onClick={() => cancelarPedido(id)}>Cancelar</button>
          )}
          <button
            style={styles.btnDetalhes}
            onClick={() => setPedidoAberto(aberto ? null : id)}
          >
            {aberto ? "Fechar" : "Ver detalhes"}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div style={styles.container}>
        <button onClick={() => setMenuAberto(!menuAberto)} style={styles.menuButton} >
             ☰ 
        </button> 
        {menuAberto && ( 
            <div style={styles.dropdown}> 
                <button style={styles.itemMenu} onClick={irParaHome}> 
                    🏠 Página Inicial 
                </button> 
                <button style={styles.itemMenu} onClick={irParaPerfil}> 
                    👤 Perfil 
                </button> 
                <button style={{ ...styles.itemMenu, color: "red" }} onClick={() => { sessionStorage.clear(); navigate("/entrar"); }} > 
                    🚪 Sair 
                </button> 
            </div>
         )}

      <h1 style={styles.tituloPagina}>📦 Meus Pedidos</h1>

      <h2 style={styles.subtitulo}>🟡 Em andamento</h2>
      <div style={styles.grid}>{pedidosAtivos.map((p) => renderPedido(p, true))}</div>

      <h2 style={styles.subtituloFinal}>🟢 Finalizados / Cancelados</h2>
      <div style={styles.grid}>{pedidosFinalizados.map((p) => renderPedido(p, false))}</div>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    background: "#f7eee7",
    minHeight: "100vh",
    fontFamily: "'Segoe UI', sans-serif",
  },
  tituloPagina: {
    color: "#5a3e36",
    fontSize: "26px",
    marginBottom: "20px",
  },
  subtitulo: {
    color: "#7a5c4d",
    marginBottom: "10px",
  },
  subtituloFinal: {
    color: "#7a5c4d",
    marginTop: "30px",
    marginBottom: "10px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "15px",
  },
  card: {
    background: "#fffaf7",
    borderRadius: "12px",
    padding: "15px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  tituloPedido: {
    fontSize: "16px",
    color: "#5a3e36",
  },
  dataPedido: {
    fontSize: "12px",
    color: "#8c6b5a",
    margin: 0,
  },
  badge: {
    color: "#fff",
    padding: "4px 10px",
    borderRadius: "10px",
    fontSize: "11px",
    fontWeight: "600",
    textTransform: "uppercase",
  },
  itens: {
    borderTop: "1px solid #e6d7c8",
    paddingTop: "10px",
    marginTop: "10px",
  },
  item: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "14px",
    marginBottom: "5px",
    color: "#5a3e36",
  },
  semItens: {
    fontSize: "13px",
    color: "#a1887f",
  },
  cardFooter: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  },
  btnCancelar: {
    flex: 1,
    background: "#d17a7a",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    padding: "8px",
    cursor: "pointer",
  },
  btnDetalhes: {
    flex: 1,
    background: "#d6b88a",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    padding: "8px",
    cursor: "pointer",
  },

  dropdown: { 
    position: "absolute", 
    top: "50px", left: "20px", 
    background: "#fff", 
    padding: "10px", 
    borderRadius: "10px", },

  itemMenu: {
    display: "block",
    width: "100%", 
    padding: "8px", 
    border: "none", 
    background: "transparent", 
    textAlign: "left", 
    cursor: "pointer", },
};
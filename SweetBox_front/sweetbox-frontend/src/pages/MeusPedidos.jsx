import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MeusPedidos() {
    const navigate = useNavigate();
    const [pedidos, setPedidos] = useState([]);
    const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
    const [menuAberto, setMenuAberto] = useState(false);

    useEffect(() => {
    carregarPedidos();
    }, []);
    
    const usuario = JSON.parse(sessionStorage.getItem("usuario"));
    const perfil = usuario?.idPerfil || usuario?.IdPerfil;
    
    const toggleMenu = () => setMenuAberto(!menuAberto);

    const irParaHome = () => navigate("/")
	const irParaPerfil = () => navigate("/perfil");
	const irParaAdmin = () => navigate("/Admin");
    
    const irParaSair = () => {
        sessionStorage.clear();
        navigate("/entrar");
    };

    const carregarPedidos = () => {

        const usuario = JSON.parse(sessionStorage.getItem("usuario"));
        const idUsuario = usuario?.idUsuario;

        fetch(`http://localhost:5179/api/Usuario/perfil/${idUsuario}`)
        .then(res => res.json())
        .then(data => setPedidos(data.pedidos || []));

    };

    const cancelarPedido = async (idPedido) => {

        const confirmar = window.confirm("Deseja realmente cancelar este pedido?");

        if(!confirmar) return;

        try{

        await fetch(`http://localhost:5179/api/Pedido/${idPedido}/status`,{
            method:"PUT",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                statusPedido:"Cancelado"
            })
        });

        setPedidos(prev =>
            prev.map(p =>
                (p.idPedido ?? p.IdPedido) === idPedido
                ? {...p, statusPedido:"Cancelado"}
                : p
            )
        );

        }catch(err){
            console.error("Erro ao cancelar pedido",err);
        }

    };

    const getStatusColor = (status) => {

        if(status === "Finalizado") return "#6FAF8D";
        if(status === "Cancelado") return "#D77A7A";
        if(status === "Em Preparo") return "#6FA8DC";

        return "#C49A6C";

    };

    const pedidosAtivos = pedidos.filter(p => {
         const status = p.statusPedido ?? p.StatusPedido;
        return status !== "Finalizado" && status !== "Cancelado";
    });

    const pedidosFinalizados = pedidos.filter(p => {
        const status = p.statusPedido ?? p.StatusPedido;
        return status === "Finalizado";
    });

    const pedidosCancelados = pedidos.filter(p => {
        const status = p.statusPedido ?? p.StatusPedido;
        return status === "Cancelado";
    });

    const renderPedido = (p) => {

        const id = p.idPedido ?? p.IdPedido;
        const status = p.statusPedido ?? p.StatusPedido;
        const data = p.dataPedido ?? p.DataPedido;
        const itens = p.itens ?? p.pedidoItens ?? [];
        const valor = p.valorTotal ?? p.ValorTotal;
    
        return(

            <div 
                key={id} 
                style={{...styles.card, cursor:"pointer"}}
                onClick={() => setPedidoSelecionado(p)}
            >

            <div style={styles.headerPedido}>

                <div>
                    <h3 style={styles.numeroPedido}>Pedido #{id}</h3>
                    <p style={styles.data}>
                        {new Date(data).toLocaleDateString()}
                    </p>
                </div>

                <span style={{
                    ...styles.badge,
                    background:getStatusColor(status)
                }}>
                    {status}
                </span>

            </div>

            <div style={styles.itens}>

                {itens.slice(0, 3).map((item, index) => {

                    const nome = item.nomeProduto ?? item.produto?.nomeProduto ?? "Produto";
                    const qtd = item.quantidade ?? 1;
                    const preco = item.preco ?? item.precoUnitario ?? 0;

                    return (
                        <div key={index} style={styles.item}>
                            <span>{qtd}x {nome}</span>
                            <span>R$ {Number(preco).toFixed(2)}</span>
                        </div>
                    );

                })}

                {itens.length > 3 && (
                    <div style={{ fontSize: "12px", color: "#999", marginTop: "5px" }}>
                        +{itens.length - 3} itens...
                    </div>
                )}

            </div>

            <div style={styles.total}>
                Total: R$ {Number(valor).toFixed(2)}
            </div>

            <div style={styles.botoesPedido}>

                <button
                    style={styles.btnDetalhes}
                    onClick={(e)=>{
                    e.stopPropagation();
                    setPedidoSelecionado(p);
                    }}
                >
                    Detalhes
                </button>

                {status !== "Cancelado" && status !== "Finalizado" && (

                    <button
                        style={styles.btnCancelar}
                        onClick={(e)=>{
                            e.stopPropagation();
                            cancelarPedido(id);
                        }}
                    >
                        Cancelar
                    </button>

                )}

            </div>

        </div>

        );

    };

    return (

        <div style={styles.container}>

            <div style={{ position: "absolute", top: "20px", left: "20px" }}>
                    <button onClick={toggleMenu} style={styles.menuButton}>
                        ☰
                    </button>

                    {menuAberto && (
                        <div style={styles.dropdown}>

                            <button
                                style={styles.itemDropdown}
                                onClick={() => {
                                    setMenuAberto(false);
                                    irParaHome();
                            }}
                            >
                                🏠 Página Inicial
                            </button>
                        
                            <button
                                style={styles.itemDropdown}
                                onClick={() => {
                                    setMenuAberto(false);
                                    irParaPerfil(); }}
                            >
                                👤 Perfil
                            </button>

                            {perfil < 3 && (
                                <button
                                    style={styles.itemDropdown}
                                    onClick={() => {
                                        setMenuAberto(false);
                                        irParaAdmin();
                                    }}
                                >
                                    ⚙️ Administração
                                </button>
                            )}

                            <hr style={styles.divider} />

                            <button
                                style={{ ...styles.itemDropdown, color: "#dc3545" }}
                                onClick={() => {
                                    setMenuAberto(false);
                                    irParaSair();
                                }}
                            >
                                🚪 Sair
                            </button>
                        </div>
                    )}
            </div>

            <h1 style={styles.titulo}>📦 Meus Pedidos</h1>

            <h2 style={styles.subtitulo}>🕒 Pedidos em andamento</h2>

            <div style={styles.grid}>

                {pedidosAtivos.length === 0 && (
                    <p>Nenhum pedido em andamento</p>
                )}

                {pedidosAtivos.map(renderPedido)}

            </div>

            <h2 style={styles.subtitulo}>✅ Pedidos finalizados</h2>

            <div style={styles.grid}>

                {pedidosFinalizados.length === 0 && (
                    <p>Nenhum pedido finalizado</p>
                )}

                {pedidosFinalizados.map(renderPedido)}

            </div>

            <h2 style={styles.subtitulo}>❌ Pedidos cancelados</h2>

            <div style={styles.grid}>
                {pedidosCancelados.length === 0 && (
                    <p>Nenhum pedido cancelado</p>
                )}

                {pedidosCancelados.map(renderPedido)}
            </div>


            {pedidoSelecionado && (

                <div style={styles.modalBackground} onClick={() => setPedidoSelecionado(null)}>

                    <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>

                        <h2 style={{color:"#5a3e36"}}>
                            Pedido #{pedidoSelecionado.idPedido ?? pedidoSelecionado.IdPedido}
                        </h2>

                        <p>
                            <strong>Cliente:</strong> {usuario?.nome}
                        </p>

                        <p>
                            <strong>Data:</strong>{" "}
                                {new Date(pedidoSelecionado.dataPedido ?? pedidoSelecionado.DataPedido).toLocaleString()}
                        </p>

                        <p>
                            <strong>Status:</strong> {pedidoSelecionado.statusPedido ?? pedidoSelecionado.StatusPedido}
                        </p>

                        <h3 style={{ marginTop: "15px", color:"#6a4b3b" }}>
                            🧾 Itens do pedido
                        </h3>

                        {(pedidoSelecionado.pedidoItens ?? pedidoSelecionado.itens ?? []).map((item, index) => (

                            <div key={index} style={styles.itemCard}>

                                <div style={{ display: "flex", justifyContent: "space-between" }}>

                                    <strong style={{ fontSize: "16px" }}>
                                        {item.produto?.nomeProduto ?? item.nomeProduto}
                                    </strong>

                                    <span>
                                        R$ {Number(item.precoUnitario ?? item.preco ?? 0).toFixed(2)}
                                    </span>

                                </div>

                                <div style={{ fontSize: "13px", color: "#666", marginBottom: "5px" }}>
                                    {item.quantidade ?? item.Quantidade}x
                                </div>

                                <div style={{ fontSize: "13px", color: "#444" }}>

                                    {item.pedidoItemParametroBolo?.map((p, i) => (
                                
                                        <div key={i}>
                                            • {p.valorEscolhido} ({p.quantidade})
                                        </div>

                                    ))}

                                </div>

                            </div>

                        ))}

                        <h3 style={{color:"#8b5a3c"}}>
                            Total: R$ {Number(pedidoSelecionado.valorTotal ?? pedidoSelecionado.ValorTotal).toFixed(2)}
                        </h3>

                        <button
                            onClick={() => setPedidoSelecionado(null)}
                            style={styles.btnFecharModal}
                        >
                            Fechar
                        </button>

                    </div>

                </div>

            )}

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
        fontSize:"34px",
        color:"#5a3e36",
        marginBottom:"25px",
        textAlign:"center",
        fontWeight:"800",
        letterSpacing:"1px"
    },

    subtitulo:{
        marginTop:"40px",
        marginBottom:"15px",
        color:"#6a4b3b",
        fontSize:"20px",
        fontWeight:"700"
    },

    grid:{
        display:"grid",
        gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",
        gap:"20px"
    },

    card:{
      background:"#ffffff",
        borderRadius:"18px",
        padding:"20px",
        boxShadow:"0 10px 25px rgba(0,0,0,0.08)",
        display:"flex",
        flexDirection:"column",
        border:"1px solid #f1e4dc",
        transition:"0.3s",

        height:"320px",
        overflow:"hidden"
    },

    headerPedido:{
        display:"flex",
        justifyContent:"space-between",
        alignItems:"center",
        marginBottom:"12px"
    },

    numeroPedido:{
        margin:0,
        color:"#5a3e36",
        fontSize:"16px",
        fontWeight:"700"
    },

    data:{
        margin:0,
        fontSize:"13px",
        color:"#9b7d6f"
    },

    badge:{
        color:"#fff",
        padding:"6px 14px",
        borderRadius:"20px",
        fontSize:"12px",
        fontWeight:"700",
        letterSpacing:"0.5px"
    },

    itens:{
        borderTop:"1px solid #f1e4dc",
        paddingTop:"10px",
        marginTop:"5px",
        overflow:"hidden",
        maxHeight:"120px"
    },

    item:{
        display:"flex",
        justifyContent:"space-between",
        marginBottom:"6px",
        color:"#4b2e2b",
        fontSize:"14px"
    },

    total:{
        marginTop:"12px",
        fontWeight:"bold",
        color:"#8b5a3c",
        fontSize:"17px"
    },

    modalBackground:{
        position:"fixed",
        top:0,
        left:0,
        width:"100%",
        height:"100%",
        background:"rgba(0,0,0,0.5)",
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        zIndex:999
    },

    modalContent:{
        background:"#fff",
        padding:"30px",
        borderRadius:"20px",
        width:"420px",
        maxHeight:"80vh",
        overflowY:"auto",
        boxShadow:"0 20px 50px rgba(0,0,0,0.25)",
        animation:"fadeIn 0.3s ease"
    },

    itemCard:{
        background:"#fff8f4",
        padding:"12px",
        borderRadius:"12px",
        marginBottom:"10px",
        border:"1px solid #f1d8cc"
    },

    btnFecharModal:{
        marginTop:"20px",
        background:"linear-gradient(135deg, #a47148, #7b4d4d)",
        color:"#fff",
        border:"none",
        padding:"10px 18px",
        borderRadius:"10px",
        cursor:"pointer",
        fontWeight:"600"
    },

    botoesPedido:{
        display:"flex",
        gap:"10px",
        marginTop:"auto" 
    },

    btnDetalhes:{
        flex:1,
        background:"linear-gradient(135deg, #c79081, #dfa579)",
        color:"#fff",
        border:"none",
        padding:"9px",
        borderRadius:"10px",
        cursor:"pointer",
        fontWeight:"600"
    },

    btnCancelar:{
        flex:1,
        background:"linear-gradient(135deg, #ff9a9e, #ff4d4d)",
        color:"#fff",
        border:"none",
        padding:"9px",
        borderRadius:"10px",
        cursor:"pointer",
        fontWeight:"600"
    },

    menuButton: {
        fontSize: "20px",
        background: "#ccac99",
        color: "#fff",
        border: "none",
        padding: "8px 12px",
        borderRadius: "10px",
        cursor: "pointer",
        boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
    },

    dropdown: {
        position: "absolute",
        top: "45px",
        left: 0,
        background: "#fff",
        borderRadius: "12px",
        padding: "10px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
        minWidth: "200px",
        display: "flex",
        flexDirection: "column",
        gap: "5px",
    },

    itemDropdown: {
        padding: "10px",
        border: "none",
        background: "transparent",
        textAlign: "left",
        cursor: "pointer",
        borderRadius: "8px",
        fontSize: "14px",
    },

    divider: {
        margin: "8px 0",
        borderColor: "#eee",
    },
};

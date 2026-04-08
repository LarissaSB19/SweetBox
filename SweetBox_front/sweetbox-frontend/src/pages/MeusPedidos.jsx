import { useEffect, useState } from "react";

export default function MeusPedidos() {

const [pedidos, setPedidos] = useState([]);
const [pedidoSelecionado, setPedidoSelecionado] = useState(null);

useEffect(() => {
carregarPedidos();
}, []);

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
return status === "Finalizado" || status === "Cancelado";
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

{itens.map((item,index)=>{

const nome = item.nomeProduto ?? item.produto?.nomeProduto ?? "Produto";
const qtd = item.quantidade ?? 1;
const preco = item.preco ?? item.precoUnitario ?? 0;

return(

<div key={index} style={styles.item}>

<span>{qtd}x {nome}</span>
<span>R$ {Number(preco).toFixed(2)}</span>

</div>

);

})}

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


{pedidoSelecionado && (

<div style={styles.modalBackground} onClick={() => setPedidoSelecionado(null)}>

<div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>

<h2 style={{color:"#5a3e36"}}>
Pedido #{pedidoSelecionado.idPedido ?? pedidoSelecionado.IdPedido}
</h2>

<p>
<strong>Cliente:</strong> {pedidoSelecionado.usuario?.nome}
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
background:"#f5eee9",
minHeight:"100vh",
fontFamily:"Segoe UI"
},

titulo:{
fontSize:"32px",
color:"#5a3e36",
marginBottom:"20px"
},

subtitulo:{
marginTop:"40px",
marginBottom:"20px",
color:"#6a4b3b"
},

grid:{
display:"grid",
gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",
gap:"20px"
},

card:{
background:"#ffffff",
borderRadius:"14px",
padding:"20px",
boxShadow:"0 8px 20px rgba(0,0,0,0.08)",
display:"flex",
flexDirection:"column"
},

headerPedido:{
display:"flex",
justifyContent:"space-between",
alignItems:"center",
marginBottom:"15px"
},

numeroPedido:{
margin:0,
color:"#5a3e36"
},

data:{
margin:0,
fontSize:"13px",
color:"#9b7d6f"
},

badge:{
color:"#fff",
padding:"5px 12px",
borderRadius:"20px",
fontSize:"12px",
fontWeight:"600"
},

itens:{
borderTop:"1px solid #eee",
paddingTop:"10px"
},

item:{
display:"flex",
justifyContent:"space-between",
marginBottom:"6px",
color:"#4b2e2b"
},

total:{
marginTop:"10px",
fontWeight:"bold",
color:"#8b5a3c",
fontSize:"16px"
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
borderRadius:"14px",
width:"420px",
maxHeight:"80vh",
overflowY:"auto",
boxShadow:"0 10px 30px rgba(0,0,0,0.2)"
},

itemCard:{
background:"#f9f3ef",
padding:"10px",
borderRadius:"8px",
marginBottom:"10px"
},

btnFecharModal:{
marginTop:"20px",
background:"#8b5a3c",
color:"#fff",
border:"none",
padding:"10px 18px",
borderRadius:"8px",
cursor:"pointer"
},

botoesPedido:{
display:"flex",
gap:"10px",
marginTop:"15px"
},

btnDetalhes:{
flex:1,
background:"#C49A6C",
color:"#fff",
border:"none",
padding:"8px",
borderRadius:"8px",
cursor:"pointer"
},

btnCancelar:{
flex:1,
background:"#D77A7A",
color:"#fff",
border:"none",
padding:"8px",
borderRadius:"8px",
cursor:"pointer"
},

};
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Admin() {
	const navigate = useNavigate();
	const [perfil, setPerfil] = useState(null);

	useEffect(() => {
		const dadosSalvos = localStorage.getItem("perfil");
		if (dadosSalvos) {
			setPerfil(JSON.parse(dadosSalvos));
		}
	}, []);

	useEffect(()=>{
		{perfil == 3 ? (
			navigate("/entrar")
		) : null}
	}, [perfil, navigate]);

	return (
		<div 
		style={{
			backgroundColor: "#f7eee7",
			minHeight: "100vh",
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			justifyContent: "center",
			padding: "20px"
		}}
		>

		<h1 style={{ 
			color: "#4B2E2E", 
			marginBottom: "40px", 
			fontWeight: "bold" 
		}}>
			Administração
		</h1>

		<div
			style={{
			backgroundColor: "#fff",
			padding: "40px",
			borderRadius: "18px",
			border: "2px solid #a87f67",
			boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
			width: "100%",
			maxWidth: "420px",
			textAlign: "center"
			}}
		>

			<button 
			onClick={() => navigate("/gerenciarUsuarios")}
			style={botao}
			>
			Gerenciar Usuários
			</button>

			<button 
			onClick={() => navigate("/gerenciarProdutos")}
			style={botao}
			>
			Gerenciar Produtos
			</button>

			{/*<button 
			onClick={() => navigate("/pedidos")}
			style={botao}
			>
			Gerenciar Pedidos
			</button>

			<button 
			onClick={() => navigate("/relatorios")}
			style={botao}
			>
			Relatórios
			</button>*/}

		</div>
		</div>
	);
}

const botao = {
  width: "100%",
  padding: "12px",
  marginBottom: "15px",
  backgroundColor: "#ccac99",
  border: "none",
  color: "white",
  fontWeight: "bold",
  borderRadius: "10px",
  cursor: "pointer",
  fontSize: "16px"
};


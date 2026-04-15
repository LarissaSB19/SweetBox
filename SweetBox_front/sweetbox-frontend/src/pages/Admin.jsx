import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";


export default function Admin() {
	const navigate = useNavigate();
	const [perfil, setPerfil] = useState(null);
	const [menuAberto, setMenuAberto] = useState(false);

	const toggleMenu = () => setMenuAberto(!menuAberto);

	const irParaHome = () => navigate("/")
	const irParaPerfil = () => navigate("/perfil");
	const irParaMeusPedidos = () => navigate("/meusPedidos");

	function irParaSair() {
		sessionStorage.removeItem("usuario");
		sessionStorage.removeItem("perfil");
		navigate("/entrar");
	}

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

		<div style={{ padding: "30px" }}>

			<div style={{ position: "absolute", top: "20px", left: "20px" }}>
				<div style={{ position: "relative" }}>

					<button 
						className="btn btn-sm botao"
						onClick={() => setMenuAberto(!menuAberto)}
						style={{ fontSize: "20px" }}
					>
						☰
					</button>

					{menuAberto && (
						<div style={{
							position: "absolute",
							left: 0,
							top: "45px",
							background: "white",
							borderRadius: "10px",
							boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
							padding: "10px",
							zIndex: 1000,
							minWidth: "180px"
						}}>

							<button 
								className="dropdown-item"
								style={{ padding: "10px", width: "100%", textAlign: "left" }}
								onClick={() => {
								setMenuAberto(false);
								irParaHome(); }}
							>
								🏠 Página Inicial
							</button>

							<button 
								className="dropdown-item"
								style={{ padding: "10px", width: "100%", textAlign: "left" }}
								onClick={() => {
								setMenuAberto(false);
								irParaPerfil(); }}
							>
								👤 Perfil
							</button>
							
							<button
								className="dropdown-item"
								style={{ padding: "10px", width: "100%", textAlign: "left" }}
								onClick={() => {
								setMenuAberto(false);
								irParaMeusPedidos(); }}
							>
								📦 Meus Pedidos
							</button>
							<hr />

							<button 
							className="dropdown-item text-danger"
							onClick={() => {
								sessionStorage.removeItem("usuario");
								sessionStorage.removeItem("perfil");
								navigate("/entrar");
							}}
							style={{ padding: "10px", width: "100%", textAlign: "left" }}
							>
								Sair
							</button>

						</div>
					)}
				</div>
			</div>		

			<div 
				style={{
					minHeight: "80vh",
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

					<button 
						onClick={() => navigate("/gerenciarPedidos")}
						style={botao}
					>
						Gerenciar Pedidos
					</button>
				
				</div>
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


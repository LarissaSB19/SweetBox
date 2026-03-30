import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Home() {
	const navigate = useNavigate();

	const [usuario, setUsuario] = useState(null);
	const [perfil, setPerfil] = useState(null);

	const irParaPedido = () => {
		if (!usuario) {
			navigate("/entrar");
			return;
		}

		navigate("/pedido");
	};
	
	const irParaEntrar = () => {
		navigate("/entrar")
	}
	const irParaAdmin = () => {
		navigate("/admin")
	}

	const irParaPerfil = () => {
		navigate("/perfil");
	}	

	const [menuAberto, setMenuAberto] = useState(false);

	const toggleMenu = () => {
		setMenuAberto(!menuAberto);
	};

	function irParaSair() {
		setUsuario(null);
		sessionStorage.removeItem("usuario");
	}

	if (!usuario) {
		irParaEntrar();
	}

	useEffect(() => {
		const dadosSalvos = sessionStorage.getItem("usuario");
		if (dadosSalvos) {
			setUsuario(JSON.parse(dadosSalvos));
		}
	}, []);

	useEffect(() => {
		const dadosSalvos = sessionStorage.getItem("perfil");
		if (dadosSalvos) {
			setPerfil(JSON.parse(dadosSalvos));
		}
	}, []);


	return (
		<div>
			<div style={{ position: "absolute", top: "20px", left: "20px" }}>
				{usuario ? (
					<div style={{ position: "relative" }}>

						<button 
							className="btn btn-sm botao"
							onClick={toggleMenu}
							style={{ fontSize: "20px" }}
						>
							☰
						</button>

						{menuAberto && (
							<div 
								style={{
									position: "absolute",
									left: 0,
									top: "45px",
									background: "white",
									borderRadius: "10px",
									boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
									padding: "10px",
									zIndex: 1000,
									minWidth: "180px"
								}}
							>
								<button 
									className="dropdown-item"
									style={{ padding: "10px", width: "100%", textAlign: "left" }}
									onClick={() => {
										setMenuAberto(false);
										irParaPerfil();
									}}
								>
									👤 Perfil
								</button>

								{perfil < 3 && (
									<button 
										className="dropdown-item"
										style={{ padding: "10px", width: "100%", textAlign: "left" }}
										onClick={() => {
											setMenuAberto(false);
											irParaAdmin();
										}}
									>
										⚙️ Administração
									</button>
								)}

								<hr style={{ margin: "8px 0" }} />

								<button 
									className="dropdown-item text-danger"
									style={{ padding: "10px", width: "100%", textAlign: "left" }}
									onClick={() => {
										setMenuAberto(false);
										irParaSair();
									}}
								>
									Sair
								</button>
							</div>
						)}
					</div>
				) : (
					<button
						id="btnLogin" 
						className="btn btn-sm botao" 
						onClick={irParaEntrar}
					>
						👤 Entrar
					</button>
				)}
			</div>
			<div className="row">
				<div className="col-lg-5 fundo-transparente container-esquerda">
					<h1 style={{color: "#4B2E2E"}}>Bem-vindo ao Sweet Box</h1>

					<div className="subtitulo">
						<h4>Aqui, cada doce é feito com carinho e pensado <br/> para transformar momentos simples em lembranças inesquecíveis. Descubra sabores que encantam e surpreendem.</h4>
					</div>

					<div className="botoes row">
						<div className="col-lg-6"><button onClick={irParaPedido} className="botao-inicio">Faça seu Pedido</button></div>
					</div>
				</div>
				<div className="col-lg-7 p-0 fundo-rosa">
					<img src="images/SweetBox_Logo-removebg-preview.png" />
				</div>
			</div>
			<div className="conheca">
				<div className="conheca-quadro">
					<h1>Conheça nossa Empresa!</h1>
					<p className="paragrafo">
						Tudo começou com uma paixão por transformar ingredientes simples em momentos inesquecíveis. Em uma pequena cozinha, entre receitas de família e muita dedicação, nasceu o Sweet Box — um sonho que cresceu junto com o amor dos nossos clientes.
						Desde o primeiro bolo decorado até os pedidos personalizados que hoje encantam festas e celebrações, nossa missão sempre foi adoçar a vida das pessoas com qualidade, criatividade e afeto. Cada doce carrega um pedacinho da nossa história, feita com mãos talentosas e corações apaixonados.
						Hoje, o Sweet Box é mais do que uma confeitaria: é um espaço onde sabores contam histórias e cada cliente é parte da nossa jornada.
					</p>
				</div>
			</div>
			<footer>
				<div className="row">
					<div className="col-lg-6" style={{marginTop: "25px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "250px" }}>
						<div className="texto-rodape row">
							<h3 style={{textAlign: "center"}}>Fale Conosco</h3>
							<div className="col-lg-4" style={{textAlign: "left"}}>
								<b>Email:</b><br />
								<b>Whatsapp:</b><br />
								<b>Facebook:</b><br />
								<b>Instagram:</b>
							</div>
							<div className="col-lg-8" style={{textAlign: "left"}}>
								contato@sweetbox.com.br<br />
							 	(61) 9 9123-4567<br />
								@FlavisBoloseDoces<br />
							 	@flavisbolosedoces
							</div>
						</div>
					</div>
					<div className="col-lg-6" style={{marginTop: "25px"}}>
						<h4>Localização</h4>
						<iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d678.5808054837848!2d-48.03778025282898!3d-15.823309045877224!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x935a339c733f2439%3A0x3142a28b15bf52f4!2sFlavis%20Bolos%20e%20Doces!5e0!3m2!1spt-BR!2sbr!4v1761886992869!5m2!1spt-BR!2sbr" width="300" height="225" allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
					</div>
				</div>
			</footer>
		</div>
	);
}
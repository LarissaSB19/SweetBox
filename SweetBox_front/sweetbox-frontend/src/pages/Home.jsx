import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Home() {
	const navigate = useNavigate();

	const [usuario, setUsuario] = useState(null);
	const [perfil, setPerfil] = useState(null);

	const irParaPedido = () => {
		navigate("/pedido")
	}
	const irParaCardapio = () => {
		navigate("/cardapio")
	}
	const irParaEntrar = () => {
		navigate("/entrar")
	}
	const irParaAdmin = () => {
		navigate("/admin")
	}

	function irParaSair() {
		setUsuario(null);
		localStorage.removeItem("usuario");
	}

	if (!usuario) {
		irParaEntrar();
	}

	useEffect(() => {
		const dadosSalvos = localStorage.getItem("usuario");
		if (dadosSalvos) {
			setUsuario(JSON.parse(dadosSalvos));
		}
	}, []);

	useEffect(() => {
		const dadosSalvos = localStorage.getItem("perfil");
		if (dadosSalvos) {
			setPerfil(JSON.parse(dadosSalvos));
		}
	}, []);


	return (
		<div>
			<div className="float-left">
				{usuario ? (
					<div>
						<button id="btnLogout" className="btn btn-sm botao" onClick={irParaSair}>Sair</button>
						{perfil < 3 ? (
							<button id="btnAdmin" className="btn btn-sm botao" onClick={irParaAdmin}>Administração</button>
						) : null}
							
					</div>
				) : (
					<button id="btnLogin" className="btn btn-sm" onClick={irParaEntrar}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-fill" viewBox="0 0 16 16" style={{marginTop: "-3px"}}><path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/></svg>&nbsp;&nbsp;Entrar</button>
				)}
			</div>
			<div className="row">
				<div className="col-lg-5 fundo-transparente container-esquerda">
					<h1 style={{color: "#4B2E2E"}}>Bem-vindo ao Sweet Box</h1>

					<div className="subtitulo">
						<h4>Aqui, cada doce é feito com carinho e pensado <br/> para transformar momentos simples em lembranças inesquecíveis. Descubra sabores que encantam e surpreendem.</h4>
					</div>

					<div className="botoes row">
						<div className="col-lg-6"><button onClick={irParaCardapio} className="botao-inicio">Cardápio</button></div>
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
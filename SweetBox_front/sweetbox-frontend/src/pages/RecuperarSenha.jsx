import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function RecuperarSenha() {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		emailR: '',
		rSenha: ''
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log('Recuperação enviada:', formData);
		navigate('/Entrar');
	};

	return (
		<div
			className="pagina"
			style={{
				backgroundColor: "#f7eee7",
				minHeight: "100vh",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				padding: "20px"
			}}
		>
			<main style={{ width: "100%", maxWidth: "550px" }}>
				<div
					className="container"
					style={{
						backgroundColor: "#fff",
						padding: "40px 35px",
						borderRadius: "18px",
						boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
						border: "2px solid #a87f67"
					}}
				>
					<div className="text-center mb-4">
						<h1 style={{ color: '#4B2E2E', fontWeight: 'bold' }}>Esqueceu sua Senha?</h1>
						<p style={{ color: '#6a4f4b' }}>
							Não se preocupe, isso acontece! <br />
							Preencha os campos abaixo para recuperar sua senha.
						</p>
					</div>

					<form onSubmit={handleSubmit}>

						<label style={{ fontWeight: "bold", color: "#4B2E2E" }}>E-mail</label>
						<input
							type="email"
							name="emailR"
							value={formData.emailR}
							onChange={handleChange}
							required
							style={{
								width: "100%",
								padding: "10px",
								marginBottom: "15px",
								borderRadius: "8px",
								border: "1px solid #c5a48a"
							}}
						/>

						<label style={{ fontWeight: "bold", color: "#4B2E2E" }}>Nova Senha</label>
						<input
							type="password"
							name="rSenha"
							value={formData.rSenha}
							onChange={handleChange}
							required
							style={{
								width: "100%",
								padding: "10px",
								marginBottom: "25px",
								borderRadius: "8px",
								border: "1px solid #c5a48a"
							}}
						/>

						<button
							type="submit"
							style={{
								width: "100%",
								padding: "12px",
								backgroundColor: "#ccac99",
								border: "none",
								color: "white",
								fontWeight: "bold",
								borderRadius: "10px",
								cursor: "pointer"
							}}
						>
							Recuperar Senha
						</button>
					</form>

					<div className="text-center mt-3">
						<small>
							<Link to="/Entrar" style={{ color: "#6a4f4b" }}>
								Já tem uma conta? Entrar!
							</Link>
						</small>
					</div>

					<div className="text-center">
						<small>
							<Link to="/Cadastrar" style={{ color: "#6a4f4b" }}>
								Não tem uma conta? Cadastrar!
							</Link>
						</small>
					</div>
				</div>
			</main>
		</div>
	);
}

export default RecuperarSenha;

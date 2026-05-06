import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Entrar() {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		email: '',
		senha: ''
	});

	const [erro, setErro] = useState('');

  const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
  };


	const handleSubmit = async (e) => {
		e.preventDefault();
		setErro('');

		try {
			const response = await fetch("http://localhost:5179/api/Usuario/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email: formData.email,
					senha: formData.senha
				})
			});

			if (!response.ok) {
				setErro("Email ou senha inválidos.");
				return;
			}

			const dados = await response.json();

			sessionStorage.setItem("usuario", JSON.stringify(dados));
      sessionStorage.setItem("perfil", dados.idPerfil);
      
			navigate("/");
		}
		catch (error) {
			console.error("Erro no login:", error);
			setErro("Erro ao conectar com o servidor.");
		}
	};


  return (
    <div className="pagina" style={{ 
        backgroundColor: "#f7eee7",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    }}>

      <main style={{ width: "100%", maxWidth: "420px" }}>
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
            <h1 style={{ color: '#4B2E2E', fontWeight: "bold" }}>
              Bem-vindo de volta!
            </h1>
          </div>

          {erro && (
            <p style={{ color: "red", textAlign: "center" }}>{erro}</p>
          )}

          <form onSubmit={handleSubmit}>

            <label htmlFor="email" style={{ fontWeight: "bold", color: "#4B2E2E" }}>
              E-mail
            </label>
            <input
				type="text"
				id="email"
				name="email"
				value={formData.email}
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
			
            <label htmlFor="senha" style={{ fontWeight: "bold", color: "#4B2E2E" }}>
              Senha
            </label>
            <input
				type="password"
				id="senha"
				name="senha"
				value={formData.senha}
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

            <div className="text-center">
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
                Entrar
              </button>
            </div>

            <div className="text-center mt-3">
              <small>
                <Link to="/Cadastrar" style={{ color: '#6a4f4b' }}>
                  Não tem uma conta? Cadastrar
                </Link>
              </small>
            </div>

            <div className="text-center">
              <small>
                <Link to="/RecuperarSenha" style={{ color: '#6a4f4b' }}>
                  Esqueceu sua senha?
                </Link>
              </small>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
}

export default Entrar;
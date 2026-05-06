import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Cadastro() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    cpf: '',
    endereco: '',
    telefone: '',
    tpSexo: '',
    idade: '',
    senha: '',
    confirmarSenha: ''
  });

  

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'radio' ? e.target.id : value
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (formData.senha !== formData.confirmarSenha) {
    alert("As senhas não coincidem!");
    return;
  }

  const payload = {
    nome: formData.nome,
    email: formData.email,
    cpf: String(formData.cpf),     
    endereco: formData.endereco,
    telefone: formData.telefone,
    senha: formData.senha            
  };

  try {
    const response = await fetch("http://localhost:5179/api/Usuario", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Resposta do servidor:", response.status, text);
      alert(`Erro ao cadastrar: ${response.status} - ${text || "Sem mensagem do servidor"}`);
      return;
    }

    alert("Usuário cadastrado com sucesso!");
    navigate("/Entrar");
  } catch (err) {
    console.error("Erro ao conectar:", err);
    alert("Erro ao conectar com o servidor. Veja o console para detalhes.");
  }
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
          <form onSubmit={handleSubmit}>
            <div className="text-center mb-4">
              <h1 style={{ color: "#4B2E2E", fontWeight: "bold" }}>Faça seu Cadastro</h1>
            </div>

            <label style={{ fontWeight: "bold", color: "#4B2E2E" }}>Nome</label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
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

            <label style={{ fontWeight: "bold", color: "#4B2E2E" }}>E-mail</label>
            <input
              type="email"
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

            <label style={{ fontWeight: "bold", color: "#4B2E2E" }}>CPF</label>
            <input
              type="number"
              name="cpf"
              value={formData.cpf}
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

            <label style={{ fontWeight: "bold", color: "#4B2E2E" }}>Endereço</label>
            <textarea
              name="endereco"
              rows="4"
              value={formData.endereco}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "15px",
                borderRadius: "8px",
                border: "1px solid #c5a48a",
                resize: "none"
              }}
            />

            <label style={{ fontWeight: "bold", color: "#4B2E2E" }}>Telefone</label>
            <input
              type="tel"
              name="telefone"
              placeholder="(99) 99999-9999"
              value={formData.telefone}
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

            <label style={{ fontWeight: "bold", color: "#4B2E2E" }}>Senha</label>
            <input
              type="password"
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

            <label style={{ fontWeight: "bold", color: "#4B2E2E" }}>Confirmar senha</label>
            <input
              type="password"
              name="confirmarSenha"
              value={formData.confirmarSenha}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "20px",
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
              	Enviar
            </button>

            <div className="text-center mt-3">
              <small>
                <Link to="/Entrar" style={{ color: "#6a4f4b" }}>
                  Já tem uma conta? Entrar
                </Link>
              </small>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default Cadastro;

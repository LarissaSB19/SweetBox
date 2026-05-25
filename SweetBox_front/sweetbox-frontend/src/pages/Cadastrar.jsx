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
  const [requisitosSenha, setRequisitosSenha] = useState({
    tamanho: false,
    maiuscula: false,
    minuscula: false,
    numero: false,
    especial: false
  });
  const [senhaValida, setSenhaValida] = useState(true);

  
  const formatCPF = (value) => {
    value = value.replace(/\D/g, "");

    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

    return value;
  };

  const formatTelefone = (value) => {
    value = value.replace(/\D/g, "");

    value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
    value = value.replace(/(\d{5})(\d{4})$/, "$1-$2");

    return value;
  };

  const analisarSenha = (senha) => {
    setRequisitosSenha({
      tamanho: senha.length >= 8,
      maiuscula: /[A-Z]/.test(senha),
      minuscula: /[a-z]/.test(senha),
      numero: /\d/.test(senha),
      especial: /[@$!%*?&.#_-]/.test(senha)
    });
  };

  const handleChange = (e) => {
    const { name, value, type, id } = e.target;

    let newValue = value;

    if (name === "cpf") {
      newValue = formatCPF(value);
    } else if (name === "telefone") {
      newValue = formatTelefone(value);
    }

    if (name === "senha") {
      analisarSenha(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "radio" ? id : newValue
    }));
  };

  const validarSenha = (senha) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])[A-Za-z\d@$!%*?&.#_-]{8,}$/;

    return regex.test(senha);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (formData.senha !== formData.confirmarSenha) {
    alert("As senhas não coincidem!");
    return;
  }
  if (!validarSenha(formData.senha)) {
    alert("A senha deve ter no mínimo 8 caracteres, incluindo maiúscula, minúscula, número e caractere especial.");
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
              type="text"
              name="cpf"
              value={formData.cpf}
              onChange={handleChange}
              maxLength={14}
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
              value={formData.telefone}
              onChange={handleChange}
              maxLength={15}
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
            <div style={{ marginBottom: "15px" }}>
              <small style={{ color: "#4B2E2E", fontWeight: "bold" }}>
                Requisitos da senha:
              </small>

              <ul style={{ listStyle: "none", paddingLeft: "5px", marginTop: "5px" }}>
                <li style={{ color: requisitosSenha.tamanho ? "green" : "gray" }}>
                  {requisitosSenha.tamanho ? "✔" : "✖"} Mínimo 8 caracteres
                </li>
                <li style={{ color: requisitosSenha.maiuscula ? "green" : "gray" }}>
                  {requisitosSenha.maiuscula ? "✔" : "✖"} Letra maiúscula
                </li>
                <li style={{ color: requisitosSenha.minuscula ? "green" : "gray" }}>
                  {requisitosSenha.minuscula ? "✔" : "✖"} Letra minúscula
                </li>
                <li style={{ color: requisitosSenha.numero ? "green" : "gray" }}>
                  {requisitosSenha.numero ? "✔" : "✖"} Número
                </li>
                <li style={{ color: requisitosSenha.especial ? "green" : "gray" }}>
                  {requisitosSenha.especial ? "✔" : "✖"} Caractere especial
                </li>
              </ul>
            </div>

            <div style={{
              height: "8px",
              borderRadius: "5px",
              backgroundColor: "#ddd",
              marginBottom: "15px"
            }}>
              <div style={{
                height: "100%",
                width: `${
                  Object.values(requisitosSenha).filter(Boolean).length * 20
                }%`,
                backgroundColor:
                  Object.values(requisitosSenha).filter(Boolean).length <= 2
                    ? "red"
                    : Object.values(requisitosSenha).filter(Boolean).length <= 4
                    ? "orange"
                    : "green",
                borderRadius: "5px",
                transition: "0.3s"
              }} />
            </div>

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

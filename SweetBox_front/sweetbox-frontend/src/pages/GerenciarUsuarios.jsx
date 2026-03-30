import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5179/api/Usuario";

export default function GerenciarUsuarios() {
const [usuarios, setUsuarios] = useState([]);
const [modalAberto, setModalAberto] = useState(false);
const [editando, setEditando] = useState(false);
const [usuarioEditandoId, setUsuarioEditandoId] = useState(null);
const navigate = useNavigate();

const [form, setForm] = useState({ cpf: "", nome: "", email: "", telefone: "", endereco: "", senha: "", idPedido: 1, idPerfil: 3 });

useEffect(() => {
  carregarUsuarios();
}, []);

async function carregarUsuarios() {
  try {
    const resp = await fetch(API_URL);
    const data = await resp.json();
    setUsuarios(data);
  } catch (err) {
    console.error("Erro ao carregar usuários:", err);
  }
}

const abrirModalCriar = () => {
  setEditando(false);
  setForm({ cpf: "", nome: "", email: "", telefone: "", endereco: "", senha: "", idPedido: 1, idPerfil: 3 });
  setModalAberto(true);
};

const abrirModalEditar = (usuario) => {
  setEditando(true);
  setUsuarioEditandoId(usuario.idUsuario);

  setForm({
    cpf: usuario.cpf,
    nome: usuario.nome,
    email: usuario.email,
    telefone: usuario.telefone,
    endereco: usuario.endereco,
    senha: usuario.senha,
    idPedido: usuario.idPedido,
    idPerfil: usuario.idPerfil
  });

  setModalAberto(true);
};

const fecharModal = () => {
  setModalAberto(false);
};

const handleChange = (e) => {
  setForm({ ...form, [e.target.name]: e.target.value });
};

const salvarUsuario = async (e) => {
  e.preventDefault();

  const metodo = editando ? "PUT" : "POST";
  const url = editando ? `${API_URL}/${usuarioEditandoId}` : API_URL;

  const payload = {
    idUsuario: editando ? usuarioEditandoId : 0,
    cpf: form.cpf,
    nome: form.nome,
    email: form.email,
    telefone: form.telefone,
    endereco: form.endereco,
    senha: form.senha,
    idPedido: form.idPedido,
    idPerfil: form.idPerfil
  };

  try {
    await fetch(url, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    carregarUsuarios();
    fecharModal();
  } catch (err) {
    console.error("Erro ao salvar:", err);
  }
};

const excluirUsuario = async (id) => {
  if (!window.confirm("Deseja realmente excluir este usuário?")) return;

  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  carregarUsuarios();
};

const perfis = {
  1: "Admin",
  2: "Funcionário",
  3: "Usuário"
}

return (
  <div style={{textAlign: "left", margin: "15px"}}>

    <button type="button" id="btnVoltar" className="btn btn-sm" style={{backgroundColor: "#ccac99"}} onClick={() => navigate(-1)}>Voltar</button>

    <div style={{ padding: "30px", textAlign: "center" }}>
      
      

      <h1>Gerenciamento de Usuários</h1>

      <button style={btnCadastrar} onClick={abrirModalCriar}>
        Cadastrar Usuário
      </button>

      <table style={table}>
        <thead>
          <tr style={{ backgroundColor: "#eee" }}>
            <th style={thtd}>ID</th>
            <th style={thtd}>CPF</th>
            <th style={thtd}>Nome</th>
            <th style={thtd}>E-mail</th>
            <th style={thtd}>Telefone</th>
            <th style={thtd}>Endereço</th>
            <th style={thtd}>Perfil</th>
            <th style={thtd}>Ações</th>
          </tr>
        </thead>

        <tbody>
          {usuarios.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ padding: "20px" }}>
                Nenhum usuário cadastrado.
              </td>
            </tr>
          ) : (
            usuarios.map((p) => (
              <tr key={p.idUsuario}>
                <td style={thtd}>{p.idUsuario}</td>
                <td style={thtd}>{p.cpf}</td>
                <td style={thtd}>{p.nome}</td>
                <td style={thtd}>{p.email}</td>
                <td style={thtd}>{p.telefone}</td>
                <td style={thtd}>{p.endereco}</td>
                <td style={thtd}>{perfis[p.idPerfil]}</td>
                <td style={thtd}>
                  <button style={btnEditar} onClick={() => abrirModalEditar(p)}>
                    Editar
                  </button>

                  <button style={btnExcluir} onClick={() => excluirUsuario(p.idUsuario)}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {modalAberto && (
        <div style={modalFundo}>
          <div style={modalCaixa}>
            <h2>{editando ? "Editar Usuário" : "Cadastrar Usuário"}</h2>

            <form onSubmit={salvarUsuario} style={{ textAlign: "left" }}>
              <label>CPF:</label>
              <input
                type="text"
                name="cpf"
                value={form.cpf}
                onChange={handleChange}
                style={inputStyle}
                required
              />
              <label>Nome:</label>
              <input
                type="text"
                name="nome"
                value={form.nome}
                onChange={handleChange}
                style={inputStyle}
                required
              />

              <label>E-mail:</label>
              <input
                type="text"
                name="email"
                value={form.email}
                onChange={handleChange}
                style={inputStyle}
                required
              />

              <label>Telefone:</label>
              <input
                type="text"
                name="telefone"
                value={form.telefone}
                onChange={handleChange}
                style={inputStyle}
                required
              />

              <label>Endereço:</label>
              <input
                type="text"
                name="endereco"
                value={form.endereco}
                onChange={handleChange}
                style={inputStyle}
                required
              />

              <label>Senha:</label>
              <input
                type="password"
                name="senha"
                value={form.senha}
                onChange={handleChange}
                style={inputStyle}
                required
              />

              <label>Perfil:</label>
              <select
                name="idPerfil"
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="1">1 - Admin</option>
                <option value="2">2 - Funcionário</option>
                <option value="3">3 - Usuário</option>
              </select>

              <div style={btnsModalBox}>
                <button type="button" onClick={fecharModal} style={btnCancelar}>
                  Cancelar
                </button>

                <button type="submit" style={btnSalvar}>
                  {editando ? "Atualizar" : "Salvar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div> 
  </div>
);
}


const table = {
width: "80%",
margin: "40px auto",
borderCollapse: "collapse",
};

const thtd = {
border: "1px solid #ccc",
padding: "10px",
textAlign: "center",
};

const btnCadastrar = {
padding: "10px 20px",
marginTop: "20px",
backgroundColor: "#7b4d4d",
border: "none",
color: "white",
borderRadius: "6px",
cursor: "pointer",
};

const btnEditar = {
marginRight: "8px",
padding: "5px 10px",
backgroundColor: "#3578e5",
color: "white",
border: "none",
borderRadius: "5px",
cursor: "pointer",
};

const btnExcluir = {
padding: "5px 10px",
backgroundColor: "#d9534f",
color: "white",
border: "none",
borderRadius: "5px",
cursor: "pointer",
};

const inputStyle = {
width: "100%",
padding: "8px",
marginTop: "5px",
marginBottom: "15px",
borderRadius: "5px",
border: "1px solid #ccc",
};

const modalFundo = {
position: "fixed",
top: 0,
left: 0,
width: "100%",
height: "100%",
background: "rgba(0,0,0,0.6)",
display: "flex",
justifyContent: "center",
alignItems: "center",
};

const modalCaixa = {
background: "white",
width: "400px",
padding: "25px",
borderRadius: "10px",
boxShadow: "0 0 10px rgba(0,0,0,0.4)",
};

const btnsModalBox = {
marginTop: "20px",
textAlign: "right",
};

const btnCancelar = {
marginRight: "10px",
padding: "6px 12px",
cursor: "pointer",
backgroundColor: "#d9534f",
color: "white"
};

const btnSalvar = {
padding: "6px 12px",
backgroundColor: "#7b4d4d",
color: "white",
border: "none",
borderRadius: "6px",
cursor: "pointer",
};

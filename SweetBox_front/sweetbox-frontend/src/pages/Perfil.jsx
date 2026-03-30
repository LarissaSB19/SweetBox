import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Perfil() {
  const [usuario, setUsuario] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const [editando, setEditando] = useState(false);
  const [dadosEditados, setDadosEditados] = useState({});
  const navigate = useNavigate();
  const [menuAberto, setMenuAberto] = useState(false);
  const [perfil, setPerfil] = useState(null);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  useEffect(() => {
    const dadosPerfil = sessionStorage.getItem("perfil");
    if (dadosPerfil) {
      setPerfil(JSON.parse(dadosPerfil));
    }
  }, []);

  const toggleMenu = () => setMenuAberto(!menuAberto);

  const irParaPerfil = () => navigate("/perfil");
  const irParaAdmin = () => navigate("/admin");

  function irParaSair() {
    sessionStorage.removeItem("usuario");
    sessionStorage.removeItem("perfil");
    navigate("/entrar");
  }

  useEffect(() => {
    const dadosUsuario = sessionStorage.getItem("usuario");

    if (!dadosUsuario) {
      navigate("/entrar");
      return;
    }

    const IdUsuario = JSON.parse(dadosUsuario);

    if (!IdUsuario) {
      console.error("ID não encontrado", dadosUsuario);
      return;
    }

    fetch(`http://localhost:5179/api/Usuario/perfil/${IdUsuario}`)
      .then((res) => res.json())
      .then((data) => {
        setUsuario(data.usuario);
        setPedidos(data.pedidos);
        setDadosEditados(data.usuario);
      })
      .catch((err) => console.error("Erro ao buscar perfil:", err));
  }, [navigate]);

  const salvarEdicao = () => {
    const dadosParaEnviar = { ...dadosEditados };

    // ❗ se senha estiver vazia, não manda
    if (!dadosParaEnviar.senha) {
      delete dadosParaEnviar.senha;
    }

    fetch(`http://localhost:5179/api/Usuario/${usuario.idUsuario}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dadosParaEnviar),
    })
      .then(() => {
        setUsuario({ ...usuario, ...dadosParaEnviar });
        setEditando(false);
      })
      .catch((err) => console.error("Erro ao salvar:", err));
  };

  if (!usuario) return <p>Carregando...</p>;

  return (
    <div className="container mt-4">

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
              onClick={() => navigate("/")}
              style={{ padding: "10px", width: "100%", textAlign: "left" }}
            >
              🏠 Página Inicial
            </button>

            {usuario.idPerfil < 3 && (
              <button 
                className="dropdown-item"
                onClick={() => navigate("/admin")}
                style={{ padding: "10px", width: "100%", textAlign: "left" }}
              >
                ⚙️ Administração
              </button>
            )}

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

      <div className="card p-4 shadow">

        <div className="d-flex justify-content-between align-items-center">
          <h2>Perfil</h2>

          {!editando ? (
            <button
              className="btn btn-primary"
              onClick={() => setEditando(true)}
            >
              Editar
            </button>
          ) : (
            <button
              className="btn btn-success"
              onClick={salvarEdicao}
            >
              Salvar
            </button>
          )}
        </div>

        <div className="mt-3">

          <p>
            <strong>Nome:</strong>{" "}
            {editando ? (
              <input
                className="form-control"
                value={dadosEditados.nome || ""}
                onChange={(e) =>
                  setDadosEditados({ ...dadosEditados, nome: e.target.value })
                }
              />
            ) : (
              usuario.nome
            )}
          </p>

          <p>
            <strong>CPF:</strong>{" "}
            {editando ? (
              <input
                className="form-control"
                value={dadosEditados.cpf || ""}
                onChange={(e) =>
                  setDadosEditados({ ...dadosEditados, cpf: e.target.value })
                }
              />
            ) : (
              usuario.cpf
            )}
          </p>

          <p>
            <strong>Email:</strong>{" "}
            {editando ? (
              <input
                className="form-control"
                value={dadosEditados.email || ""}
                onChange={(e) =>
                  setDadosEditados({ ...dadosEditados, email: e.target.value })
                }
              />
            ) : (
              usuario.email
            )}
          </p>

          <p>
            <strong>Telefone:</strong>{" "}
            {editando ? (
              <input
                className="form-control"
                value={dadosEditados.telefone || ""}
                onChange={(e) =>
                  setDadosEditados({ ...dadosEditados, telefone: e.target.value })
                }
              />
            ) : (
              usuario.telefone
            )}
          </p>

          <p>
            <strong>Endereço:</strong>{" "}
            {editando ? (
              <input
                className="form-control"
                value={dadosEditados.endereco || ""}
                onChange={(e) =>
                  setDadosEditados({ ...dadosEditados, endereco: e.target.value })
                }
              />
            ) : (
              usuario.endereco
            )}
          </p>

          <p>
            <strong>Senha:</strong>{" "}

            {editando ? (
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <input
                  type={mostrarSenha ? "text" : "password"}
                  className="form-control"
                  value={dadosEditados.senha || ""}
                  onChange={(e) =>
                    setDadosEditados({ ...dadosEditados, senha: e.target.value })
                  }
                />

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                >
                  {mostrarSenha ? "🙈" : "👁️"}
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <input
                  type={mostrarSenha ? "text" : "password"}
                  className="form-control"
                  value={usuario.senha || ""}
                  readOnly
                />

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                >
                  {mostrarSenha ? "🙈" : "👁️"}
                </button>
              </div>
            )}
          </p>

        </div>
      </div>

      {usuario.idPerfil === 3 && (
        <div className="card mt-4 p-4 shadow">
          <h3>Últimos Pedidos</h3>

          {pedidos.length === 0 ? (
            <p>Nenhum pedido encontrado</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Status</th>
                  <th>Valor</th>
                  <th>Data</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map((pedido) => (
                  <tr key={pedido.idPedido}>
                    <td>{pedido.idPedido}</td>
                    <td>{pedido.statusPedido}</td>
                    <td>R$ {pedido.valorTotal}</td>
                    <td>
                      {new Date(pedido.dataPedido).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

const botaoVoltar = {
  position: "absolute",
  top: "20px",
  left: "20px",
  padding: "8px 14px",
  borderRadius: "10px",
  border: "none",
  background: "#fff",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  cursor: "pointer",
};
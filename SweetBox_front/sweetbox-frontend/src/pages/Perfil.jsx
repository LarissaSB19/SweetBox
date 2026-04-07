import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Perfil() {
  const [usuario, setUsuario] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const [editando, setEditando] = useState(false);
  const [dadosEditados, setDadosEditados] = useState({});
  const [menuAberto, setMenuAberto] = useState(false);
  const [pedidoAberto, setPedidoAberto] = useState(null);

  const navigate = useNavigate();

  const toggleMenu = () => setMenuAberto(!menuAberto);

  const irParaHome = () => navigate("/");
  const irParaAdmin = () => navigate("/admin");
  const irParaEntrar = () => navigate("/entrar");
  const irParaMeusPedidos = () => navigate("/meusPedidos");

  const irParaSair = () => {
    sessionStorage.clear();
    navigate("/entrar");
  };

  useEffect(() => {
    const dadosUsuario = sessionStorage.getItem("usuario");

    if (!dadosUsuario) {
      navigate("/entrar");
      return;
    }

    const usuarioObj = JSON.parse(dadosUsuario);
    const idUsuario = usuarioObj.idUsuario;

    fetch(`http://localhost:5179/api/Usuario/perfil/${idUsuario}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Erro na API");
        }
        return res.json();
      })
      .then((data) => {
        console.log("USUARIO:", data.usuario);
        console.log("PEDIDOS:", data.pedidos);
        console.log("PRIMEIRO PEDIDO:", data.pedidos?.[0]);

        setUsuario(data.usuario);
        setPedidos(data.pedidos || []);
        setDadosEditados(data.usuario);
      })
          .catch((err) => {
            console.error("Erro ao buscar perfil:", err);
          });
        }, [navigate]);

  const salvarEdicao = () => {
    const dadosParaEnviar = { ...dadosEditados };

    if (!dadosParaEnviar.senha) {
      delete dadosParaEnviar.senha;
    }

    fetch(`http://localhost:5179/api/Usuario/${usuario.idUsuario}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dadosParaEnviar),
    })
      .then(() => {
        setUsuario({ ...usuario, ...dadosParaEnviar });
        setEditando(false);
      })
      .catch((err) => console.error("Erro ao salvar:", err));
  };

  const getStatusColor = (status) => {
    if (status === "Entregue") return "#28a745";
    if (status === "Pendente") return "#ffc107";
    return "#dc3545";
  };

  if (!usuario) return <p>Carregando...</p>;

   const perfil = usuario.idPerfil || usuario.IdPerfil;

  return (
    <div style={styles.container}>

      <div style={{ position: "absolute", top: "20px", left: "20px" }}>
        <button onClick={toggleMenu} style={styles.menuButton}>
          ☰
        </button>

        {menuAberto && (
          <div style={styles.dropdown}>

            <button
              style={styles.item}
              onClick={() => {
                setMenuAberto(false);
                irParaHome();
              }}
            >
              🏠 Página Inicial
            </button>
          
            <button
              className="dropdown-item"
              style={{ padding: "10px", width: "100%", textAlign: "left" }}
              onClick={() => {
              setMenuAberto(false);
              irParaMeusPedidos(); }}>

              📦 Meus Pedidos
						</button>

            {perfil < 3 && (
              <button
                style={styles.item}
                onClick={() => {
                  setMenuAberto(false);
                  irParaAdmin();
                }}
              >
                ⚙️ Administração
              </button>
            )}

            <hr style={styles.divider} />

            <button
              style={{ ...styles.item, color: "#dc3545" }}
              onClick={() => {
                setMenuAberto(false);
                irParaSair();
              }}
            >
              🚪 Sair
            </button>
          </div>
        )}
      </div>

      <div style={styles.content}>
        <div style={styles.card}>
          <div style={styles.header}>
            <h2>Meu Perfil</h2>

            {!editando ? (
              <button style={styles.btnPrimary} onClick={() => setEditando(true)}>
                Editar
              </button>
            ) : (
              <button style={styles.btnSuccess} onClick={salvarEdicao}>
                Salvar
              </button>
            )}
          </div>

          <div style={styles.form}>
            {["nome", "cpf", "email", "telefone", "endereco"].map((campo) => (
              <div key={campo}>
                <label style={styles.label}>{campo.toUpperCase()}</label>

                {editando ? (
                  <input
                    style={styles.input}
                    value={dadosEditados[campo] || ""}
                    onChange={(e) =>
                      setDadosEditados({
                        ...dadosEditados,
                        [campo]: e.target.value,
                      })
                    }
                  />
                ) : (
                  <p style={styles.text}>{usuario[campo]}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: "#f7eee7",
    minHeight: "100vh",
    padding: "20px",
    fontFamily: "Arial",
  },

  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "25px",
  },

  card: {
    background: "#fff",
    borderRadius: "18px",
    padding: "25px",
    border: "2px solid #a87f67",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    width: "100%",
    maxWidth: "800px",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "25px",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },

  label: {
    fontSize: "12px",
    color: "#7a5c4d",
  },

  text: {
    fontSize: "16px",
    color: "#4B2E2E",
  },

  input: {
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #ccac99",
    background: "#fdf6f2",
    outline: "none",
  },

  btnPrimary: {
    background: "#ccac99",
    color: "#fff",
    border: "none",
    padding: "10px 18px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  btnSuccess: {
    background: "#8B4513",
    color: "#fff",
    border: "none",
    padding: "10px 18px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  listaPedidos: {
    marginTop: "15px",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
  },

  pedidoCard: {
    background: "#fff",
    borderRadius: "12px",
    padding: "15px",
    border: "1px solid #e0e0e0",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  pedidoHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  pedidoInfo: {
    fontSize: "13px",
    color: "#666",
  },

  statusBadge: {
    background: "#e6f4ea",
    color: "#2e7d32",
    padding: "4px 8px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "bold",
  },

  valor: {
    fontWeight: "bold",
    color: "#4B2E2E",
  },

  detalhes: {
    marginTop: "10px",
    paddingTop: "10px",
    borderTop: "1px solid #eee",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  itemPedido: {
    fontSize: "13px",
    color: "#444",
    borderTop: "1px solid #eee",
    paddingTop: "6px",
  },

  acoes: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
  },

  btnLink: {
    background: "none",
    border: "none",
    color: "#e53935",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "13px",
  },

  seta: {
    marginLeft: "8px",
    fontSize: "12px",
    color: "#7a5c4d",
  },

  menuButton: {
    fontSize: "20px",
    background: "#ccac99",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    borderRadius: "10px",
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
  },

  dropdown: {
    position: "absolute",
    top: "45px",
    left: 0,
    background: "#fff",
    borderRadius: "12px",
    padding: "10px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
    minWidth: "200px",
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },

  item: {
    padding: "10px",
    border: "none",
    background: "transparent",
    textAlign: "left",
    cursor: "pointer",
    borderRadius: "8px",
    fontSize: "14px",
  },

  divider: {
    margin: "8px 0",
    borderColor: "#eee",
  },
};
import { useState, useEffect } from "react";

const API_URL = "http://localhost:5179/api/Produto";

export default function GerenciarProdutos() {
  const [produtos, setProdutos] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState(false);
  const [produtoEditandoId, setProdutoEditandoId] = useState(null);

  const [form, setForm] = useState({
    nomeProduto: "",
    preco: "",
    descricao: "",
    idCategoria: 1,
    idEstoque: 1
  });

  useEffect(() => {
    carregarProdutos();
  }, []);

  async function carregarProdutos() {
    try {
      const resp = await fetch(API_URL);
      const data = await resp.json();
      setProdutos(data);
    } catch (err) {
      console.error("Erro ao carregar produtos:", err);
    }
  }

  const abrirModalCriar = () => {
    setEditando(false);
    setForm({ nomeProduto: "", preco: "", descricao: "", idCategoria: 1, idEstoque: 1 });
    setModalAberto(true);
  };

  const abrirModalEditar = (produto) => {
    setEditando(true);
    setProdutoEditandoId(produto.idProduto);

    setForm({
      nomeProduto: produto.nomeProduto,
      preco: produto.preco ?? "",
      descricao: produto.descricao,
      idCategoria: produto.idCategoria,
      idEstoque: produto.idEstoque
    });

    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const salvarProduto = async (e) => {
    e.preventDefault();

    const metodo = editando ? "PUT" : "POST";
    const url = editando ? `${API_URL}/${produtoEditandoId}` : API_URL;

    const payload = {
      idProduto: editando ? produtoEditandoId : 0,
      nomeProduto: form.nomeProduto,
      idEstoque: form.idEstoque,
      descricao: form.descricao,
      idCategoria: form.idCategoria,
      preco: parseFloat(form.preco)
    };

    try {
      await fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      carregarProdutos();
      fecharModal();
    } catch (err) {
      console.error("Erro ao salvar:", err);
    }
  };

  // ❌ EXCLUIR
  const excluirProduto = async (id) => {
    if (!window.confirm("Deseja realmente excluir este produto?")) return;

    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    carregarProdutos();
  };

  return (
    <div style={{ padding: "30px", textAlign: "center" }}>
      <h1>Administração</h1>

      <button style={btnCadastrar} onClick={abrirModalCriar}>
        Cadastrar Produto
      </button>

      <table style={table}>
        <thead>
          <tr style={{ backgroundColor: "#eee" }}>
            <th style={thtd}>ID</th>
            <th style={thtd}>Nome</th>
            <th style={thtd}>Preço</th>
            <th style={thtd}>Descrição</th>
            <th style={thtd}>Ações</th>
          </tr>
        </thead>

        <tbody>
          {produtos.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ padding: "20px" }}>
                Nenhum produto cadastrado.
              </td>
            </tr>
          ) : (
            produtos.map((p) => (
              <tr key={p.idProduto}>
                <td style={thtd}>{p.idProduto}</td>
                <td style={thtd}>{p.nomeProduto}</td>
                <td style={thtd}>R$ {p.preco}</td>
                <td style={thtd}>{p.descricao}</td>
                <td style={thtd}>
                  <button style={btnEditar} onClick={() => abrirModalEditar(p)}>
                    Editar
                  </button>

                  <button style={btnExcluir} onClick={() => excluirProduto(p.idProduto)}>
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
            <h2>{editando ? "Editar Produto" : "Cadastrar Produto"}</h2>

            <form onSubmit={salvarProduto} style={{ textAlign: "left" }}>
              <label>Nome:</label>
              <input
                type="text"
                name="nomeProduto"
                value={form.nomeProduto}
                onChange={handleChange}
                style={inputStyle}
                required
              />

              <label>Preço:</label>
              <input
                type="number"
                name="preco"
                value={form.preco}
                onChange={handleChange}
                style={inputStyle}
                required
              />

              <label>Descrição:</label>
              <textarea
                name="descricao"
                value={form.descricao}
                onChange={handleChange}
                style={{ ...inputStyle, height: "80px" }}
              />

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

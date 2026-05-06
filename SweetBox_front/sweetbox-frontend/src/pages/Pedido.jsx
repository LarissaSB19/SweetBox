import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5179/api/Produto";

export default function Pedidos() {
  const [produtos, setProdutos] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [carrinho, setCarrinho] = useState([]);
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    carregarProdutos();
  }, []);

  useEffect(() => {
    if (produtoSelecionado) {
      setCarrinhoAberto(false);
    }
  }, [produtoSelecionado]);

  useEffect(() => {
    const usuario = JSON.parse(sessionStorage.getItem("usuario"));

    if (!usuario) {
      navigate("/login");
    }
  }, []);

  async function carregarProdutos() {
    const resp = await fetch(API_URL);
    const data = await resp.json();
    setProdutos(data);
  }

  function adicionarAoCarrinho(item) {
    const produto = produtos.find((p) => p.idProduto === item.idProduto);

    const novoItem = {
      ...item,
      nomeProduto: produto?.nomeProduto || "Produto",
    };

    if (produtoSelecionado?.indexCarrinho !== undefined) {
      setCarrinho(prev => {
        const copia = [...prev];
        copia[produtoSelecionado.indexCarrinho] = novoItem;
        return copia;
      });
    } else {
      setCarrinho(prev => [...prev, novoItem]);
    }

    setProdutoSelecionado(null);
  }

  function removerItem(index) {
  setCarrinho((prev) => prev.filter((_, i) => i !== index));
  }

  function editarItem(index) {
    const item = carrinho[index];

    const produto = produtos.find(p => p.idProduto === item.idProduto);

    setCarrinhoAberto(false);

    setProdutoSelecionado({
      ...produto,
      itemEditando: item,
      indexCarrinho: index
    });
  }

  function finalizarPedido() {

  const usuario = JSON.parse(sessionStorage.getItem("usuario"));

  if (!usuario) {
    alert("Faça login primeiro!");
    return;
  }

  if (carrinho.length === 0) {
    alert("Carrinho vazio!");
    return;
  }

  const total = carrinho.reduce(
    (t, i) => t + (i.precoTotal || i.precoUnitario),
    0
  );

  const pedido = {
    idCliente: usuario.idUsuario,
    itens: carrinho.map(item => ({
      idProduto: item.idProduto,
	  nomeProduto: item.nomeProduto,
      quantidade: item.quantidade,
      precoUnitario: item.precoTotal || item.precoUnitario,
      parametrosBolo: (item.parametrosBolo || []).map(p => ({
        idParametro: p.idParametro,
        valorEscolhido: p.valorEscolhido,
        quantidade: p.quantidade || 0
      }))
    })),
    valorTotal: total
  };

  sessionStorage.setItem("pedido", JSON.stringify(pedido));

  navigate("/finalizacaoPedido");
}

  return (

    <div style={pagina}>
      <div style={{ padding: "30px"}}>
        <button style={botaoVoltar} onClick={() => navigate(-1)}>
          Voltar
        </button>
    
        <div style={container}>
          <div style={conteudo}>


            <h1 style={titulo}>Monte seu Pedido</h1>

            <div style={grid}>
              {produtos.map((p) => (
                <div
                  key={p.idProduto}
                  style={card}
                  className="card-hover"
                  onClick={() => {
                    setCarrinhoAberto(false);
                    setProdutoSelecionado(p);
                  }}                
                >
                  <img
                    src={
                      p.imagem?.startsWith("http")
                        ? p.imagem
                        : `http://localhost:5179/${p.imagem}`
                    }
                    alt={p.nomeProduto}
                    style={img}
                  />

                  <div style={cardConteudo}>
                    <h3 style={{ color: "#5c3d2e" }}>{p.nomeProduto}</h3>
                    <p style={{ fontWeight: "bold", color: "black" }}>
                      R$ {p.preco}
                    </p>
                    <small style={descricaoProduto}>{p.descricao}</small>
                  </div>
                </div>
              ))}
            </div>

            {produtoSelecionado && (
              <ModalProduto
                produto={produtoSelecionado}
                fechar={() => setProdutoSelecionado(null)}
                adicionarAoCarrinho={adicionarAoCarrinho}
              />
            )}
          </div>
        </div>

      {!produtoSelecionado && (
    <div style={{ position: "fixed", right: "20px", bottom: "30px", zIndex: 1000 }}>
      
      <button
        onClick={() => setCarrinhoAberto(true)}
        style={{
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          border: "none",
          background: "#ccac99",
          color: "#fff",
          fontSize: "26px",
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        }}
      >
        🛒

        {carrinho.length > 0 && (
          <span
            style={{
              position: "absolute",
              top: "-5px",
              right: "-5px",
              background: "#e53935",
              color: "#fff",
              borderRadius: "50%",
              fontSize: "12px",
              width: "22px",
              height: "22px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: "bold",
            }}
          >
            {carrinho.length}
          </span>
        )}
      </button>

    </div>
  )}
          {carrinhoAberto && (
            <div
              onClick={() => setCarrinhoAberto(false)}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "rgba(0,0,0,0.5)",
                zIndex: 1000,
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  width: "350px",
                  height: "100%",
                  background: "#fff",
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: "-4px 0 12px rgba(0,0,0,0.2)",
                  animation: "slideIn 0.3s ease",
                }}
              >
                <button
                  onClick={() => setCarrinhoAberto(false)}
                  style={{
                    alignSelf: "flex-end",
                    border: "none",
                    background: "transparent",
                    fontSize: "20px",
                    cursor: "pointer",
                  }}
                >
                  ✕
                </button>

                <h2>Carrinho ({carrinho.length})</h2>

                <div style={{ flex: 1, overflowY: "auto" }}>
                  {carrinho.length === 0 && <p>Seu carrinho está vazio</p>}

                  {carrinho.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        borderBottom: "1px solid #eee",
                        padding: "10px 0",
                        position: "relative",
                      }}
                    >
                      <button
                        onClick={() => editarItem(index)}
                        style={{
                          position: "absolute",
                          right: "25px",
                          top: "0",
                          border: "none",
                          background: "transparent",
                          color: "#555",
                          cursor: "pointer",
                        }}
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() =>
                          setCarrinho((prev) =>
                            prev.filter((_, i) => i !== index)
                          )
                        }
                        style={{
                          position: "absolute",
                          right: 0,
                          top: 0,
                          border: "none",
                          background: "transparent",
                          color: "red",
                          cursor: "pointer",
                        }}
                      >
                        ✕
                      </button>

                      <div style={{ fontWeight: "bold", fontSize: "16px", marginBottom: "5px" }}>
                        {item.nomeProduto}
                      </div>

                      <div>Qtd: {item.quantidade}</div>
                      <div>
                        R$ {(item.precoTotal || item.precoUnitario).toFixed(2)}
                      </div>

                      <div style={{ fontSize: "13px", marginTop: "5px" }}>
                        {item.parametrosBolo?.map((p, i) => (
                          <div key={i}>
                            • {p.valorEscolhido}
                            {p.quantidade ? ` (${p.quantidade})` : ""}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: "1px solid #eee", paddingTop: "10px" }}>
                  <h3>
                    Total: R${" "}
                    {carrinho
                      .reduce((t, i) => t + (i.precoTotal || i.precoUnitario), 0)
                      .toFixed(2)}
                  </h3>

                  <button style={button} onClick={finalizarPedido}>
                    Finalizar Pedido
                  </button>

                  <button
                    style={{ ...buttonSecondary, marginTop: "10px" }}
                  >
                    Limpar
                  </button>
                </div>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}

function ModalProduto({ produto, fechar, adicionarAoCarrinho }) {
  const tipo = produto.categoria?.nomeCategoria;

  if (tipo === "Bolos")
    return <ModalDinamico {...{ produto, fechar, adicionarAoCarrinho }} />;
  if (tipo === "Doces")
    return <ModalDoces {...{ produto, fechar, adicionarAoCarrinho }} />;
  if (tipo === "Bombons")
    return <ModalBombom {...{ produto, fechar, adicionarAoCarrinho }} />;

  return <ModalPadrao {...{ produto, fechar, adicionarAoCarrinho }} />;
}

function ModalDinamico({ produto, fechar, adicionarAoCarrinho }) {
  const [valores, setValores] = useState({});
  const [recheio1, setRecheio1] = useState(null);
  const [recheio2, setRecheio2] = useState(null);

  useEffect(() => {
    if (produto.itemEditando) {
      const item = produto.itemEditando;

      const novosValores = {};

      item.parametrosBolo?.forEach(p => {
        const encontrado = produto.produtosParametrosBolo.find(
          x => x.idParametro === p.idParametro
        );

        if (encontrado?.tipoParametro === "Tamanho") {
          novosValores.tamanho = encontrado;
        }

        if (encontrado?.tipoParametro === "Massa") {
          novosValores.massa = encontrado;
        }

        if (encontrado?.tipoParametro === "Recheio1") {
          setRecheio1(encontrado);
        }

        if (encontrado?.tipoParametro === "Recheio2") {
          setRecheio2(encontrado);
        }
      });

      setValores(novosValores);
    }
  }, [produto]);

  const parametros = produto.produtosParametrosBolo;

  const tamanhos = parametros.filter((p) => p.tipoParametro === "Tamanho");
  const massas = parametros.filter((p) => p.tipoParametro === "Massa");
  const recheios1 = parametros.filter((p) => p.tipoParametro === "Recheio1");
  const recheios2 = parametros.filter((p) => p.tipoParametro === "Recheio2");

	function calcularPreco() {
		let soma = 0;

		Object.values(valores).forEach((v) => {
			soma += Number(v?.multiplicador || 0);
		});

		soma += Number(recheio1?.multiplicador || 0);
		soma += Number(recheio2?.multiplicador || 0);

		return produto.preco * soma;
	}


  const adicionar = () => {
    if (!valores.tamanho) {
      alert("Selecione o tamanho do bolo!");
      return;
    }

    if (!valores.massa) {
      alert("Selecione a massa!");
      return;
    }

    if (!recheio1) {
      alert("Selecione o recheio 1!");
      return;
    }

    if (!recheio2) {
      alert("Selecione o recheio 2!");
      return;
    }
    const params = [];

    Object.values(valores).forEach((p) => {
      params.push({
        idParametro: p.idParametro,
        valorEscolhido: p.nomeParametro,
      });
    });

    if (recheio1) {
      params.push({
        idParametro: recheio1.idParametro,
        valorEscolhido: recheio1.nomeParametro,
      });
    }

    if (recheio2) {
      params.push({
        idParametro: recheio2.idParametro,
        valorEscolhido: recheio2.nomeParametro,
      });
    }

    adicionarAoCarrinho({
      idProduto: produto.idProduto,
      quantidade: 1,
      precoUnitario: calcularPreco(),
      parametrosBolo: params,
    });

    fechar();
  };

  return (
    <div style={modalFundo} onClick={fechar}>
      <div style={modalBox} onClick={(e) => e.stopPropagation()}>
        <button style={btnFechar} onClick={fechar}>
          ×
        </button>
        <h2 style={tituloModal}>{produto.nomeProduto}</h2>
        

        <label style={label}>Tamanho</label>
        <select
          style={select}
          onChange={(e) => {
            const param = tamanhos.find(
              (p) => p.idParametro === Number(e.target.value)
            );
            setValores((prev) => ({ ...prev, tamanho: param }));
          }}
        >
          <option>Selecione</option>
          {tamanhos.map((t) => (
            <option key={t.idParametro} value={t.idParametro}>
              {t.nomeParametro}  {t.descParametro}
            </option>
          ))}
        </select>

        <label style={label}>Massa</label>
        <select
          style={select}
          onChange={(e) => {
            const param = massas.find(
              (p) => p.idParametro === Number(e.target.value)
            );
            setValores((prev) => ({ ...prev, massa: param }));
          }}
        >
          <option>Selecione</option>
          {massas.map((m) => (
            <option key={m.idParametro} value={m.idParametro}>
              {m.nomeParametro}
            </option>
          ))}
        </select>

        <h3>Recheio 1</h3>
        <div style={conteudoModal}>
          {recheios1.map((r) => (
            <div
              key={r.idParametro}
              style={{
                ...linhaSabor,
                background:
                  recheio1?.idParametro === r.idParametro
                    ? "#ccac99"
                    : "#f9f9f9",
                color:
                  recheio1?.idParametro === r.idParametro ? "#fff" : "#000",
              }}
              onClick={() => setRecheio1(r)}
            >
              {r.nomeParametro} {r.descParametro}
            </div>
          ))}
        </div>

        <h3>Recheio 2</h3>
        <div style={conteudoModal}>
          {recheios2.map((r) => (
            <div
              key={r.idParametro}
              style={{
                ...linhaSabor,
                background:
                  recheio2?.idParametro === r.idParametro
                    ? "#ccac99"
                    : "#f9f9f9",
                color:
                  recheio2?.idParametro === r.idParametro ? "#fff" : "#000",
              }}
              onClick={() => setRecheio2(r)}
            >
              {r.nomeParametro} {r.descParametro}
            </div>
          ))}
        </div>

        <h3 style={{ marginTop: "15px" }}>
          Total: R$ {calcularPreco().toFixed(2)}
        </h3>

        <div style={footerModal}>
          <button style={button} onClick={adicionar}>
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
}

function ModalDoces({ produto, fechar, adicionarAoCarrinho }) {
  const [sabores, setSabores] = useState({});

  useEffect(() => {
    if (produto.itemEditando) {
      const novos = {};

      produto.itemEditando.parametrosBolo?.forEach(p => {
        novos[p.idParametro] = p.quantidade;
      });

      setSabores(novos);
    }
  }, [produto]);

  const saboresDisponiveis = produto.produtosParametrosBolo.filter(
    (p) => p.tipoParametro === "SaborDoces"
  );

  const alterar = (idParametro, delta) => {
    setSabores((prev) => {
      const atual = prev[idParametro] || 0;
      const novo = Math.max(0, atual + delta);

      return {
        ...prev,
        [idParametro]: novo,
      };
    });
  };

  const total = Object.values(sabores).reduce((acc, v) => acc + v, 0);

  function calcularPreco() {
    let totalPreco = 0;

    Object.entries(sabores).forEach(([id, qtd]) => {
      if (qtd > 0) {
        const sabor = saboresDisponiveis.find(
          (p) => p.idParametro === Number(id)
        );

        const multiplicador = Number(sabor?.mutiplicador || 1);

        totalPreco += produto.preco * multiplicador * qtd;
      }
    });

    return totalPreco;
  }

  const adicionar = () => {
    if (total === 0) {
      alert("Selecione pelo menos um sabor!");
      return;
    }

    const itens = Object.entries(sabores)
      .filter(([_, qtd]) => qtd > 0)
      .map(([idParametro, qtd]) => {
        const param = saboresDisponiveis.find(
          (p) => p.idParametro === Number(idParametro)
        );

        return {
          idParametro: param.idParametro,
          valorEscolhido: param.nomeParametro,
          quantidade: qtd,
        };
      });

    adicionarAoCarrinho({
      idProduto: produto.idProduto,
      quantidade: total,
      precoUnitario: calcularPreco(),
      parametrosBolo: itens,
    });

    fechar();
  };

  return (
    <div style={modalFundo} onClick={fechar}>
      <div style={modalBox} onClick={(e) => e.stopPropagation()}>
        <button style={btnFechar} onClick={fechar}>
          ×
        </button>
        <h2 style={tituloModal}>{produto.nomeProduto}</h2>

        <div style={conteudoModal}>
          {saboresDisponiveis.map((sabor) => (
            <div key={sabor.idParametro} style={linhaSabor}>
              <span>{sabor.nomeParametro} {sabor.descParametro}</span>

              <div style={controle}>
                <button
                  style={botaoQtd}
                  onClick={() => alterar(sabor.idParametro, -25)}
                >
                  -
                </button>

                <span>{sabores[sabor.idParametro] || 0}</span>

                <button
                  style={botaoQtd}
                  onClick={() => alterar(sabor.idParametro, 25)}
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        <div style={footerModal}>
          <span>
            Total: {total} | R$ {calcularPreco().toFixed(2)}
          </span>

          <button style={button} onClick={adicionar}>
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
}

function ModalBombom({ produto, fechar, adicionarAoCarrinho }) {
  const [sabores, setSabores] = useState({});

  useEffect(() => {
    if (produto.itemEditando) {
      const novos = {};

      produto.itemEditando.parametrosBolo?.forEach(p => {
        novos[p.idParametro] = p.quantidade;
      });

      setSabores(novos);
    }
  }, [produto]);

  const saboresDisponiveis = produto.produtosParametrosBolo.filter(
    (p) => p.tipoParametro === "SaborBombom"
  );

  const alterar = (idParametro, delta) => {
      setSabores((prev) => {
        const atual = prev[idParametro] || 0;
        const novo = Math.max(0, atual + delta);

        return {
          ...prev,
          [idParametro]: novo,
        };
      });
    };

    const total = Object.values(sabores).reduce((acc, v) => acc + v, 0);

    function calcularPreco() {
      const saboresSelecionados = Object.entries(sabores)
        .filter(([_, qtd]) => qtd > 0)
        .map(([id]) =>
          saboresDisponiveis.find((p) => p.idParametro === Number(id))
        );

      if (saboresSelecionados.length === 0) return 0;

      const maiorMultiplicador = Math.max(
        ...saboresSelecionados.map((s) => Number(s.mutiplicador || 1))
      );

      return produto.preco * maiorMultiplicador * total;
    }

    const adicionar = () => {
    if (total === 0) {
      alert("Selecione pelo menos um sabor!");
      return;
    }

    const itens = Object.entries(sabores)
      .filter(([_, qtd]) => qtd > 0)
      .map(([idParametro, qtd]) => {
        const param = saboresDisponiveis.find(
          (p) => p.idParametro === Number(idParametro)
        );

        return {
          idParametro: param.idParametro,
          valorEscolhido: param.nomeParametro,
          quantidade: qtd,
        };
      });

    adicionarAoCarrinho({
      idProduto: produto.idProduto,
      quantidade: total,
      precoUnitario: calcularPreco(),
      parametrosBolo: itens,
    });

    fechar();
  };

  return (
    <div style={modalFundo} onClick={fechar}>
      <div style={modalBox} onClick={(e) => e.stopPropagation()}>
        <button style={btnFechar} onClick={fechar}>
          ×
        </button>
        <h2 style={tituloModal}>{produto.nomeProduto}</h2>

        <div style={conteudoModal}>
          {saboresDisponiveis.map((sabor) => (
            <div key={sabor.idParametro} style={linhaSabor}>
              <span>{sabor.nomeParametro} {sabor.descParametro}</span>

              <div style={controle}>
                <button
                  style={botaoQtd}
                  onClick={() => alterar(sabor.idParametro, -10)}
                >
                  -
                </button>

                <span>{sabores[sabor.idParametro] || 0}</span>

                <button
                  style={botaoQtd}
                  onClick={() => alterar(sabor.idParametro, 10)}
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        <div style={footerModal}>
          <span>
            Total: {total} | R$ {calcularPreco().toFixed(2)}
          </span>

          <button style={button} onClick={adicionar}>
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
}

function ModalPadrao({ produto, fechar, adicionarAoCarrinho }) {
  const [qtd, setQtd] = useState(25);

  const alterar = (valor) => {
    if (valor < 25) return;
    setQtd(valor);
  };

  const adicionar = () => {
    if (qtd <= 0) return;

    adicionarAoCarrinho({
      idProduto: produto.idProduto,
      quantidade: qtd,
      precoUnitario: produto.preco,
      precoTotal: produto.preco * qtd
    });

    fechar();
  };

  return (
    <div style={modalFundo} onClick={fechar}>
      <div style={modalBox} onClick={(e) => e.stopPropagation()}>
        
        <button style={fecharX} onClick={fechar}>✕</button>

        <h2 style={tituloModal}>{produto.nomeProduto}</h2>

        <div style={conteudoCentral}>
          <label style={label}>Quantidade</label>

          <div style={controleCentral}>
            <button
              style={botaoQtd}
              onClick={() => alterar(qtd - 5)}
            >
              -
            </button>

            <input
              type="number"
              value={qtd}
              onChange={(e) => alterar(Number(e.target.value))}
              style={inputQuantidade}
              min={25}
              step={5}
            />

            <button
              style={botaoQtd}
              onClick={() => alterar(qtd + 5)}
            >
              +
            </button>
          </div>
        </div>

        <div style={footerModal}>
          <span>Total: R$ {(qtd * produto.preco).toFixed(2)}</span>
          <button style={button} onClick={adicionar}>
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
}

const container = {
  display: "flex",
  justifyContent: "center",
};

const conteudo = {
  width: "100%",
  maxWidth: "1100px",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 220px))",
  justifyContent: "center",
  gap: "25px",
};

const card = {
  width: "220px",
  height: "300px",
  borderRadius: "20px",
  background: "#fff",
  boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
  cursor: "pointer",
  overflow: "hidden",
  transition: "0.3s",
};

const cardConteudo = {
  padding: "12px",
  display: "flex",
  flexDirection: "column",
  gap: "5px",
};

const img = {
  width: "100%",
  height: "150px",
  objectFit: "cover",
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
  zIndex: 1000,
};

const modalBox = {
  background: "#fff",
  padding: "25px 25px 0 25px",
  borderRadius: "20px",
  width: "500px",         
  maxHeight: "80vh",      
  overflowY: "auto",      
  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
  display: "flex",
  flexDirection: "column",
  gap: "15px",
  position: "relative",
};

const titulo = {
  textAlign: "center",
  fontSize: "32px",
  marginBottom: "30px",
  color: "#5c3d2e",
  fontWeight: "600",
  letterSpacing: "1px",
};

const tituloModal = {
  textAlign: "center",
};

const label = {
  fontWeight: "bold",
};


const select = {
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #ccc",
};


const button = {
  padding: "10px 15px",
  borderRadius: "10px",
  border: "none",
  background: "#ccac99",
  color: "#fff",
  cursor: "pointer",
};

const buttonSecondary = {
  ...button,
  background: "#ccc",
  color: "#333",
};

const linhaSabor = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px 0",
  borderBottom: "1px solid #eee",
};

const controle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
};

const conteudoModal = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

const footerModal = {
  position: "sticky",
  bottom: 0,
  background: "#fff",
  borderTop: "1px solid #eee",
  padding: "15px 20px",
  margin: "0 -25px",  
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  zIndex: 10,
  boxShadow: "0 -2px 10px rgba(0,0,0,0.1)"
};

const btnFechar = {
  position: "absolute",
  top: "10px",
  left: "15px",
  border: "none",
  background: "transparent",
  fontSize: "22px",
  cursor: "pointer",
  color: "#999",
  transition: "0.2s",
};

const conteudoCentral = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "15px",
};

const controleCentral = {
  display: "flex",
  alignItems: "center",
  gap: "15px",
};

const inputQuantidade = {
  width: "80px",
  textAlign: "center",
  padding: "10px",
  borderRadius: "10px",
  border: "1px solid #ccc",
  fontSize: "16px",
};

const botaoQtd = {
  width: "40px",
  height: "40px",
  borderRadius: "50%",
  border: "none",
  background: "#ccac99",
  color: "#fff",
  fontSize: "18px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const fecharX = {
  position: "absolute",
  top: "15px",
  left: "15px",
  border: "none",
  background: "transparent",
  fontSize: "18px",
  cursor: "pointer",
};

const pagina = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #f5eee8, #fdfaf7)",
  padding: "30px",
};

const botaoVoltar = {
  color: "white",
  marginBottom: "20px",
  padding: "8px 14px",
  borderRadius: "10px",
  border: "none",
  background: "#ccac99",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  cursor: "pointer",
};

const descricaoProduto = {
  textAlign: "center",
  color: "#666",
  fontSize: "14px",
  marginBottom: "10px",
};


const styleHover = document.createElement("style");
styleHover.innerHTML = `
.card-hover:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 12px 30px rgba(0,0,0,0.15);
}

.card-hover img {
  transition: 0.3s;
}

.card-hover:hover img {
  transform: scale(1.08);
}
`;
document.head.appendChild(styleHover);

const styleAnimacao = document.createElement("style");
styleAnimacao.innerHTML = `
@keyframes slideIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}
`;
document.head.appendChild(styleAnimacao);
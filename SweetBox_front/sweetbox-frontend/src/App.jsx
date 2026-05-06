import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Pedido from './pages/Pedido';
import Entrar from "./pages/Entrar";
import Cadastrar from "./pages/Cadastrar";
import RecuperarSenha from "./pages/RecuperarSenha";
import Admin from "./pages/Admin";
import GerenciarProdutos from "./pages/GerenciarProdutos";
import GerenciarUsuarios from "./pages/GerenciarUsuarios";
import Perfil from './pages/Perfil';
import GerenciarPedidos from "./pages/GerenciarPedidos";
import MeusPedidos from "./pages/MeusPedidos";
import FinalizacaoPedido from "./pages/FinalizacaoPedido";
import Pagamento from "./pages/Pagamento";
import PedidoConfirmado from "./pages/PedidoConfirmado";

function App() {

	return (
		<BrowserRouter>
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/pedido" element={<Pedido />} />
			<Route path="/entrar" element={<Entrar />} />
			<Route path="/cadastrar" element={<Cadastrar />} />
			<Route path="/recuperarSenha" element={<RecuperarSenha />} />
			<Route path="/admin" element={<Admin/>} />
			<Route path="/gerenciarProdutos" element={<GerenciarProdutos/>} />
			<Route path="/gerenciarUsuarios" element={<GerenciarUsuarios/>} />
			<Route path="/perfil" element={<Perfil />} />
			<Route path="/gerenciarPedidos" element={<GerenciarPedidos/>} />
			<Route path="/meusPedidos" element={<MeusPedidos/>} />
			<Route path="/finalizacaoPedido" element={<FinalizacaoPedido/>} />
			<Route path="/pagamento" element={<Pagamento/>} />
			<Route path="/pedidoConfirmado" element={<PedidoConfirmado/>} />
		</Routes>
		</BrowserRouter>
	);
}

export default App
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Cardapio from './pages/Cardapio';
import Pedido from './pages/Pedido';
import Entrar from "./pages/Entrar";
import Cadastrar from "./pages/Cadastrar";
import RecuperarSenha from "./pages/RecuperarSenha";
import Admin from "./pages/Admin";
import GerenciarProdutos from "./pages/GerenciarProdutos";
import GerenciarUsuarios from "./pages/GerenciarUsuarios";

function App() {

	return (
		<BrowserRouter>
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/cardapio" element={<Cardapio />} />
			<Route path="/pedido" element={<Pedido />} />
			<Route path="/entrar" element={<Entrar />} />
			<Route path="/cadastrar" element={<Cadastrar />} />
			<Route path="/recuperarSenha" element={<RecuperarSenha />} />
			<Route path="/admin" element={<Admin/>} />
			<Route path="/gerenciarProdutos" element={<GerenciarProdutos/>} />
			<Route path="/gerenciarUsuarios" element={<GerenciarUsuarios/>} />
		</Routes>
		</BrowserRouter>
	);
}

export default App
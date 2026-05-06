import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'

import { PedidoProvider } from './pages/PedidoContext'

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<PedidoProvider>
			<App />
		</PedidoProvider>
	</React.StrictMode>
)
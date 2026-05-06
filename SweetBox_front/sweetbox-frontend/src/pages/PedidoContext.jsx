import { createContext, useContext, useState } from "react";

const PedidoContext = createContext();

export function PedidoProvider({ children }) {
    const [pedido, setPedido] = useState(null);

    return (
        <PedidoContext.Provider value={{ pedido, setPedido }}>
            {children}
        </PedidoContext.Provider>
    );
}

export function usePedido() {
    return useContext(PedidoContext);
}
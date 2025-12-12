import api from "./api";

export async function getCategorias() {
  const response = await api.get("/Categoria");
  return response.data;
}

export async function createCategoria(categoria) {
  const response = await api.post("/Categoria", categoria);
  return response.data;
}

export async function updateCategoria(id, categoria) {
  const response = await api.put(`/Categoria/${id}`, categoria);
  return response.data;
}

export async function deleteCategoria(id) {
  await api.delete(`/Categoria/${id}`);
}

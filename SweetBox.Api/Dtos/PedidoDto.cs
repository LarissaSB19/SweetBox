namespace SweetBox.Api.Dtos
{
    public class PedidoDto
    {
        public int IdCliente { get; set; }
        public List<PedidoItemDto> Itens { get; set; } = new();
    }
}
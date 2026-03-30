namespace SweetBox.Api.Dtos
{
    public class PedidoItemDto
    {
        public int IdProduto { get; set; }
        public int Quantidade { get; set; }
        public decimal PrecoUnitario { get; set; }

        public List<ParametroBoloDto>? ParametrosBolo { get; set; }
    }
}
using System.ComponentModel.DataAnnotations;

namespace SweetBox.Api.Models
{
    public class PedidoItem
    {
        [Key]
        public int IdPedidoItem { get; set; }
        public int Quantidade { get; set; }
        public decimal PrecoUnitario { get; set; }

        public int IdPedido { get; set; }
        public Pedido? Pedido { get; set; }
        public int IdProduto { get; set; }
        public Produto? Produto { get; set; }


    }
}

using SweetBox.Api.Models;
using System.ComponentModel.DataAnnotations;

namespace SweetBox.Api.Models
{ 
    public class Pedido
    {
        [Key]
        public int IdPedido { get; set; }

        public DateTime DataPedido { get; set; } = DateTime.Now;
        public decimal ValorTotal { get; set; }
        public string StatusPedido { get; set; } = "Em Preparo";
        public string FormaPagamento { get; set; } = string.Empty;
        public ICollection<PedidoItem> PedidoItens { get; set; } = new List<PedidoItem>();

        public int IdUsuario { get; set; }
        public Usuario? Usuario { get; set; }

        public Pagamento? Pagamento { get; set; }
    }
}
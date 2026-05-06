using SweetBox.Api.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class PedidoItem
{
    [Key]
    public int IdPedidoItem { get; set; } 

    public int Quantidade { get; set; }
    public decimal PrecoUnitario { get; set; }

    public int IdPedido { get; set; }

    public decimal PrecoTotal { get; set; }

    [ForeignKey("IdPedido")]
    public Pedido Pedido { get; set; }
  
    public int IdProduto { get; set; }

    [ForeignKey("IdProduto")]
    public Produto Produto { get; set; }

    public ICollection<PedidoItemParametroBolo> PedidoItemParametroBolo { get; set; } = new List<PedidoItemParametroBolo>();
}

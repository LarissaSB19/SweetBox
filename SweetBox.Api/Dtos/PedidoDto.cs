using SweetBox.Api.Dtos;

public class PedidoDto
{
    public int IdCliente { get; set; }

    public DateTime DataEntrega { get; set; }
    public TimeSpan HoraEntrega { get; set; } 

    public decimal ValorTotal { get; set; }

    public List<PedidoItemDto> Itens { get; set; } = new();

    public PagamentoDto? Pagamento { get; set; }
}
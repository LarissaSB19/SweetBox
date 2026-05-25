namespace SweetBox.Api.Dtos
{
    public class PagamentoDto
    {
        public string Metodo { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime? DataPagamento { get; set; }
    }
}
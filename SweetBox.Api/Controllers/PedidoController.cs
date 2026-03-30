using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SweetBox.Data;
using SweetBox.Api.Models;
using SweetBox.Api.Dtos;

[ApiController]
[Route("api/[controller]")]
public class PedidoController : ControllerBase
{
    private readonly SweetBoxContext _context;

    public PedidoController(SweetBoxContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Pedido>>> GetPedidosAsync()
    {
        return Ok(await _context.Pedidos.ToListAsync());
    }

    [HttpGet("{idPedido}")]
    public async Task<ActionResult<Pedido>> GetPedidoAsync(int idPedido)
    {
        var pedido = await _context.Pedidos.FindAsync(idPedido);
        if (pedido == null) return NotFound();
        return Ok(pedido);
    }

    [HttpPost]
    public async Task<IActionResult> CreatePedidoAsync([FromBody] PedidoDto pedidoDto)
    {
        try
        {
            var pedido = new Pedido
            {
                IdUsuario = pedidoDto.IdCliente,
                DataPedido = DateTime.Now
            };

            _context.Pedidos.Add(pedido);

            await _context.SaveChangesAsync();

            decimal totalPedido = 0;

            foreach (var itemDto in pedidoDto.Itens)
            {
                var item = new PedidoItem
                {
                    IdPedido = pedido.IdPedido,
                    IdProduto = itemDto.IdProduto,
                    Quantidade = itemDto.Quantidade,
                    PrecoUnitario = itemDto.PrecoUnitario
                };

                _context.PedidoItens.Add(item);

                totalPedido += itemDto.PrecoUnitario;

                if (itemDto.ParametrosBolo != null)
                {
                    foreach (var param in itemDto.ParametrosBolo)
                    {
                        var itemParametro = new PedidoItemParametroBolo
                        {
                            PedidoItem = item,
                            IdParametro = param.IdParametro,
                            ValorEscolhido = param.ValorEscolhido
                        };

                        _context.PedidoItemParametroBolos.Add(itemParametro);
                    }
                }
            }

            pedido.ValorTotal = totalPedido;

            await _context.SaveChangesAsync();

            return Ok(pedido);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Erro ao criar pedido: {ex.Message}");
        }
    }

    [HttpPut("{idPedido}")]
    public async Task<IActionResult> UpdatePedidoAsync(int idPedido, Pedido pedido)
    {
        if (idPedido != pedido.IdPedido) return BadRequest();
        _context.Entry(pedido).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{idPedido}")]
    public async Task<IActionResult> DeletePedidoAsync(int idPedido)
    {
        var pedido = await _context.Pedidos.FindAsync(idPedido);
        if (pedido == null) return NotFound();
        _context.Pedidos.Remove(pedido);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
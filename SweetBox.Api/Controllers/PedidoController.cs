using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SweetBox.Data;
using SweetBox.Api.Models;

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
    public async Task<ActionResult<Pedido>> CreatePedidoAsync(Pedido pedido)
    {
        _context.Pedidos.Add(pedido);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetPedidoAsync), new { idPedido = pedido.IdPedido }, pedido);
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
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SweetBox.Data;
using SweetBox.Api.Models;

[ApiController]
[Route("api/[controller]")]
public class PedidoItemController : ControllerBase
{
    private readonly SweetBoxContext _context;

    public PedidoItemController(SweetBoxContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<PedidoItem>>> GetPedidoItensAsync()
    {
        return Ok(await _context.PedidoItens.ToListAsync());
    }

    [HttpGet("{idPedidoItem}")]
    public async Task<ActionResult<PedidoItem>> GetPedidoItemAsync(int idPedidoItem)
    {
        var item = await _context.PedidoItens.FindAsync(idPedidoItem);
        if (item == null) return NotFound();
        return Ok(item);
    }

    [HttpPost]
    public async Task<ActionResult<PedidoItem>> CreatePedidoItemAsync(PedidoItem item)
    {
        _context.PedidoItens.Add(item);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetPedidoItemAsync), new { idPedidoItem = item.IdPedidoItem }, item);
    }

    [HttpPut("{idPedidoItem}")]
    public async Task<IActionResult> UpdatePedidoItemAsync(int idPedidoItem, PedidoItem item)
    {
        if (idPedidoItem != item.IdPedidoItem) return BadRequest();
        _context.Entry(item).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{idPedidoItem}")]
    public async Task<IActionResult> DeletePedidoItemAsync(int idPedidoItem)
    {
        var item = await _context.PedidoItens.FindAsync(idPedidoItem);
        if (item == null) return NotFound();
        _context.PedidoItens.Remove(item);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
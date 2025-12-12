using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SweetBox.Data;
using SweetBox.Api.Models;

[ApiController]
[Route("api/[controller]")]
public class PagamentoController : ControllerBase
{
    private readonly SweetBoxContext _context;

    public PagamentoController(SweetBoxContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Pagamento>>> GetPagamentosAsync()
    {
        return Ok(await _context.Pagamentos.ToListAsync());
    }

    [HttpGet("{idPagamento}")]
    public async Task<ActionResult<Pagamento>> GetPagamentoAsync(int idPagamento)
    {
        var pagamento = await _context.Pagamentos.FindAsync(idPagamento);
        if (pagamento == null) return NotFound();
        return Ok(pagamento);
    }

    [HttpPost]
    public async Task<ActionResult<Pagamento>> CreatePagamentoAsync(Pagamento pagamento)
    {
        _context.Pagamentos.Add(pagamento);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetPagamentoAsync), new { idPagamento = pagamento.IdPagamento }, pagamento);
    }

    [HttpPut("{idPagamento}")]
    public async Task<IActionResult> UpdatePagamentoAsync(int id, Pagamento pagamento)
    {
        if (id != pagamento.IdPagamento) return BadRequest();
        _context.Entry(pagamento).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{idPagamento}")]
    public async Task<IActionResult> DeletePagamentoAsync(int idPagamento)
    {
        var pagamento = await _context.Pagamentos.FindAsync(idPagamento);
        if (pagamento == null) return NotFound();
        _context.Pagamentos.Remove(pagamento);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
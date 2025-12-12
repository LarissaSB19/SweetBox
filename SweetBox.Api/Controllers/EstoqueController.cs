using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SweetBox.Data;
using SweetBox.Api.Models;

namespace SweetBox.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EstoqueController : ControllerBase
    {
        private readonly SweetBoxContext _context;

        public EstoqueController(SweetBoxContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Estoque>>> GetEstoqueAsync()
        {
            var estoques = await _context.Estoques.ToListAsync();
            return Ok(estoques);
        }

        [HttpGet("{idEstoque}")]
        public async Task<ActionResult<Estoque>> GetEstoqueByIdAsync(int idEstoque)
        {
            var estoque = await _context.Estoques.FindAsync(idEstoque);
            if (estoque == null)
                return NotFound();

            return Ok(estoque);
        }

        [HttpPost]
        public async Task<ActionResult<Estoque>> CreateEstoqueAsync(Estoque estoque)
        {
            _context.Estoques.Add(estoque);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetEstoqueByIdAsync), new { idEstoque = estoque.IdEstoque }, estoque);
        }

        [HttpPut("{idEstoque}")]
        public async Task<IActionResult> UpdateEstoqueAsync(int idEstoque, Estoque estoque)
        {
            if (idEstoque != estoque.IdEstoque)
                return BadRequest();

            _context.Entry(estoque).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Estoques.Any(e => e.IdEstoque == idEstoque))
                    return NotFound();

                throw;
            }

            return NoContent();
        }

        [HttpDelete("{idEstoque}")]
        public async Task<IActionResult> DeleteEstoqueAsync(int idEstoque)
        {
            var estoque = await _context.Estoques.FindAsync(idEstoque);
            if (estoque == null)
                return NotFound();

            _context.Estoques.Remove(estoque);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
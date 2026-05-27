using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SweetBox.Api.Models;
using SweetBox.Data;

namespace SweetBox.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HorarioBloqueadoController : ControllerBase
    {
        private readonly SweetBoxContext _context;

        public HorarioBloqueadoController(SweetBoxContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<HorarioBloqueado>>> Get()
        {
            return await _context.HorarioBloqueados.ToListAsync();
        }

        [HttpPost]
        public async Task<IActionResult> Post(HorarioBloqueado horario)
        {
            _context.HorarioBloqueados.Add(horario);

            await _context.SaveChangesAsync();

            return Ok(horario);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var horario = await _context.HorarioBloqueados.FindAsync(id);

            if (horario == null)
                return NotFound();

            _context.HorarioBloqueados.Remove(horario);

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
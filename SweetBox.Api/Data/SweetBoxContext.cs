using Microsoft.EntityFrameworkCore;
using SweetBox.Api.Models;

namespace SweetBox.Data
{
    public class SweetBoxContext : DbContext
    {
        public SweetBoxContext(DbContextOptions<SweetBoxContext> options)
            : base(options) { }

        public DbSet<Estoque> Estoques { get; set; }
        public DbSet<Pagamento> Pagamentos { get; set; }
        public DbSet<Pedido> Pedidos { get; set; }
        public DbSet<PedidoItem> PedidoItens { get; set; }
        public DbSet<Perfil> Perfis { get; set; }
        public DbSet<Produto> Produtos { get; set; }
        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Categoria> Categorias { get; set; }
        public DbSet<ProdutosParametrosBolo> ProdutosParametrosBolos { get; set; }
        public DbSet<PedidoItemParametroBolo> PedidoItemParametroBolos { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Pedido>()
                .HasOne(pd => pd.Pagamento)
                .WithOne(pg => pg.Pedido)
                .HasForeignKey<Pagamento>(p => p.IdPedido);

            modelBuilder.Entity<Estoque>()
                .HasOne(e => e.Produto)
                .WithOne(p => p.Estoque)
                .HasForeignKey<Estoque>(e => e.IdProduto);

            modelBuilder.Entity<Pedido>()
                .HasOne(p => p.Usuario)
                .WithMany(u => u.Pedidos)
                .HasForeignKey(p => p.IdUsuario);

            modelBuilder.Entity<Produto>()
                .HasOne(p => p.Categoria)
                .WithMany(c => c.Produtos)
                .HasForeignKey(p => p.IdCategoria)
                .HasConstraintName("FK_Produto_Categoria");

            modelBuilder.Entity<PedidoItemParametroBolo>()
                .HasOne(p => p.PedidoItem)                
                .WithMany(pi => pi.PedidoItemParametroBolo)        
                .HasForeignKey(p => p.IdPedidoItem)       
                .HasConstraintName("FK_PedidoItemParametroBolo_PedidoItem");

            modelBuilder.Entity<PedidoItemParametroBolo>()
                .HasOne(p => p.Parametro)                 
                .WithMany()                               
                .HasForeignKey(p => p.IdParametro)        
                .HasConstraintName("FK_PedidoItemParametroBolo_ProdutosParametrosBolo");

            modelBuilder.Entity<ProdutosParametrosBolo>()
                .HasOne(p => p.Produto)
                .WithMany(p => p.ProdutosParametrosBolo)
                .HasForeignKey(p => p.IdProduto);


            base.OnModelCreating(modelBuilder);
        }
    }
}

using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SweetBox.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddQuantidadeParametro : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Quantidade",
                table: "PedidoItemParametroBolos",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Quantidade",
                table: "PedidoItemParametroBolos");
        }
    }
}

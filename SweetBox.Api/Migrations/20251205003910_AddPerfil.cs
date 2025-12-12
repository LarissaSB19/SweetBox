using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SweetBox.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddPerfil : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IdPerfil",
                table: "Usuarios");

            migrationBuilder.AddColumn<int>(
                name: "IdProduto",
                table: "Categorias",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}

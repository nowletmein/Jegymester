using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JegymesterApp.DataContext.Migrations
{
    /// <inheritdoc />
    public partial class RoomCapacityAdded : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "isVerified",
                table: "Tickets",
                newName: "IsVerified");

            migrationBuilder.RenameColumn(
                name: "available",
                table: "Rooms",
                newName: "Available");

            migrationBuilder.RenameColumn(
                name: "Rateing",
                table: "Movies",
                newName: "Rating");

            migrationBuilder.AddColumn<int>(
                name: "Capacity",
                table: "Rooms",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Capacity",
                table: "Rooms");

            migrationBuilder.RenameColumn(
                name: "IsVerified",
                table: "Tickets",
                newName: "isVerified");

            migrationBuilder.RenameColumn(
                name: "Available",
                table: "Rooms",
                newName: "available");

            migrationBuilder.RenameColumn(
                name: "Rating",
                table: "Movies",
                newName: "Rateing");
        }
    }
}

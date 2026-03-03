using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JegymesterApp.DataContext.Migrations
{
    /// <inheritdoc />
    public partial class TicketRefactor : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tickets_Users_CreatorUserId",
                table: "Tickets");

            migrationBuilder.DropForeignKey(
                name: "FK_Tickets_Users_OwnerId",
                table: "Tickets");

            migrationBuilder.DropColumn(
                name: "CancellationDate",
                table: "Tickets");

            migrationBuilder.RenameColumn(
                name: "OwnerId",
                table: "Tickets",
                newName: "UserId");

            migrationBuilder.RenameColumn(
                name: "CreatorUserId",
                table: "Tickets",
                newName: "CreatorId");

            migrationBuilder.RenameColumn(
                name: "ContactPhone",
                table: "Tickets",
                newName: "Phone");

            migrationBuilder.RenameColumn(
                name: "ContactEmail",
                table: "Tickets",
                newName: "Email");

            migrationBuilder.RenameIndex(
                name: "IX_Tickets_OwnerId",
                table: "Tickets",
                newName: "IX_Tickets_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_Tickets_CreatorUserId",
                table: "Tickets",
                newName: "IX_Tickets_CreatorId");

            migrationBuilder.AddForeignKey(
                name: "FK_Tickets_Users_CreatorId",
                table: "Tickets",
                column: "CreatorId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Tickets_Users_UserId",
                table: "Tickets",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tickets_Users_CreatorId",
                table: "Tickets");

            migrationBuilder.DropForeignKey(
                name: "FK_Tickets_Users_UserId",
                table: "Tickets");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "Tickets",
                newName: "OwnerId");

            migrationBuilder.RenameColumn(
                name: "Phone",
                table: "Tickets",
                newName: "ContactPhone");

            migrationBuilder.RenameColumn(
                name: "Email",
                table: "Tickets",
                newName: "ContactEmail");

            migrationBuilder.RenameColumn(
                name: "CreatorId",
                table: "Tickets",
                newName: "CreatorUserId");

            migrationBuilder.RenameIndex(
                name: "IX_Tickets_UserId",
                table: "Tickets",
                newName: "IX_Tickets_OwnerId");

            migrationBuilder.RenameIndex(
                name: "IX_Tickets_CreatorId",
                table: "Tickets",
                newName: "IX_Tickets_CreatorUserId");

            migrationBuilder.AddColumn<DateTime>(
                name: "CancellationDate",
                table: "Tickets",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Tickets_Users_CreatorUserId",
                table: "Tickets",
                column: "CreatorUserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Tickets_Users_OwnerId",
                table: "Tickets",
                column: "OwnerId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}

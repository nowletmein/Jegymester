using JegymesterApp.DataContext.Entites;
using System;
using System.Collections.Generic;
using System.Reflection.Emit;
using System.Text;
using Microsoft.EntityFrameworkCore;

namespace JegymesterApp.DataContext.Context
{
    public class JegymesterDbContext:DbContext
    {
        
        public JegymesterDbContext(DbContextOptions<JegymesterDbContext> options) : base(options) { }

        public DbSet<Movie> Movies { get; set; }
        public DbSet<Screening> Screenings { get; set; }
        public DbSet<Ticket> Tickets { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Room> Rooms { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Ticket>()
       .HasOne(t => t.User)
       .WithMany(u => u.Tickets)
       .HasForeignKey(t => t.UserId)
       .OnDelete(DeleteBehavior.Restrict);

            

            modelBuilder.Entity<Ticket>()
                .HasOne(t => t.Screening)
                .WithMany(s => s.Tickets)
                .HasForeignKey(t => t.ScreeningId)
                .OnDelete(DeleteBehavior.Cascade);

            base.OnModelCreating(modelBuilder);
        }
        

        
    }
}


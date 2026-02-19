using System.ComponentModel.DataAnnotations;

namespace Booking.Api.Models
{
    public class Appointment
    {
        public int Id { get; set; }

        [Required, MaxLength(100)]
        public string ClientName { get; set; } = string.Empty;

        [Required, EmailAddress]
        public string ClientEmail { get; set; } = string.Empty;

        [Required]
        public string ServiceName { get; set; } = string.Empty;

        // Horário de Início e Fim são cruciais para evitar conflitos
        [Required]
        public DateTime StartTime { get; set; }

        [Required]
        public DateTime EndTime { get; set; }

        public AppointmentStatus Status { get; set; } = AppointmentStatus.Scheduled;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    // Usar um Enum facilita muito a nossa vida no React depois
    public enum AppointmentStatus
    {
        Scheduled, // Agendado
        Completed, // Concluído
        Canceled   // Cancelado
    }
}
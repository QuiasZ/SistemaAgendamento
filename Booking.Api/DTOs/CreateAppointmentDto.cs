using System.ComponentModel.DataAnnotations;

namespace Booking.Api.DTOs
{
    public class CreateAppointmentDto
    {
        [Required, MaxLength(100)]
        public string ClientName { get; set; } = string.Empty;

        [Required, EmailAddress]
        public string ClientEmail { get; set; } = string.Empty;

        [Required]
        public string ServiceName { get; set; } = string.Empty;

        [Required]
        public DateTime StartTime { get; set; }

        [Required]
        public DateTime EndTime { get; set; }
    }
}
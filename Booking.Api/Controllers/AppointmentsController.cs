using Booking.Api.Data;
using Booking.Api.DTOs;
using Booking.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Booking.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppointmentsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AppointmentsController(AppDbContext context)
        {
            _context = context;
        }

        // Rota para listar os agendamentos (Vamos usar no calendário do React)
        [HttpGet]
        public async Task<IActionResult> GetAppointments()
        {
            var appointments = await _context.Appointments
                .Where(a => a.Status != AppointmentStatus.Canceled) // Traz só os ativos
                .OrderBy(a => a.StartTime)
                .ToListAsync();

            return Ok(appointments);
        }

        // Rota para criar um novo agendamento
        [HttpPost]
        public async Task<IActionResult> CreateAppointment([FromBody] CreateAppointmentDto request)
        {
            // 1. Validação básica: O fim não pode ser antes do começo
            if (request.EndTime <= request.StartTime)
            {
                return BadRequest(new { message = "O horário de término deve ser maior que o horário de início." });
            }

            // 2. A Regra de Ouro: Verificação de Conflito (Overlapping) no Banco de Dados
            bool hasConflict = await _context.Appointments
                .AnyAsync(a => a.Status != AppointmentStatus.Canceled && // Ignora os cancelados
                               a.StartTime < request.EndTime && 
                               a.EndTime > request.StartTime);

            if (hasConflict)
            {
                // Retorna Status 409 (Conflict) - Muito profissional usar o status HTTP correto!
                return Conflict(new { message = "Este horário já está reservado. Por favor, escolha outro." });
            }

            // 3. Se passou na validação, cria e salva
            var appointment = new Appointment
            {
                ClientName = request.ClientName,
                ClientEmail = request.ClientEmail,
                ServiceName = request.ServiceName,
                StartTime = request.StartTime,
                EndTime = request.EndTime,
                Status = AppointmentStatus.Scheduled
            };

            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Agendamento realizado com sucesso!", appointmentId = appointment.Id });
        }

        // Rota para cancelar um agendamento
        [HttpDelete("{id}")]
        public async Task<IActionResult> CancelAppointment(int id)
        {
            // 1. Procura o agendamento na base de dados pelo ID
            var appointment = await _context.Appointments.FindAsync(id);
            
            if (appointment == null)
            {
                return NotFound(new { message = "Agendamento não encontrado." });
            }

            // 2. Muda o estado para Cancelado em vez de apagar o registo
            appointment.Status = AppointmentStatus.Canceled;
            
            // 3. Guarda as alterações
            await _context.SaveChangesAsync();

            return Ok(new { message = "Agendamento cancelado com sucesso." });
        }
    }
}
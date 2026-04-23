namespace backend.Interfaces;

using backend.DTOs.Request;
using backend.DTOs.Response;
using backend.Models.Entities;
public interface IReportService
{
    Task<bool> CreateReportAsync(string userId, CreateReportRequest dto);
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Models.Entities;
using backend.DTOs.Request;
using backend.Services;
using backend.Hubs;
using backend.Interfaces;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Moq;
using Xunit;

namespace backend.Tests
{
    public class NotificationServiceTests
    {
        private readonly AppDbContext _context;
        private readonly Mock<IHubContext<NotificationHub, INotificationClient>> _hub;
        private readonly Mock<INotificationClient> _client;
        private readonly NotificationService _service;

        public NotificationServiceTests()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;

            _context = new AppDbContext(options);

            _client = new Mock<INotificationClient>();

            var clients = new Mock<IHubClients<INotificationClient>>();
            clients.Setup(x => x.User(It.IsAny<string>()))
                   .Returns(_client.Object);

            _hub = new Mock<IHubContext<NotificationHub, INotificationClient>>();
            _hub.Setup(x => x.Clients).Returns(clients.Object);

            _service = new NotificationService(_context, _hub.Object);
        }

        // ================= CREATE =================

        [Fact]
        public async Task Create_ShouldReturnNotification()
        {
            var req = new CreateNotificationRequest
            {
                UserId = "u1",
                FromUserId = "u2",
                Content = "Hello",
                Type = "Like"
            };

            var result = await _service.Create(req);

            Assert.NotNull(result);
            Assert.Equal("Hello", result.Content);
            Assert.Equal("u2", result.FromUserId);
        }

        // ================= GET BY USER =================

        [Fact]
        public async Task GetByUser_ShouldReturnList()
        {
            _context.Notifications.Add(new Notification
            {
                UserId = "u1",
                FromUserId = "u2",
                Content = "Test",
                Type = "Like",
                CreatedAt = DateTime.UtcNow
            });

            await _context.SaveChangesAsync();

            var result = await _service.GetByUser("u1");

            Assert.Single(result);
            Assert.Equal("Test", result.First().Content);
        }

        // ================= MARK AS READ =================

        [Fact]
        public async Task MarkAsRead_ShouldReturnTrue()
        {
            var n = new Notification
            {
                UserId = "u1",
                FromUserId = "u2",
                Content = "Test",
                Type = "Like",
                IsRead = false,
                CreatedAt = DateTime.UtcNow
            };

            _context.Notifications.Add(n);
            await _context.SaveChangesAsync();

            var result = await _service.MarkAsRead(n.Id, "u1");

            Assert.True(result);
            Assert.True(_context.Notifications.First().IsRead);
        }

        // ================= DELETE =================

        [Fact]
        public async Task Delete_ShouldReturnTrue()
        {
            var n = new Notification
            {
                UserId = "u1",
                FromUserId = "u2",
                Content = "Test",
                Type = "Like",
                CreatedAt = DateTime.UtcNow
            };

            _context.Notifications.Add(n);
            await _context.SaveChangesAsync();

            var result = await _service.Delete(n.Id, "u1");

            Assert.True(result);
            Assert.Empty(_context.Notifications);
        }
    }
}
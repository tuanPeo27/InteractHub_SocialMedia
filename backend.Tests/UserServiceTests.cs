using backend.Services;
using backend.Models.Entities;
using backend.DTOs.Request;

using Microsoft.AspNetCore.Identity;
using Moq;
using Xunit;
using System.Collections.Generic;
using System.Security.Claims;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Tests;

public class UserServiceTests
{
    private readonly Mock<UserManager<ApplicationUser>> _userManager;
    private readonly UserService _service;

    public UserServiceTests()
    {
        var store = new Mock<IUserStore<ApplicationUser>>();

        _userManager = new Mock<UserManager<ApplicationUser>>(
            store.Object, null!, null!, null!, null!, null!, null!, null!, null!
        );

        _service = new UserService(_userManager.Object);
    }

    [Fact]
    public async Task GetCurrentUser_ReturnNull()
    {
        var principal = new ClaimsPrincipal(new ClaimsIdentity());
        var result = await _service.GetCurrentUser(principal);
        Assert.Null(result);
    }

    [Fact]
    public async Task GetById_ReturnUser()
    {
        _userManager.Setup(x => x.FindByIdAsync("1"))
            .ReturnsAsync(new ApplicationUser { Id = "1" });

        var result = await _service.GetById("1");

        Assert.NotNull(result);
    }

    [Fact]
    public async Task GetById_ReturnNull()
    {
        _userManager.Setup(x => x.FindByIdAsync("1"))
            .ReturnsAsync((ApplicationUser?)null);

        var result = await _service.GetById("1");

        Assert.Null(result);
    }

    [Fact]
    public async Task UpdateCurrentUser_Unauthorized()
    {
        var result = await _service.UpdateCurrentUser(
            new ClaimsPrincipal(new ClaimsIdentity()),
            new UpdateUserRequest()
        );

        Assert.False(result.Success);
    }

    [Fact]
    public async Task Delete_UserNotFound()
    {
        _userManager.Setup(x => x.FindByIdAsync("1"))
            .ReturnsAsync((ApplicationUser?)null);

        var result = await _service.Delete("1");

        Assert.False(result.Success);
    }
    [Fact]
public async Task GetCurrentUser_ReturnUser()
{
    var user = new ApplicationUser
    {
        Id = "1",
        UserName = "admin",
        Email = "admin@mail.com"
    };

    var claims = new List<Claim>
    {
        new Claim(ClaimTypes.NameIdentifier, "1")
    };

    var identity = new ClaimsIdentity(claims);
    var principal = new ClaimsPrincipal(identity);

    _userManager.Setup(x => x.FindByIdAsync("1"))
        .ReturnsAsync(user);

    var result = await _service.GetCurrentUser(principal);

    Assert.NotNull(result);
    Assert.Equal("1", result!.Id);
    Assert.Equal("admin", result.UserName);
}

[Fact]
public async Task UpdateCurrentUser_Success()
{
    var user = new ApplicationUser
    {
        Id = "1",
        UserName = "oldname"
    };

    var claims = new List<Claim>
    {
        new Claim(ClaimTypes.NameIdentifier, "1")
    };

    var principal = new ClaimsPrincipal(new ClaimsIdentity(claims));

    _userManager.Setup(x => x.FindByIdAsync("1"))
        .ReturnsAsync(user);

    _userManager.Setup(x => x.UpdateAsync(It.IsAny<ApplicationUser>()))
        .ReturnsAsync(IdentityResult.Success);

    var result = await _service.UpdateCurrentUser(
        principal,
        new UpdateUserRequest
        {
            UserName = "newname",
            Bio = "hello"
        });

    Assert.True(result.Success);
    Assert.Equal("newname", user.UserName);
    Assert.Equal("hello", user.Bio);
}

[Fact]
public async Task Delete_Success()
{
    var user = new ApplicationUser
    {
        Id = "1"
    };

    _userManager.Setup(x => x.FindByIdAsync("1"))
        .ReturnsAsync(user);

    _userManager.Setup(x => x.DeleteAsync(user))
        .ReturnsAsync(IdentityResult.Success);

    var result = await _service.Delete("1");

    Assert.True(result.Success);
}
}
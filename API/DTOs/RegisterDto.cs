using System;
using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class RegisterDto
{
    [Required] // yêu cầu nhập
    public string DisplayName { get; set; } = "";

    [Required]
    [EmailAddress] // phải chuẩn kiểu email
    public string Email { get; set; } = "";

    public string Password { get; set; } = ""; // k cần required vì tại controller _userManager sẽ báo lỗi khi password k đạt
}

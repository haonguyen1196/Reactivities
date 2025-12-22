using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BaseApiController : ControllerBase
    {
        private IMediator? _mediator; // dùng để lưu instance IMediator

        protected IMediator Mediator =>
            _mediator ??= HttpContext.RequestServices.GetService<IMediator>()
                ?? throw new InvalidOperationException("IMediator service is unavailable");
        // lúc đầu _mediator = null sẽ lấy IMediator từ DI container và gán vào _mediator
        // khi _mediator có dữ liệu rồi thì gọi Mediator từ class derive sẽ trả ra _mediator
        // nếu lấy DI trả về null thì sẽ throw ra lỗi
    }
}

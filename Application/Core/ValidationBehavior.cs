using System;
using FluentValidation;
using MediatR;

namespace Application.Core;

//“validation middleware” của MediatR.
// tự động bắt lỗi validation nếu đó là command(create | update data) có file validation
public class ValidationBehavior<TRequest, TResponse>(IValidator<TRequest>? validator = null) : IPipelineBehavior<TRequest, TResponse> where TRequest : notnull
{
    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        if (validator == null) return await next(); // nếu queries lấy dữ liệu thì next

        var validationResult = await validator.ValidateAsync(request, cancellationToken); // nếu là command thì vó validator

        if (!validationResult.IsValid) // ném lỗi nếu validator bắt đc lỗi
        {
            throw new ValidationException(validationResult.Errors);
        }

        return await next(); // next khi validate k có vấn đề
    }
}

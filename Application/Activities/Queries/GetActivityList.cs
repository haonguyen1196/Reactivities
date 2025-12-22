using System;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities.Queries;

public class GetActivityList
{
    public class Query : IRequest<List<Activity>> { } // tạo query cho hệ thống, được gọi từ controller

    public class Handler(AppDbContext context) : IRequestHandler<Query, List<Activity>> // xử lý query bằng hàm handle tương ứng
    {
        public async Task<List<Activity>> Handle(Query request, CancellationToken cancellationToken)
        {
            return await context.Activities.ToListAsync(cancellationToken);
        }
    }
}

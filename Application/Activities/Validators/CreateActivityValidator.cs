using System;
using Application.Activities.Commands;
using Application.Activities.DTOs;
using FluentValidation;

namespace Application.Activities.Validators;

public class CreateActivityValidator : BaseActivityValidator<CreateActivity.Command, CreateActivityDto> // <CreateActivity.Command> đoạn này quyết định validation cho command nào
{
    public CreateActivityValidator() : base(x => x.ActivityDto)
    {

    }
}

using System;

namespace Domain;

public class Activity
{
    public string Id { get; set; } = Guid.NewGuid().ToString(); // "c1b1c9b6-8f8a-4e89-9c87-2a44c98a3b21"
    public required string Title { get; set; } // required là cột đó not nullable
    public DateTime Date { get; set; } // 2025-12-20 08:30:00 trong db, nhưng trả về sẽ là string "2025-12-20 08:30:00"
    public required string Description { get; set; }
    public required string Category { get; set; }
    public bool IsCancelled { get; set; }// số 0 hoặc 1 trong db, nhưng trả về true false

    //location props
    public required string City { get; set; }
    public required string Venue { get; set; }
    public double Latitude { get; set; }//double số có chấm
    public double Longitude { get; set; }

}

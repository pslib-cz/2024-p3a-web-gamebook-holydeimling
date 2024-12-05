namespace GamebookTest1.Server.Models
{
    public class Item
    {
        public required int ItemId { get; set; }
        public required string ItemImage { get; set; }
        public required string ItemName { get; set; }
        public string? ItemDescription { get; set; }
    }
}

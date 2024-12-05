import "./InventoryItem.css";

type InventoryItemProps = {
  imageUrl?: string | null;
};

export const InventoryItem = ({ imageUrl }: InventoryItemProps) => {
  return (
    <div className="inventory__item">
      {imageUrl && (
        <img src={imageUrl} alt="inventoryIcon" className="icon__image" />
      )}
    </div>
  );
};

import { useDrag, DragSourceMonitor } from "react-dnd";
import "./InventoryItem.css";

const ItemTypes = {
  INVENTORY_ITEM: "inventoryItem",
};

type DraggableInventoryItemProps = {
  imageUrl?: string | null;
  index: number;
};

export const DraggableInventoryItem = ({
  imageUrl,
  index,
}: DraggableInventoryItemProps) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.INVENTORY_ITEM,
    item: { index },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: "move",
      }}
    >
      {imageUrl ? (
        <img
          src={`/${imageUrl}`}
          alt="Inventory Item"
          className="icon__image"
        />
      ) : (
        <div className="empty-slot" />
      )}
    </div>
  );
};

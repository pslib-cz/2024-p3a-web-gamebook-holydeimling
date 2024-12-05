import { useDrop, DropTargetMonitor } from "react-dnd";
import React from "react";
import "./InventoryItem.css";

const ItemTypes = {
  INVENTORY_ITEM: "inventoryItem",
};

type DroppableInventorySlotProps = {
  index: number;
  moveItem: (fromIndex: number, toIndex: number) => void;
  children: React.ReactNode;
};

type DragItem = {
  index: number;
};

export const DroppableInventorySlot = ({
  index,
  moveItem,
  children,
}: DroppableInventorySlotProps) => {
  const [{ isOver }, drop] = useDrop<DragItem, void, { isOver: boolean }>({
    accept: ItemTypes.INVENTORY_ITEM,
    drop: (item: DragItem) => moveItem(item.index, index),
    collect: (monitor: DropTargetMonitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      className={`inventory__item ${
        isOver ? "inventory__item--highlight" : ""
      }`}
    >
      {children}
    </div>
  );
};

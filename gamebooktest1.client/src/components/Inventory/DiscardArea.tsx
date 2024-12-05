import { useDrop, DropTargetMonitor } from "react-dnd";
import React from "react";
import "./DiscardArea.css";

const ItemTypes = {
  INVENTORY_ITEM: "inventoryItem",
};

type DiscardAreaProps = {
  moveItem: (fromIndex: number, toIndex: "discard") => void;
};

export const DiscardArea = ({ moveItem }: DiscardAreaProps) => {
  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.INVENTORY_ITEM,
    drop: (item: { index: number }) => moveItem(item.index, "discard"),
    collect: (monitor: DropTargetMonitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      className={`discard-area ${isOver ? "discard-area--highlight" : ""}`}
    >
      <p>Drop Here to Discard</p>
    </div>
  );
};

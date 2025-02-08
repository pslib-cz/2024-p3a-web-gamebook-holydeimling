import "./Inventory.css";
import { useEffect, useState } from "react";
import { HomeScreenButton } from "../Home/HomeScreenButton";
import { DraggableInventoryItem } from "./DraggableInventoryItem";
import { DroppableInventorySlot } from "./DroppableInventorySlot";
import "./InventoryItem.css";
import { DiscardArea } from "./DiscardArea";
import { ConfirmationPopup } from "../ConfirmationPopup";
import debilek from "../../assets/testMainCharacter.png";
import { Inventory } from "../../types";

interface InventoryProps {
  currentInventory: Inventory | null | undefined;
  showInventory: boolean;
  setShowInventory: (showInventory: boolean) => void;
}

export const InventoryComponent = ({
  currentInventory,
  showInventory,
  setShowInventory,
}: InventoryProps) => {
  const [inventoryItemsData, setInventoryItemsData] = useState<
    (string | null | undefined)[]
  >([
    currentInventory?.item1?.itemImages[0].filePath,
    currentInventory?.item2?.itemImages[0].filePath,
    currentInventory?.item3?.itemImages[0].filePath,
    currentInventory?.item4?.itemImages[0].filePath,
    currentInventory?.item5?.itemImages[0].filePath,
    currentInventory?.item6?.itemImages[0].filePath,
    currentInventory?.item7?.itemImages[0].filePath,
    currentInventory?.item8?.itemImages[0].filePath,
    currentInventory?.item9?.itemImages[0].filePath,
  ]);

  useEffect(() => {
    setInventoryItemsData([
      currentInventory?.item1?.itemImages[0].filePath,
      currentInventory?.item2?.itemImages[0].filePath,
      currentInventory?.item3?.itemImages[0].filePath,
      currentInventory?.item4?.itemImages[0].filePath,
      currentInventory?.item5?.itemImages[0].filePath,
      currentInventory?.item6?.itemImages[0].filePath,
      currentInventory?.item7?.itemImages[0].filePath,
      currentInventory?.item8?.itemImages[0].filePath,
      currentInventory?.item9?.itemImages[0].filePath,
    ]);
  }, [currentInventory]);

  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [itemToDiscard, setItemToDiscard] = useState<number | null>(null);

  const moveItem = (fromIndex: number, toIndex: number | "discard") => {
    if (toIndex === "discard") {
      setItemToDiscard(fromIndex);
      setShowPopup(true);
    } else {
      setInventoryItemsData((prevItems) => {
        const updatedItems = [...prevItems];
        const temp = updatedItems[toIndex];
        updatedItems[toIndex] = updatedItems[fromIndex];
        updatedItems[fromIndex] = temp;
        return updatedItems;
      });
    }
  };

  const confirmDiscard = () => {
    if (itemToDiscard !== null) {
      setInventoryItemsData((prevItems) => {
        const updatedItems = [...prevItems];
        updatedItems[itemToDiscard] = null;
        return updatedItems;
      });
      setItemToDiscard(null);
    }
    setShowPopup(false);
  };

  const cancelDiscard = () => {
    setItemToDiscard(null);
    setShowPopup(false);
  };

  return (
    <>
      {!showInventory && (
        <div className="inventory__button">
          <HomeScreenButton
            text="Inventář"
            onClick={() => setShowInventory(true)}
          />
        </div>
      )}
      {showInventory && (
        <div className="inventory__container">
          <div className="inventory__button">
            <HomeScreenButton
              text="Zpět"
              onClick={() => setShowInventory(false)}
            />
          </div>
          <div className="inventory-item__container">
            {inventoryItemsData.map((item, index) => (
              <DroppableInventorySlot
                key={`slot-${index}`}
                index={index}
                moveItem={moveItem}
              >
                <DraggableInventoryItem imageUrl={item} index={index} />
              </DroppableInventorySlot>
            ))}
          </div>
          <div className="discard-area__container">
            <DiscardArea moveItem={moveItem} />
          </div>
        </div>
      )}
      {/*       {showInventory && (
        <div className="inventory-character__container">
          <img src={debilek} alt="kys" />
        </div>
      )} */}
      {showPopup && (
        <ConfirmationPopup
          message="Are you sure you want to discard this item?"
          onConfirm={confirmDiscard}
          onCancel={cancelDiscard}
        />
      )}
    </>
  );
};

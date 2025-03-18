import { Inventory, Item } from "../types";
import { User } from "../UserContext";

export const addItemToInventory = (data: {
  item: Item | undefined;
  currentInventory: Inventory | undefined;
  slotToAddTo?: number;
  setCurrentInventory: (curentInventory: Inventory | undefined) => void;
  user: User | null;
}) => {
  if (data.user && data.currentInventory) {
    let slotToAdd;
    if (data.slotToAddTo) {
      slotToAdd = data.slotToAddTo;
    } else {
      slotToAdd = findFirstEmptySlot(data.currentInventory);
    }
    if (slotToAdd === null) {
      console.log("Inventory is full");
      return;
    }
    data.currentInventory[`item${slotToAdd}`] = data.item;

    data.setCurrentInventory({
      ...data.currentInventory,
      [`item${slotToAdd}`]: data.item,
    });
    console.log("Item added to inventory", data.currentInventory);
  } else {
    //handle adding item to local storage :)
  }
};

const findFirstEmptySlot = (inventory: Inventory): number | null => {
  for (const key in inventory) {
    if (inventory[key as keyof Inventory] === null) {
      const slotNumber = parseInt(key.replace("item", ""), 10);
      return slotNumber;
    }
  }
  return null;
};

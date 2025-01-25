import { Inventory, Item } from "../types";
import { User } from "../UserContext";

export const addItemToInventory = (data: {
  item: Item | undefined;
  user: User | null;
  slotToAddTo?: number;
  setUser: (user: User) => void;
}) => {
  if (data.user) {
    let slotToAdd;
    let currentInventory = { ...data.user.gameState.inventoryState };
    if (data.slotToAddTo) {
      slotToAdd = data.slotToAddTo;
    } else {
      slotToAdd = findFirstEmptySlot(currentInventory);
    }
    if (slotToAdd === null) {
      console.log("Inventory is full");
      return;
    }
    currentInventory[`item${slotToAdd}`] = data.item;
    const updatedUser = {
      ...data.user,
      gameState: {
        ...data.user.gameState,
        inventoryState: currentInventory,
      },
    };
    data.setUser(updatedUser);
    console.log(currentInventory);
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

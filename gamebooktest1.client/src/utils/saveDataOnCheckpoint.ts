import { Inventory, Quest } from "../types";
import { User } from "../UserContext";

export const saveDataOnCheckpoint = async (
  user: User,
  setUser: (user: User) => void,
  sceneId: number,
  currentInventoryState: Inventory,
  currentQuestState: Quest[]
) => {};

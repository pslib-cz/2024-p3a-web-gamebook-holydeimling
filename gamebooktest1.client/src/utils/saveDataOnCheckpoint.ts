import { toast } from "sonner";
import { Inventory, Quest } from "../types";
import { User } from "../UserContext";

export const saveDataOnCheckpoint = async (
  user: User | null,
  setUser: (user: User) => void,
  sceneId: number,
  currentInventoryState: Inventory | undefined,
  currentQuestState: Quest[] | undefined
) => {
  if (user) {
    // checkpointSceneId
    try {
      const formData = new FormData();
      formData.append("checkpointSceneId", `${sceneId}`);

      const response = await fetch(
        `/api/GameState/edit/CheckpointSceneId/${user.gameState.gameStateId}`,
        {
          method: "PUT",
          headers: {
            Accept: "*/*",
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      // Fetch the updated user data
      const userResponse = await fetch(`/api/Users/${user.id}`, {
        method: "GET",
        headers: {
          Accept: "*/*",
        },
      });

      if (!userResponse.ok) {
        throw new Error(`HTTP error! Status: ${userResponse.status}`);
      }

      const updatedUser = await userResponse.json();
      setUser(updatedUser as User);
      toast.info("Hra uložena");
      console.log("User data fetched successfully", updatedUser);
    } catch (error) {
      console.error("Error updating checkpoint scene ID:", error);
    }
    // inventoryState
    /*
    curl -X 'PUT' \
    'https://localhost:7174/api/Inventory/edit/1' \
    -H 'accept: /' \
    -H 'Content-Type: multipart/form-data' \
    -F 'item8Id=' \
    -F 'item9Id=' \
    -F 'item1Id=' \
    -F 'item2Id=1' \
    -F 'item3Id=' \
    -F 'item4Id=' \
    -F 'item5Id=' \
    -F 'item6Id=' \
    -F 'item7Id=' 
  */
    try {
      const formData = new FormData();
      formData.append(
        "item1Id",
        `${
          currentInventoryState?.item1?.itemId
            ? currentInventoryState?.item1?.itemId
            : ""
        }`
      );
      formData.append(
        "item2Id",
        `${
          currentInventoryState?.item2?.itemId
            ? currentInventoryState?.item2?.itemId
            : ""
        }`
      );
      formData.append(
        "item3Id",
        `${
          currentInventoryState?.item3?.itemId
            ? currentInventoryState?.item3?.itemId
            : ""
        }`
      );
      formData.append(
        "item4Id",
        `${
          currentInventoryState?.item4?.itemId
            ? currentInventoryState?.item4?.itemId
            : ""
        }`
      );
      formData.append(
        "item5Id",
        `${
          currentInventoryState?.item5?.itemId
            ? currentInventoryState?.item5?.itemId
            : ""
        }`
      );
      formData.append(
        "item6Id",
        `${
          currentInventoryState?.item6?.itemId
            ? currentInventoryState?.item6?.itemId
            : ""
        }`
      );
      formData.append(
        "item7Id",
        `${
          currentInventoryState?.item7?.itemId
            ? currentInventoryState?.item7?.itemId
            : ""
        }`
      );
      formData.append(
        "item8Id",
        `${
          currentInventoryState?.item8?.itemId
            ? currentInventoryState?.item8?.itemId
            : ""
        }`
      );
      formData.append(
        "item9Id",
        `${
          currentInventoryState?.item9?.itemId
            ? currentInventoryState?.item9?.itemId
            : ""
        }`
      );

      const response = await fetch(
        `/api/Inventory/edit/${user.gameState.inventoryState.inventoryId}`,
        {
          method: "PUT",
          headers: {
            Accept: "*/*",
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      // Fetch the updated user data
      const userResponse = await fetch(`/api/Users/${user.id}`, {
        method: "GET",
        headers: {
          Accept: "*/*",
        },
      });

      if (!userResponse.ok) {
        throw new Error(`HTTP error! Status: ${userResponse.status}`);
      }

      const updatedUser = await userResponse.json();
      setUser(updatedUser as User);
      toast.info("Hra uložena");
      console.log("User data fetched successfully", updatedUser);
    } catch (error) {
      console.error("Error updating inventory state:", error);
    }
    // questsState
  }
};

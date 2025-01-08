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
        `https://localhost:7174/api/GameState/edit/CheckpointSceneId/${user.gameState.gameStateId}`,
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
      const userResponse = await fetch(
        `https://localhost:7174/api/Users/${user.id}`,
        {
          method: "GET",
          headers: {
            Accept: "*/*",
          },
        }
      );

      if (!userResponse.ok) {
        throw new Error(`HTTP error! Status: ${userResponse.status}`);
      }

      const updatedUser = await userResponse.json();
      setUser(updatedUser as User);
      console.log("User data fetched successfully", updatedUser);
    } catch (error) {
      console.error("Error updating checkpoint scene ID:", error);
    }
    // inventoryState

    // questsState
  }
};

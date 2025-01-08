import { User } from "../UserContext";
import { startSceneId } from "./constants";

export const newGame = async (
  user: User | null,
  setUser: (user: User) => void
) => {
  if (user) {
    try {
      const formData = new FormData();
      formData.append("checkpointSceneId", `${startSceneId}`); // Set the checkpointSceneId to default value that is 1

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

      console.log(
        "Checkpoint scene ID updated successfully" + user.gameState.gameStateId
      );

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
  }
};

export const loadGame = async (
  user: User | null,
  setUser: (user: User) => void
) => {
  if (user) {
    try {
      const response = await fetch(
        `https://localhost:7174/api/Users/${user.id}`,
        {
          method: "GET",
          headers: {
            Accept: "*/*",
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setUser(data as User);
      console.log("Game loaded successfully", data);
    } catch (error) {
      console.error("Error loading game:", error);
    }
  }
};

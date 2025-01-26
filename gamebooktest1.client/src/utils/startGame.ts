import { toast } from "sonner";
import { User } from "../UserContext";
import { startSceneId } from "./constants";

export const newGame = async (
  user: User | null,
  setUser: (user: User) => void
) => {
  if (user) {
    try {
      const formData = new FormData();
      formData.append("checkpointSceneId", `${startSceneId}`);

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
      toast.info("Nová hra byla zahájena");
      console.log(user);
      console.log("User data fetched successfully", updatedUser);
    } catch (error) {
      console.error("Error updating checkpoint scene ID:", error);
    }

    try {
      const formData = new FormData();
      formData.append("item1Id", `${""}`);
      formData.append("item2Id", `${""}`);
      formData.append("item3Id", `${""}`);
      formData.append("item4Id", `${""}`);
      formData.append("item5Id", `${""}`);
      formData.append("item6Id", `${""}`);
      formData.append("item7Id", `${""}`);
      formData.append("item8Id", `${""}`);
      formData.append("item9Id", `${""}`);

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
      console.log("User data fetched successfully", updatedUser);
    } catch (error) {
      console.error("Error updating inventory state:", error);
    }
  }
};

export const loadGame = async (
  user: User | null,
  setUser: (user: User) => void
) => {
  if (user) {
    try {
      const response = await fetch(`/api/Users/${user.id}`, {
        method: "GET",
        headers: {
          Accept: "*/*",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setUser(data as User);
      console.log("Game loaded successfully", data);
      toast.info("Hra byla načtena");
      console.log(user);
    } catch (error) {
      console.error("Error loading game:", error);
      toast.error("Nastala chyba při načítání hry");
    }
  }
};

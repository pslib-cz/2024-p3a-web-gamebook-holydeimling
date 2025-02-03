import { Scene } from "../types";

export const fetchScene = async (
  id: number,
  setScene: (scene: Scene) => void,
  setShowGameOutro: (showGameOutro: boolean) => void
) => {
  try {
    const response = await fetch(`/api/Scene/${id}`, {
      method: "GET",
      headers: {
        Accept: "*/*", // Header matching your curl command
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        setShowGameOutro(true);
        console.log("Scene not found, showing game outro");
        return;
      }

      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json(); // Parse response as JSON
    setScene(data as Scene); // Set the scene object in state
    console.log(data); // Log the object to console
  } catch (error) {
    console.error("Error fetching scene:", error);
  }
};

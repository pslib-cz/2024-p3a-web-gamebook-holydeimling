import { Scene } from "../types";

export const fetchScene = async (
  id: number,
  setScene: (scene: Scene) => void
) => {
  try {
    const response = await fetch(`/api/Scene/${id}`, {
      method: "GET",
      headers: {
        Accept: "*/*", // Header matching your curl command
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json(); // Parse response as JSON
    setScene(data as Scene); // Set the scene object in state
    console.log(data); // Log the object to console
  } catch (error) {
    console.error("Error fetching scene:", error);
  }
};

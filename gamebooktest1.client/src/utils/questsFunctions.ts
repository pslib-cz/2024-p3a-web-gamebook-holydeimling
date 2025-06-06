import { Quest } from "../types";

//ZKONTROLOVAT ZDA FUNGUJE
export const addQuestToGameState = async (
  gameStateId: number,
  questId: number
) => {
  try {
    const formData = new FormData();
    formData.append("questId", questId.toString());

    const response = await fetch(`/api/GameState/addQuest/${gameStateId}`, {
      method: "POST",
      headers: {
        Accept: "*/*",
        // 'Content-Type': 'multipart/form-data' // Note: Do not set this header manually, the browser will set it automatically
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    console.log("Quest added successfully", result);
    return result;
  } catch (error) {
    console.error("Error adding quest:", error);
    throw error;
  }
};

export const deleteQuestFromGameState = async (
  gameStateId: number,
  questId: number
) => {
  try {
    const formData = new FormData();
    formData.append("questId", questId.toString());

    const response = await fetch(`/api/GameState/deleteQuest/${gameStateId}`, {
      method: "DELETE",
      headers: {
        Accept: "*/*",
        // 'Content-Type': 'multipart/form-data' // Note: Do not set this header manually, the browser will set it automatically
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    console.log("Quest deleted successfully", result);
    return result;
  } catch (error) {
    console.error("Error deleting quest:", error);
    throw error;
  }
};

export const getQuestFromDb = async (questId: number) => {
  try {
    const response = await fetch(`/api/Quest/${questId}`, {
      method: "GET",
      headers: {
        Accept: "*/*",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    console.log("Quest fetched successfully", result);
    return result as Quest;
  } catch (error) {
    console.error("Error fetching quest:", error);
    throw error;
  }
};

export const editQuestState = async (
  user: any,
  setUser: any,
  gameStateId: number | undefined,
  questsIds: number[]
) => {
  try {
    const formData = new FormData();
    questsIds.forEach((id) => {
      formData.append("questsIds", id.toString());
    });

    const response = await fetch(
      `https://localhost:7174/api/GameState/edit/QuestsState/${gameStateId}`,
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

    console.log("Quest state edited successfully");
    // Optionally update the user state here if needed
  } catch (error) {
    console.error("Error editing quest state:", error);
  }
};

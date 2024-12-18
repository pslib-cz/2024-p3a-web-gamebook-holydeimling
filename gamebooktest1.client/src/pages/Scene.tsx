import React, { useEffect, useState } from "react";
import { Scene, SceneCharacter } from "../types";

export const ScenePage = () => {
  const [sceneId, setSceneId] = useState(1); // State to store the scene ID
  const [scene, setScene] = useState<Scene>(); // State to store the fetched scene object

  const fetchScene = async (id: number) => {
    try {
      const response = await fetch(`https://localhost:7174/api/Scene/${id}`, {
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
      console.log(scene); // Log the object to console
    } catch (error) {
      console.error("Error fetching scene:", error);
    }
  };

  useEffect(() => {
    fetchScene(sceneId);
  }, [sceneId]); // Fetch scene whenever sceneId changes

  const handleButtonClick = () => {
    setSceneId(sceneId + 1); // Increment sceneId by 1
  };

  return (
    <div>
      <h1>Scene id: {sceneId}</h1>
      <h2>Scene Data</h2>
      {scene ? (
        <pre>{JSON.stringify(scene, null, 2)}</pre> // Pretty-print JSON data
      ) : (
        <p>Loading...</p>
      )}
      <div>
        <button onClick={handleButtonClick}>Change Scene</button>
      </div>
      {scene?.sceneId && <img src={scene.backgroundImage.filePath} alt="" />}
      {scene?.sceneCharacters.map((sceneCharacter: SceneCharacter) => (
        <div key={sceneCharacter.sceneCharacterId}>
          <h3>{sceneCharacter.character.firstName}</h3>
          <img
            src={sceneCharacter.character.characterImages[0].filePath}
            alt=""
          />
        </div>
      ))}
      {scene?.sceneItems.map((sceneItem) => (
        <div key={sceneItem.sceneItemId}>
          <h3>{sceneItem.item.itemName}</h3>
          <img src={sceneItem.item.itemImages[0].filePath} alt="" />
        </div>
      ))}
    </div>
  );
};

import React, { useEffect, useState } from "react";

export const Scene = () => {
  const [sceneId, setSceneId] = useState(1); // State to store the scene ID
  const [scene, setScene] = useState(null); // State to store the fetched scene object
  const [inputSceneId, setInputSceneId] = useState(1); // State to store the input value

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
      setScene(data); // Save the response to state
      console.log(data); // Log the object to console
    } catch (error) {
      console.error("Error fetching scene:", error);
    }
  };

  useEffect(() => {
    fetchScene(sceneId);
  }, [sceneId]); // Fetch scene whenever sceneId changes

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputSceneId(Number(event.target.value));
  };

  const handleButtonClick = () => {
    setSceneId(inputSceneId);
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
        <label>
          Change Scene ID:
          <input
            type="number"
            value={inputSceneId}
            onChange={handleInputChange}
          />
        </label>
        <button onClick={handleButtonClick}>Change Scene</button>
      </div>
    </div>
  );
};

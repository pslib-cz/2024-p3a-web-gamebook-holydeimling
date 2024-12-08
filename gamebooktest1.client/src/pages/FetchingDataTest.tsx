import { useEffect, useState } from "react";

export const FetchingDataTest = () => {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const response = await fetch(`https://localhost:7174/api/character/1`);
        if (!response.ok) {
          throw new Error("Error! Status: " + response.status);
        }
        const encodedData = await response.json();
        console.log(encodedData); // Log the data to inspect it
        setData(encodedData);
      } catch (error) {
        console.error("Fetch error: ", error);
        setError(error.message);
      }
    };

    fetchCharacter();
  }, []);

  return (
    <div>
      {error ? (
        <div>Error: {error}</div>
      ) : (
        <div>{data ? JSON.stringify(data, null, 2) : "Loading..."}</div>
      )}
    </div>
  );
};

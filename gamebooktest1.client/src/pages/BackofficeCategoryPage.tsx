import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const BackofficeCategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (category: string) => {
    try {
      console.log(`Fetching data for category: ${category}`);
      const response = await fetch(`https://localhost:7174/api/${category}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
    } catch (error) {
      setError(`Failed to fetch ${category} data.`);
      console.error(error);
    }
  };

  useEffect(() => {
    if (category) {
      fetchData(category);
    }
  }, [category]);

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <div className="category-data-container">
      <h1>Data for {category}</h1>
      {data.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <div className="cards-container">
          {data.map((item, index) => (
            <div key={index} className="card">
              <pre>{JSON.stringify(item, null, 2)}</pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

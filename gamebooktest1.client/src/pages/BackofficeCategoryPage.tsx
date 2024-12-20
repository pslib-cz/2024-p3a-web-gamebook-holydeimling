import { useEffect, useState } from "react";
import { useParams, Link, Route, Routes } from "react-router-dom";

export const BackofficeCategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [categoryIdName, setCategoryIdName] = useState<string>("");

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

      // Dynamically determine the ID field by inspecting the first item
      if (result.length > 0) {
        const idField = Object.keys(result[0]).find((key) =>
          key.toLowerCase().includes("id")
        );
        if (idField) {
          setCategoryIdName(idField);
        } else {
          throw new Error("ID field not found in the fetched data.");
        }
      }
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
              <Link to={`/backoffice/${category}/${item[categoryIdName]}`}>
                <p>ID: {item[categoryIdName]}</p>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ItemDetail: React.FC = () => {
  const { category, id } = useParams<{ category: string; id: string }>();
  const [item, setItem] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchItem = async (category: string, id: string) => {
    try {
      const response = await fetch(
        `https://localhost:7174/api/${category}/${id}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      setItem(result);
      console.log(`Fetched item with ID ${id}`);
    } catch (error) {
      setError(`Failed to fetch ${category} item with ID ${id}.`);
      console.error(error);
    }
  };

  useEffect(() => {
    if (category && id) {
      fetchItem(category, id);
    }
  }, [category, id]);

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <div className="item-detail-container">
      <h1>
        Detail for {category} ID: {id}
      </h1>
      {item ? (
        <div className="item-details">
          {Object.entries(item).map(([key, value]) => (
            <div key={key} className="item-detail">
              <strong>{key}:</strong> {JSON.stringify(value, null, 2)}
            </div>
          ))}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export const BackofficeCategoryRouter = () => {
  return (
    <Routes>
      <Route
        path="/backoffice/:category"
        element={<BackofficeCategoryPage />}
      />
      <Route path="/backoffice/:category/:id" element={<ItemDetail />} />
    </Routes>
  );
};

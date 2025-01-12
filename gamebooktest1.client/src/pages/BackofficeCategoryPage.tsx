import { useEffect, useState } from "react";
import { useParams, Link, Route, Routes, useNavigate } from "react-router-dom";
import ItemDetail from "./BakofficeItemDetail";
import "./BackofficePage.css";

export const BackofficeCategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [categoryIdName, setCategoryIdName] = useState<string>("");
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchData = async (category: string) => {
    try {
      console.log(`Fetching data for category: ${category}`);
      const response = await fetch(`/api/${category}`, {
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

  const handleItemClick = (id: string) => {
    setSelectedItemId(id);
    navigate(`/backoffice/${category}/${id}`);
  };

  const handleCloseModal = () => {
    setSelectedItemId(null);
    navigate(`/backoffice/${category}`);
  };

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
            <div
              key={index}
              className="card"
              onClick={() => handleItemClick(item[categoryIdName])}
            >
              <p>ID: {item[categoryIdName]}</p>
            </div>
          ))}
        </div>
      )}
      {selectedItemId && <ItemDetail onClose={handleCloseModal} />}
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
      <Route
        path="/backoffice/:category/:id"
        element={<BackofficeCategoryPage />}
      />
    </Routes>
  );
};

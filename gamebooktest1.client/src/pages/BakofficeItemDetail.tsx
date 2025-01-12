import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./BackofficeItemDetail.css";

const ItemDetail: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { category, id } = useParams<{ category: string; id: string }>();
  const [item, setItem] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editedItem, setEditedItem] = useState<any>({});
  const navigate = useNavigate();
  const fetchItem = async (category: string, id: string) => {
    try {
      const response = await fetch(`/api/${category}/${id}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      setItem(result);
      setEditedItem(result);
      console.log(`Fetched item with ID ${id}`);
    } catch (error) {
      setError(`Failed to fetch ${category} item with ID ${id}.`);
      console.error(error);
    }
  };

  const handleInputChange = (key: string, value: any) => {
    setEditedItem((prev: any) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleEdit = async () => {
    try {
      const response = await fetch(`/api/${category}/edit/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedItem),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      setItem(result);
      setEditMode(false);
      navigate(`/backoffice/${category}`);
      console.log(`Edited item with ID ${id}`);
    } catch (error) {
      setError(`Failed to edit ${category} item with ID ${id}.`);
      console.error(error);
      navigate(`/backoffice/${category}`);
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
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h1>
          Detail for {category} ID: {id}
        </h1>
        {item ? (
          <div className="item-details">
            {Object.entries(item).map(([key, value]) => (
              <div key={key} className="item-detail">
                <strong>{key}:</strong>
                {editMode ? (
                  <label htmlFor={key}>
                    {key}
                    <input
                      type="text"
                      value={editedItem[key]}
                      onChange={(e) => handleInputChange(key, e.target.value)}
                    />
                  </label>
                ) : (
                  <span>{JSON.stringify(value, null, 2)}</span>
                )}
              </div>
            ))}
            {editMode ? (
              <button onClick={handleEdit}>Save</button>
            ) : (
              <button onClick={() => setEditMode(true)}>Edit</button>
            )}
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default ItemDetail;

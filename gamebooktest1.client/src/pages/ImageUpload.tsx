import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";

export const ImageUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [mimeType, setMimeType] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleMimeTypeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMimeType(e.target.value);
  };

  const handleDescriptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("mimeType", mimeType);
    formData.append("description", description);

    try {
      const response = await axios.post(
        "https://localhost:7174/api/image/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessage(`Image uploaded successfully: ${response.data.imageId}`);
    } catch (error) {
      setMessage("Failed to upload image");
    }
  };

  return (
    <div>
      <h1>Upload Image</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            File:
            <input type="file" onChange={handleFileChange} />
          </label>
        </div>
        <div>
          <label>
            MIME Type:
            <input
              type="text"
              value={mimeType}
              onChange={handleMimeTypeChange}
            />
          </label>
        </div>
        <div>
          <label>
            Description:
            <input
              type="text"
              value={description}
              onChange={handleDescriptionChange}
            />
          </label>
        </div>
        <button type="submit">Upload</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

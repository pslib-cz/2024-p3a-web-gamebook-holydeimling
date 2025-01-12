import React, { useEffect, useState } from "react";
import { data } from "react-router-dom";

export const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadMessage, setUploadMessage] = useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadMessage("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/FileUpload/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setUploadMessage(`File uploaded successfully: ${data.FilePath}`);
      } else {
        const errorData = await response.json();
        setUploadMessage(`File upload failed: ${errorData.message}`);
      }
    } catch (error) {
      setUploadMessage("An error occurred while uploading the file.");
    }
  };

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch("/api/FileUpload/1");
        if (!response.ok) {
          throw new Error("Error! Status: " + response.status);
        }
        const data = await response.json();
        console.log(data); // Log the data to inspect it
      } catch (error) {
        console.error("Fetch error: ", error);
      }
    };
    fetchImage();
  }, []);

  return (
    <div style={{ margin: "20px" }}>
      <h2>File Upload</h2>
      <label>
        File
        <input
          type="file"
          onChange={handleFileChange}
          accept=".jpg,.jpeg,.png,.gif"
        />
      </label>
      <button onClick={handleUpload} style={{ marginLeft: "10px" }}>
        Upload
      </button>
      {uploadMessage && <p>{uploadMessage}</p>}
      <img src={""} alt="Uploaded file" />
    </div>
  );
};

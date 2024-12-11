import React, { useState } from "react";
import "./HomeScreenForm.css";

type HomeScreenFormProps = {
  heading: string;
  inputs: { type: string; placeholder: string }[];
  buttonText: string;
  onSubmit: (formData: Record<string, string>) => void;
};

export const HomeScreenForm = ({
  heading,
  inputs,
  buttonText,
  onSubmit,
}: HomeScreenFormProps) => {
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    placeholder: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [placeholder]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="homescreen-form__container">
      <h2>{heading}</h2>
      <form onSubmit={handleSubmit}>
        {inputs.map((input, index) => (
          <input
            key={index}
            type={input.type}
            placeholder={input.placeholder}
            onChange={(e) => handleInputChange(e, input.placeholder)}
            required
          />
        ))}
        <button type="submit">{buttonText}</button>
      </form>
    </div>
  );
};
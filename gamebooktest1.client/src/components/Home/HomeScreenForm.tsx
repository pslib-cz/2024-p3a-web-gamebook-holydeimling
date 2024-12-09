import "./HomeScreenForm.css";

type HomeScreenFormProps = {
  heading: string;
  inputs: { type: string; placeholder: string; value?: string; onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void }[];
  buttonText: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export const HomeScreenForm = ({ heading, inputs, buttonText, onSubmit }: HomeScreenFormProps) => {
  return (
    <div className="homescreen-form__container">
      <h2>{heading}</h2>
      <form onSubmit={onSubmit}>
        {inputs.map((input, index) => (
          <input
            key={index}
            type={input.type}
            placeholder={input.placeholder}
            value={input.value}
            onChange={input.onChange}
          />
        ))}
        <button type="submit">{buttonText}</button>
      </form>
    </div>
  );
};

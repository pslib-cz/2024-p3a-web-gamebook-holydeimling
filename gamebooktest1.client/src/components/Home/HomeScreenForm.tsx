import "./HomeScreenForm.css";

type HomeScreenFormProps = {
  heading: string;
  inputs: { type: string; placeholder: string }[];
  buttonText: string;
};

export const HomeScreenForm = ({
  heading,
  inputs,
  buttonText,
}: HomeScreenFormProps) => {
  return (
    <div className="homescreen-form__container">
      <h2>{heading}</h2>
      <form>
        {inputs.map((input, index) => (
          <input
            key={index}
            type={input.type}
            placeholder={input.placeholder}
          />
        ))}
        <button>{buttonText}</button>
      </form>
    </div>
  );
};

import "./HomeScreenButton.css";

type HomeScreenButtonProps = {
  text: string;
  onClick: () => void;
};

export const HomeScreenButton = ({ text, onClick }: HomeScreenButtonProps) => {
  return (
    <button className="button__container" onClick={onClick}>
      {text}
    </button>
  );
};

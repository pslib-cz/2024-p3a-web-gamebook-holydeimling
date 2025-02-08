import "./DialogSystemButton.css";

type DialogSystemButtonProps = {
  text: string | null | undefined;
  onClick: () => void;
};

export const DialogSystemButton = ({
  text,
  onClick,
}: DialogSystemButtonProps) => {
  return (
    <button className="dialog-system__button" onClick={onClick}>
      {text ? text : "Dále..."}
    </button>
  );
};

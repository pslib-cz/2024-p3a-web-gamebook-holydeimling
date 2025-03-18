import "./ConfirmationPopup.css";

type ConfirmationPopupProps = {
  onConfirm: () => void;
  onCancel: () => void;
  message: string;
};

export const ConfirmationPopup = ({
  onConfirm,
  onCancel,
  message,
}: ConfirmationPopupProps) => {
  return (
    <div className="popup__container">
      <p>{message}</p>
      <div className="popup__buttons">
        <button onClick={onConfirm} className="popup__confirm">
          Yes
        </button>
        <button onClick={onCancel} className="popup__cancel">
          No
        </button>
      </div>
    </div>
  );
};

import "./WrongOrientationScreen.css";

export const WrongOrientationScreen = () => {
  return (
    <div className="wrong-orientation-screen">
      <h1 className="wrong-orientation-title">Nesprávná orientace zařízení</h1>
      <p className="wrong-orientation-text">
        Pro lepší herní zážitek prosím otočte své zařízení do horizontální
        polohy.
      </p>
      <div className="device-container">
        <div className="device-animation">
          <div className="device-screen"></div>
        </div>
      </div>
    </div>
  );
};

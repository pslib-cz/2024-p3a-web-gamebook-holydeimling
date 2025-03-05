import "./AboutStyles.css";

export const AboutCreators = () => {
  return (
    <div className="retro-container">
      <h1 className="retro-title">Jsme 2 :)</h1>
      <div className="retro-creator">
        <h2 className="retro-subtitle">Martin Holý</h2>
        <p className="retro-text">frontend, backend, částečný příběh</p>
        <a
          href="https://github.com/MartinHoly00"
          className="retro-creator-link"
        >
          Github
        </a>
      </div>
      <div className="retro-creator">
        <h2 className="retro-subtitle">Harry Bambling</h2>
        <p className="retro-text">data, částečný příběh, ui (moc ne)</p>
        <a href="https://github.com/JsemHarry7" className="retro-creator-link">
          Github
        </a>
      </div>
    </div>
  );
};

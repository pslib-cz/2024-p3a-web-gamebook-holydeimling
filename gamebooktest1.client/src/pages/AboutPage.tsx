import { Link } from "react-router-dom";

export const AboutPage = () => {
  return (
    <div>
      <h1>About Page</h1>
      <p>This is the about page</p>
      <Link to="/">Go back to the homepage</Link>
    </div>
  );
};

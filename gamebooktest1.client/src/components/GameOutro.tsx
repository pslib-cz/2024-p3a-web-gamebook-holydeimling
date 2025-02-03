import React, { useEffect } from "react";
import "./GameOutro.css";
import { Link } from "react-router-dom";
import { HomeScreenLogo } from "./Home/HomeScreenLogo";

const roles = [
  "Executive Producer",
  "Game Director",
  "Creative Director",
  "Lead Programmer",
  "Senior Game Designer",
  "Narrative Designer",
  "Art Director",
  "3D Artist",
  "Concept Artist",
  "Animation Lead",
  "Level Designers",
  "UI/UX Designer",
  "Music Composer",
  "Sound Design Director",
  "Voice Acting Director",
  "Lead QA Engineer",
  "Systems Designer",
  "Marketing Director",
  "Community Manager",
  "Technical Artist",
  "Scripting Engineer",
  "Lighting Artist",
  "Environment Artist",
  "Character Modeler",
  "Texture Artist",
  "Dialogue Writer",
  "Playtest Coordinator",
  "Localization Manager",
  "Customer Support Lead",
  "Financial Controller",
  "Legal Advisor",
];

const names = ["Harry Deimling", "Martin Holý"];

const getRandomName = () => names[Math.floor(Math.random() * names.length)];

export const GameOutro = () => {
  useEffect(() => {
    document.body.classList.add("credits-open");
    return () => document.body.classList.remove("credits-open");
  }, []);

  return (
    <div className="game-outro">
      <div className="credits-container">
        <div className="title">
          <HomeScreenLogo />
        </div>
        <div className="credits-scroll">
          <div className="production-company">
            <h2>A HayaMayo production</h2>
          </div>

          <div className="main-credits">
            {roles.map((role, index) => (
              <div
                key={role}
                className="credit-block"
                style={{ animationDelay: `${index * 1.5}s` }}
              >
                <div className="role">{role}</div>
                <div className="name">{getRandomName()}</div>
              </div>
            ))}
          </div>

          <div className="special-thanks">
            <h3>Special Thanks To</h3>
            <div className="thanks-content">
              <p>Our Amazing Playtesters</p>
              <p>The Open Source Community</p>
              <p>Game Development Mentors</p>
              <p>Our Supportive Families</p>
            </div>
          </div>

          <div className="final-card">
            <h2>In Memory Of</h2>
            <p>All Fallen NPCs</p>
          </div>

          <div className="final-message">
            <div className="made-with">
              Made with 🔥 using React & TypeScript
            </div>
            <h2>Thank You For Playing!</h2>
            <p>The adventure continues...</p>
            <Link to="/" className="btn">
              Back Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

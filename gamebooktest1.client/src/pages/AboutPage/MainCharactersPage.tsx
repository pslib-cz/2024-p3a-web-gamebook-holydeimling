import { useEffect, useState } from "react";
import { Character } from "../../types";
import { CharactersPageSection } from "../../components/CharactersPageSection";
import "./StoryPage.css";

export const MainCharactersPage = () => {
  const [characters, setCharacters] = useState<Character[]>([]);

  useEffect(() => {
    const fetchCharacters = async () => {
      const response = await fetch("/api/Character", {
        method: "GET",
        headers: {
          Accept: "*/*",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setCharacters(data as Character[]);
      console.log(data);
    };
    fetchCharacters();
    console.log(characters);
  }, []);

  return (
    <div className="story-page">
      <h1>Důležité postavy a jejich příběhy</h1>
      {characters.map((character, index) => (
        <CharactersPageSection
          key={character.characterId}
          character={character}
          className={index % 2 === 1 ? "row-reverse" : ""}
        />
      ))}
    </div>
  );
};

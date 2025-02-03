import { Character } from "../types";
import "./CharactersPageSection.css";

type CharactersPageSectionProps = {
  character: Character;
  className?: string;
};

export const CharactersPageSection = ({
  character,
  className = "",
}: CharactersPageSectionProps) => {
  return (
    <section
      key={character.characterId}
      className={`characters-page__section ${className}`}
    >
      <div>
        <h2>
          {character.firstName} "{character.nickname}" {character.lastName}
        </h2>
        <p>{character.backStory}</p>
      </div>
      <img src={`/${character.characterImages[0].filePath}`} alt="" />
    </section>
  );
};

import { SceneCharacter } from "../types";

type SceneCharacterComponentProps = {
  sceneCharacter: SceneCharacter;
};

export const SceneCharacterComponent = ({
  sceneCharacter,
}: SceneCharacterComponentProps) => {
  return (
    <div key={sceneCharacter.sceneCharacterId}>
      <img
        key={sceneCharacter.sceneCharacterId}
        src={`/${sceneCharacter.character.characterImages[0].filePath}`}
        alt={sceneCharacter.character.firstName}
        style={{
          top: `${sceneCharacter.position.y}px`, //předělat na %
          left: `${sceneCharacter.position.x}px`, //předělat na %
          width: `${sceneCharacter.size.width}px`, //předělat na %
          height: `${sceneCharacter.size.height}px`, //předělat na %
        }}
        className="scene__image scene-character"
      />
    </div>
  );
};

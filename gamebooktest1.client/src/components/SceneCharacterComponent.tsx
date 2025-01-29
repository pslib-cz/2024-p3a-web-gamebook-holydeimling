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
          top: `${sceneCharacter.position.y}%`, //předělat na %
          left: `${sceneCharacter.position.x}%`, //předělat na %
          width: `${sceneCharacter.size.width}%`, //předělat na %
          height: `${sceneCharacter.size.height}%`, //předělat na %
          zIndex: 2,
        }}
        className="scene__image scene-character"
      />
    </div>
  );
};

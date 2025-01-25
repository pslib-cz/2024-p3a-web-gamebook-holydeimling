import { SceneItem } from "../types";

type SceneItemComponentProps = {
  sceneItem: SceneItem;
};

export const SceneItemComponent = ({ sceneItem }: SceneItemComponentProps) => {
  return (
    <div key={sceneItem.sceneItemId}>
      <h3>{sceneItem.item.itemName}</h3>
      <img
        key={sceneItem.sceneItemId}
        src={`/${sceneItem.item.itemImages[0].filePath}`}
        alt={sceneItem.item.itemName}
        style={{
          top: `${sceneItem.position.y}px`, //předělat na %
          left: `${sceneItem.position.x}px`, //předělat na %
          width: `${sceneItem.size.width}px`, //předělat na %
          height: `${sceneItem.size.height}px`, //předělat na %
        }}
        className="scene__image scene-item"
      />
    </div>
  );
};

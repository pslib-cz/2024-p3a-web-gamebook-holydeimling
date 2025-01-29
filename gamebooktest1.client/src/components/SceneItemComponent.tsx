import { toast } from "sonner";
import { Inventory, Scene, SceneItem } from "../types";
import { useUser } from "../UserContext";
import { addItemToInventory } from "../utils/inventoryFunctions";

type SceneItemComponentProps = {
  sceneItem: SceneItem;
  currentInventory: Inventory | undefined;
  setCurrentInventory: (inventory: Inventory | undefined) => void;
  currentScene: Scene;
  setCurrentScene: (scene: Scene) => void;
};

export const SceneItemComponent = ({
  sceneItem,
  currentInventory,
  setCurrentInventory,
  currentScene,
  setCurrentScene,
}: SceneItemComponentProps) => {
  const { user } = useUser();

  const removeItemFromScene = () => {
    const newSceneItems = currentScene.sceneItems.filter(
      (item) => item.sceneItemId !== sceneItem.sceneItemId
    );
    setCurrentScene({ ...currentScene, sceneItems: newSceneItems });
    toast.info("Předmět byl přidán do inventáře");
  };

  return (
    <div
      key={sceneItem.sceneItemId}
      onClick={() => {
        addItemToInventory({
          user: user,
          item: sceneItem.item,
          currentInventory: currentInventory,
          setCurrentInventory: setCurrentInventory,
        });
        removeItemFromScene();
      }}
    >
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

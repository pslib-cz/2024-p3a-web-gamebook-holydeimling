export type Image = {
  imageId: number;
  filePath: string;
};
export type Size = {
  sizeId: number;
  width: number;
  height: number;
};
export type Position = {
  positionId: number;
  x: number;
  y: number;
};

export type Character = {
  characterId: number;
  firstName: string;
  lastName: string;
  nickname: string | null;
  backStory: string | null;
  characterImages: Image[];
};

export type Item = {
  itemId: number;
  itemName: string;
  itemDescription: string | null;
  itemImages: Image[];
};

export type SceneCharacter = {
  sceneCharacterId: number;
  character: Character;
  position: Position;
  size: Size;
};

export type SceneItem = {
  sceneItemId: number;
  item: Item;
  position: Position;
  size: Size;
};
export type Dialog = {
  dialogId: number;
  character: Character;
  text: string;
};
export type Scene = {
  sceneId: number;
  backgroundImage: Image;
  sceneName: string;
  sceneCharacters: SceneCharacter[];
  sceneItems: SceneItem[];
  sceneDialogs: Dialog[];
};

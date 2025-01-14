export type Image = {
  imageId: number;
  name: string;
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
  dialogAnswers: DialogAnswer[];
};
export type DialogAnswer = {
  dialogAnswerId: number;
  answerText?: string | null;
  nextSceneId?: number | null;
  nextDialogId: number | null;
};
export type Scene = {
  sceneId: number;
  backgroundImage: Image;
  sceneName: string;
  sceneCharacters: SceneCharacter[];
  sceneItems: SceneItem[];
  sceneDialogs: Dialog[];
  isCheckpoint: boolean;
  gameOver: boolean;
  minigameId: number | null;
  questToAddId: number | null;
  questToRemoveId: number | null;
};

export type GameState = {
  gameStateId: number;
  inventoryState: Inventory;
  questsState: Quest[];
  checkpointSceneId: number;
};

export type Inventory = {
  inventoryId: number;
  item1: Item | null;
  item2: Item | null;
  item3: Item | null;
  item4: Item | null;
  item5: Item | null;
  item6: Item | null;
  item7: Item | null;
  item8: Item | null;
  item9: Item | null;
};

export type Quest = {
  questId: number;
  questHeading: string;
  questContent: string;
  isStoryQuest: boolean;
  isCompleted: boolean;
};

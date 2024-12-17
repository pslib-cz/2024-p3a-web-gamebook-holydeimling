export type Image = {
  ImageId: number;
  FilePath: string;
};
export type Size = {
  SizeId: number;
  Width: number;
  Height: number;
};
export type Position = {
  PositionId: number;
  X: number;
  Y: number;
};

export type Character = {
  CharacterId: number;
  FirstName: string;
  LastName: string;
  Nickname: string | null;
  BackStory: string | null;
  CharacterImages: Image[];
};

export type Item = {
  ItemId: number;
  ItemName: string;
  ItemDescription: string | null;
  ItemImages: Image[];
};

export type SceneCharacter = {
  SceneCharacterId: number;
  Character: Character;
  Position: Position;
  Size: Size;
};

export type SceneItem = {
  SceneItemId: number;
  Item: Item;
  Position: Position;
  Size: Size;
};
export type Dialog = {
  DialogId: number;
  Character: Character;
  Text: string;
};
export type Scene = {
  SceneId: number;
  BackgroundImage: Image;
  SceneName: string;
  SceneCharacters: SceneCharacter[];
  SceneItems: SceneItem[];
  SceneDialogs: Dialog[];
};

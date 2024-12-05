import { Inventory } from "../components/Inventory/Inventory";
import { QuestContainer } from "../components/QuestContainer";
import "./GameTest.css";
export const GameTest = () => {
  return (
    <div className="test__container">
      <Inventory />
      <QuestContainer />
    </div>
  );
};

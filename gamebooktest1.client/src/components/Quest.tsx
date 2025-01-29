import "./Quest.css";

type QuestProps = {
  heading: string;
  content: string;
};

export const QuestComponent = ({ heading, content }: QuestProps) => {
  return (
    <div className="quest__body" >
      <h2 className="quest__heading">{heading}</h2>
      <p className="quest__content">{content}</p>
    </div>
  );
};

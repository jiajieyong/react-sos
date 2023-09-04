import { useEffect, useState } from "react";
import "./App.css";
interface ICard {
  id: number;
  title: {
    en: string;
  };
  body:
    | {
        en: string;
      }
    | undefined;
  link_title: string;
  link: string;
  text: string;
}

interface IProps {
  title: string;
  text: string;
  target: string;
  linkTitle: string;
  href: string;
  linkClassName: string;
}

const Card = ({
  title,
  text,
  target,
  linkTitle,
  href,
  linkClassName,
}: IProps) => {
  return (
    <div className="my-8">
      <div>{title}</div>
      <div>{text}</div>
      <a
        className={`${linkClassName}`}
        target={target}
        rel="external"
        href={href}
      >
        {linkTitle}
      </a>
    </div>
  );
};

function App() {
  const [cards, setCards] = useState<ICard[]>([]);

  useEffect(() => {
    const getData = async () => {
      const response = await fetch("https://sbl.alwaysdata.net/api/posts");

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data: ICard[] = await response.json();
      return data;
    };

    getData().then((cards) => {
      cards.forEach((card) => {
        Object.entries(card).forEach(([key]) => {
          if (key === "body" && card["body"]) {
            card.text = card["body"].en.slice(0, 50) + "...";
          }
        });
      });

      setCards(cards);
    });
  }, []);

  return (
    <div>
      {cards.map((item: ICard, index) => {
        return (
          <Card
            key={index}
            title={item.title.en}
            linkTitle={item.link_title}
            href={item.link}
            text={item.text}
            linkClassName={index === 0 ? "text-green-500" : ""}
            target={index === 0 ? "_blank" : ""}
          />
        );
      })}
    </div>
  );
}

export default App;

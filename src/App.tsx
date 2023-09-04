import { useEffect, useState } from "react";
import "./App.css";

//To take advantage of typescript type assertion, ICard interface for the incoming data object and
//IProps interface for Card component are introduced. This helps to get a better understanding of the type of properties
//received and passed around for manipulation, i.e line 70 -74
interface ICard {
  id: number;
  title: {
    en: string;
  };
  body: {
    en: string;
  } | null;
  link_title: string;
  link: string;
  text: string;
}

//rel is not part of the props since there is currently no logic or data to determine the rel
//hardcoded to external value for now until further information is given
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

  //Throw an error if the response is not 200
  useEffect(() => {
    const getData = async () => {
      const response = await fetch("https://sbl.alwaysdata.net/api/posts");

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data: ICard[] = await response.json();
      return data;
    };

    //Refactored results to cards since that is the state that will be set
    //Since the primary objective of this setCards seem to be truncating the card text length to 50,
    //The redundant chunk of the code has been removed
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
    //The first card have the link colored green and the target set to _blank
    //Using the index is a much safer option, since id can be arbitary, it can be a string, a chain of number .etc
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

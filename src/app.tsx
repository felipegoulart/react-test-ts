import { useCallback, useEffect, useState } from "react";
import { Card } from "./components/card";
import { shuffleArray } from "./utils/shuffle";

type PetCardProps = {
  id: string;
  card: string;
  sticker: string;
  cardSticker: string;
  flipped: boolean;
};

export function App() {
  const [petCards, setPetCards] = useState<PetCardProps[]>([]);

  const handleCardClick = (id: string) => {
    const updatedCards = petCards.map((card) => {
      if (card.id === id) {
        return { ...card, flipped: !card.flipped };
      }

      return card;
    });

    setPetCards(updatedCards);
  };

  const fetchPetCards = useCallback(async () => {
    const response = await fetch(`http://localhost:3333/cards`);
    const data = await response.json();
    setPetCards(shuffleArray(data));
  }, []);

  useEffect(() => {
    fetchPetCards();
  }, [fetchPetCards]);

  return (
    <div className="w-full h-svh flex flex-wrap items-start gap-10 pt-10">
      <div className="w-full flex items-center justify-center h-fit">
        <h1 className="text-6xl font-bold text-primary">
          Petland
          <span className="text-zinc-400 font-normal text-5xl"> Front-end</span>
        </h1>
      </div>
      <div className="w-full flex items-start justify-center flex-1 h-screen px-4">
        <div className="w-[900px] min-w-[900px] flex flex-wrap justify-center gap-1">
          {petCards.map((petCard, key) => (
            <Card
              id={petCard.id}
              imagePath={`img/cards/${petCard.cardSticker}.png`}
              onClick={handleCardClick}
              key={key}
              isFlipped={petCard.flipped}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

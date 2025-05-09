import { useEffect, useState } from "react";
import { Card, OnClickParams } from "./card";
import type { PetCardProps } from "../types/petCard";

type CardListProps = {
  cardList: PetCardProps[];
  setPetCards: (cards: PetCardProps[]) => void;
  updateAttempts: () => void;
};

export function CardList({
  updateAttempts,
  setPetCards,
  cardList,
}: CardListProps) {
  const [cards, setCards] = useState<PetCardProps[]>(cardList);
  const [canClick, setCanClick] = useState(true);
  const [flippedCards, setFlippedCards] = useState<PetCardProps[]>([]);

  useEffect(() => {
    setCards(cardList);
  }, [cardList]);

  const handleCardClick = ({ id, isMatched, flipped }: OnClickParams) => {
    const currentCardIndex = cards.findIndex((card) => card.id === id);
    const currentCard = cards[currentCardIndex];

    if (isMatched || !canClick) {
      return;
    }

    const updatedPetCards = Array.from(cards);
    updatedPetCards[currentCardIndex].flipped = !flipped;
    setPetCards(updatedPetCards);

    const updatedFlippedCards = flippedCards.filter((card) => card.id !== id);

    if (!flipped) {
      updatedFlippedCards.push(currentCard);
    }

    setFlippedCards(updatedFlippedCards);
  };

  useEffect(() => {
    if (flippedCards.length === 2) {
      setCanClick(false);

      const [firstCard, secondCard] = flippedCards;
      const isMatch = firstCard.pairId === secondCard.pairId;
      const updatedPetCards = cards.map((card) => {
        if (card.id === firstCard.id || card.id === secondCard.id) {
          return {
            ...card,
            flipped: isMatch,
            isMatched: isMatch,
          };
        }
        return card;
      });

      setFlippedCards([]);
      setTimeout(
        () => {
          setPetCards(updatedPetCards);
          setCanClick(true);
          updateAttempts();
        },
        isMatch ? 0 : 1000
      );
    }
  }, [cards, flippedCards, updateAttempts, setPetCards]);

  return (
    <div className="w-full flex justify-center px-4 pb-8">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-4 max-w-[116rem] w-full">
        {cards.map((petCard, key) => (
          <div className="flex justify-center w-full">
            <Card
              id={petCard.id}
              sticker={petCard.sticker}
              pairId={petCard.pairId}
              onClick={handleCardClick}
              key={key}
              flipped={petCard.flipped}
              isMatched={petCard.isMatched}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export type PetCardResponse = {
  id: string;
  pairId: string;
  card: string;
  sticker: string;
  cardSticker: string;
};

export type PetCardProps = PetCardResponse & {
  flipped: boolean;
  isMatched: boolean;
};

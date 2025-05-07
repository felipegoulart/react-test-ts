type CardProps = {
  id: string;
  imagePath: string;
  onClick: (id: string) => void;
  isFlipped: boolean;
};

export function Card({ id, imagePath, isFlipped, onClick }: CardProps) {
  return (
    <div onClick={() => onClick(id)}>
      <img
        src={isFlipped ? "img/cards/back-card-logo.png" : imagePath}
        alt="Card"
        className="w-full flex-1 object-contain hover:scale-105 transition-transform duration-300 ease-in-out"
      />
    </div>
  );
}

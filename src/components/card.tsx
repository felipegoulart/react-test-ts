import { useEffect, useState } from "react";
import { cn } from "../utils/cn";

export type OnClickParams = {
  id: string;
  pairId: string;
  flipped: boolean;
  isMatched: boolean;
};

type CardProps = {
  id: string;
  sticker: string;
  pairId: string;
  flipped: boolean;
  isMatched: boolean;
  onClick: (attrs: OnClickParams) => void;
};

export function Card({
  id,
  sticker,
  pairId,
  flipped,
  isMatched,
  onClick,
}: CardProps) {
  const [wasFlipped, setWasFlipped] = useState(flipped);
  const imagePath = `img/stickers/${sticker}.png`;

  useEffect(() => {
    setTimeout(() => {
      setWasFlipped(flipped);
    }, 100);
  }, [flipped]);

  return (
    <div
      onClick={() => onClick({ id, flipped, isMatched, pairId })}
      className={cn(
        "w-[200px] h-[200px] rounded-lg overflow-clip transition duration-300 ease-in-out transform shadow-md",
        !isMatched &&
          "hover:shadow-xl hover:scale-105 hover:rotate-3 hover:z-10 cursor-pointer",
        flipped ? "rotate-y-180" : "rotate-y-0"
      )}
    >
      {wasFlipped ? (
        <div
          className={cn(
            "flex items-center justify-center h-full w-full",
            isMatched
              ? "transition-colors duration-300 ease-in-out bg-green-200"
              : "bg-indigo-100"
          )}
        >
          <img
            src={imagePath}
            alt="Card"
            className="w-20 object-contain drop-shadow-2xl select-none"
          />
        </div>
      ) : (
        <div className="flex items-center justify-center h-full w-full bg-orange-200">
          <img
            src="img/logo.png"
            alt="Card"
            className="w-20 object-contain select-none"
          />
        </div>
      )}
    </div>
  );
}

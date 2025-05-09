import { formatTime } from "../utils/time";
import { Button } from "./button";
import { Panel } from "./panel";

type HeaderProps = {
  attempts: number;
  matchedCards: number;
  remainingCards: number;
  seconds: number;
  isGameStarted: boolean;
  onStartButtonClick: () => void;
  onRestartButtonClick: () => void;
  onHistoryButtonClick: () => void;
};

export function Header({
  attempts,
  matchedCards,
  remainingCards,
  seconds,
  isGameStarted,
  onHistoryButtonClick,
  onRestartButtonClick,
  onStartButtonClick,
}: HeaderProps) {
  return (
    <header className="w-full flex flex-col items-center justify-center h-fit gap-10 px-8">
      <div className="flex flex-wrap justify-center items-end">
        <h1 className="text-h1 text-primary">Petland</h1>
        <span className="text-zinc-400 font-normal text-5xl">Front-end</span>
      </div>

      <div className="flex flex-col items-center justify-center gap-10">
        <div className="w-full flex flex-wrap sm:flex-nowrap items-center justify-center gap-2 md:gap-4">
          <Panel
            title="Tentativas"
            value={attempts.toString().padStart(2, "0")}
          />
          <Panel
            title="Pares feitos"
            value={matchedCards.toString().padStart(2, "0")}
          />
          <Panel
            title="Pares restantes"
            value={remainingCards.toString().padStart(2, "0")}
          />
          <Panel title="Tempo decorrido" value={formatTime(seconds)} />
        </div>

        <div className="w-full flex flex-wrap sm:flex-nowrap items-center justify-center gap-2 md:gap-4">
          <Button
            variant="primary"
            onClick={onStartButtonClick}
            disabled={isGameStarted}
          >
            Começar
          </Button>
          <Button
            variant="secondary"
            disabled={!isGameStarted}
            onClick={onRestartButtonClick}
          >
            Reiniciar
          </Button>
          <Button variant="secondary" onClick={onHistoryButtonClick}>
            Histórico
          </Button>
        </div>
      </div>
    </header>
  );
}

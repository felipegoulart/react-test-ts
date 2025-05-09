import { Panel } from "./components/panel";
import { formatTime } from "./utils/time";
import { CardList } from "./components/cardList";
import { useEffect, useRef, useState } from "react";
import { shuffleArray } from "./utils/shuffle";
import { PetCardProps, PetCardResponse } from "./types/petCard";
import { Modal } from "./components/modal";
import { Button } from "./components/button";
import {
  getFromLocalStorage,
  removeFromLocalStorage,
  saveToLocalStorage,
} from "./utils/store";

type GameType = {
  id: number;
  attempts: number;
  seconds: number;
  matchedCards: number;
  remainingCards: number;
  petCards: PetCardProps[];
};

export function App() {
  const [id, setId] = useState(Date.now());
  const [petCards, setPetCards] = useState<PetCardProps[]>([]);
  const [numberOfPairs, setNumberOfPairs] = useState(1);
  const [attempts, setAttempts] = useState(0);
  const [remainingCards, setRemainingPairCards] = useState(0);
  const [matchedCards, setMatchedCards] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [startTimer, setStartTimer] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showStartGameModal, setShowStartGameModal] = useState(false);
  const [isRestartModal, setIsRestartModal] = useState(false);
  const [showOldGameModal, setShowOldGameModal] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [oldGame, setOldGame] = useState<GameType | null>(null);

  const initializedRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const storedGame = getFromLocalStorage<GameType>("currentGame");

    if (storedGame) {
      setOldGame(storedGame);
      setShowOldGameModal(true);
    }
  }, []);

  useEffect(() => {
    if (startTimer) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [startTimer]);

  const fetchPetCards = async () => {
    const response = await fetch(
      `http://localhost:3333/cards?_limit=${numberOfPairs}`
    );
    const data: PetCardResponse[] = await response.json();
    const duplicated = data.flatMap((item) => [
      {
        ...item,
        id: `${item.id}-a`,
        pairId: item.id,
        flipped: false,
        isMatched: false,
      },
      {
        ...item,
        id: `${item.id}-b`,
        pairId: item.id,
        flipped: false,
        isMatched: false,
      },
    ]);

    setPetCards(shuffleArray(duplicated));
    setRemainingPairCards(duplicated.length / 2);
  };

  const showHistory = () => {
    setShowHistoryModal(true);
  };

  const showRestartModal = () => {
    if (!isGameStarted) return;

    setIsRestartModal(true);
    setShowStartGameModal(true);
  };

  const startGame = async () => {
    await fetchPetCards();

    setAttempts(0);
    setSeconds(0);
    setStartTimer(true);
    setIsGameStarted(true);
    setIsGameFinished(false);
    setShowStartGameModal(false);
  };

  const continueGame = async (continueGame: boolean) => {
    if (!continueGame) {
      setShowOldGameModal(false);
      setOldGame(null);
      removeFromLocalStorage("currentGame");
      return;
    }

    if (oldGame) {
      setId(oldGame.id);
      setAttempts(oldGame.attempts);
      setSeconds(oldGame.seconds);
      setMatchedCards(oldGame.matchedCards);
      setRemainingPairCards(oldGame.remainingCards);
      setPetCards(oldGame.petCards);
      setStartTimer(true);
      setIsGameStarted(true);

      setShowOldGameModal(false);
    }
  };

  useEffect(() => {
    saveToLocalStorage<GameType>("currentGame", {
      id,
      attempts,
      seconds,
      matchedCards,
      remainingCards,
      petCards,
    });
  }, [id, attempts, seconds, matchedCards, remainingCards, petCards]);

  useEffect(() => {
    if (petCards.length > 0) {
      const matched = petCards.filter((card) => card.isMatched).length / 2;
      const remaining = petCards.length / 2 - matched;

      setMatchedCards(matched);
      setRemainingPairCards(remaining);

      if (matched === petCards.length / 2) {
        setStartTimer(false);

        const history = getFromLocalStorage<GameType[]>("history");
        saveToLocalStorage("history", [
          ...(history || []),
          {
            id,
            attempts,
            seconds,
            matchedCards: matched,
            remainingCards: remaining,
            petCards,
          },
        ]);

        if (!isGameFinished) alert("Você ganhou!");
        removeFromLocalStorage("currentGame");
        setIsGameFinished(true);
      }
    }
  }, [petCards, attempts, seconds, id, isGameFinished]);

  return (
    <>
      <div className="w-full min-h-screen flex flex-col justify-start gap-10 pt-10 bg-zinc-50">
        <header className="w-full flex flex-col items-center justify-center h-fit gap-10">
          <div className="flex items-end">
            <h1 className="text-h1 text-primary">Petland</h1>
            <span className="text-zinc-400 font-normal text-5xl">
              Front-end
            </span>
          </div>

          <div className="flex flex-col items-center justify-center gap-10">
            <div className="w-full flex items-center justify-center gap-4">
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

            <div className="w-full flex items-center justify-center gap-4">
              <Button
                variant="primary"
                onClick={() => setShowStartGameModal(true)}
              >
                Começar
              </Button>
              <Button
                variant="secondary"
                disabled={!isGameStarted}
                onClick={() => showRestartModal()}
              >
                Reiniciar
              </Button>
              <Button variant="secondary" onClick={showHistory}>
                Histórico
              </Button>
            </div>
          </div>
        </header>

        {petCards.length ? (
          <CardList
            cardList={petCards}
            setPetCards={setPetCards}
            updateAttempts={() => setAttempts((prev) => prev + 1)}
          ></CardList>
        ) : (
          <div className="w-full flex flex-col items-center justify-center gap-10">
            <h2 className="text-h2 text-primary">
              Clique em Começar para jogar
            </h2>

            <img
              src="img/stickers/bruce-03.png"
              alt="Logo"
              className="w-40 object-contain select-none"
            />
          </div>
        )}
      </div>

      <Modal
        isOpen={showHistoryModal}
        title="Histórico"
        onClose={() => setShowHistoryModal(false)}
      >
        <div className="w-full flex flex-col items-center justify-center gap-2">
          <p className="text-body">Seus jogos anteriores</p>

          <div className="w-full max-h-[50dvh] overflow-y-auto p-4 pl-0">
            <table className="w-full">
              <thead>
                <tr className="h-10 text-slate-50 bg-slate-800">
                  <th className="px-2 text-start">Data</th>
                  <th className="px-2 text-start">Jogo</th>
                  <th className="px-2 text-start">Pares</th>
                  <th className="px-2 text-start">Tentativas</th>
                  <th className="px-2 text-start">Tempo</th>
                </tr>
              </thead>

              <tbody>
                {getFromLocalStorage<GameType[]>("history")?.map(
                  (game, index) => (
                    <tr
                      key={index}
                      className="w-full text-slate-700 h-10 odd:bg-slate-100 even:bg-slate-50"
                    >
                      <td className="px-2 text-start">
                        {Intl.DateTimeFormat("pt-BR", {
                          dateStyle: "short",
                        }).format(new Date(game.id))}
                      </td>
                      <td className="px-2 text-start">{index + 1}</td>
                      <td className="px-2 text-start">
                        {game.petCards.length / 2}
                      </td>
                      <td className="px-2 text-start">{game.attempts}</td>
                      <td className="px-2 text-start">
                        {formatTime(game.seconds)}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showStartGameModal}
        title={isRestartModal ? "Reiniciar Jogo" : "Iniciar Jogo"}
        onClose={() => setShowStartGameModal(false)}
      >
        <div className="flex flex-col items-center justify-center gap-4">
          {isRestartModal && (
            <p>O jogo começará e seu progresso será perdido.</p>
          )}

          <div className="flex items-center justify-center gap-4">
            <label className="text-body text-slate-500">
              Escolha a quantidade de cartas para jogar
            </label>
            <select
              value={numberOfPairs}
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                setNumberOfPairs(parseInt(event.target.value))
              }
              className="border border-slate-300 rounded-lg p-2 px-4 outline-0 active:border-primary"
            >
              {Array.from({ length: 16 }, (_, i) => i + 1).map(
                (value, index) => (
                  <option value={value} key={index}>
                    {value * 2} cartas
                  </option>
                )
              )}
            </select>
          </div>
          <button
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-orange-700 shadow-md hover:shadow-lg transition duration-300 ease-in-out cursor-pointer hover:scale-105"
            onClick={startGame}
          >
            {isRestartModal ? "Reiniciar" : "Iniciar"}
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={showOldGameModal}
        title="Jogo em andamento"
        onClose={() => continueGame(false)}
      >
        <div className="flex flex-col items-center justify-center gap-4">
          <p>
            Você possuí um jogo em andamento. Deseja continuar de onde parou?
          </p>

          <div className="flex items-center justify-center gap-4">
            <Button variant="secondary" onClick={() => continueGame(false)}>
              Não continuar
            </Button>

            <Button variant="primary" onClick={() => continueGame(true)}>
              Continuar
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

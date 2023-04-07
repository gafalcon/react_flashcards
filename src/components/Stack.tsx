import { useEffect, useState } from "react";
import { Card } from "../models/Card";
import { getRandomInt } from "../utils/fns";
import { useKeyDown } from "../utils/useKeyDown";
import Button from "./Button";

interface StackProps {
  cards: Card[];
}

type Action = "correct" | "incorrect" | "skip" | "show";

export const Stack = ({ cards }: StackProps) => {
  const [numReviews, setNumReviews] = useState<number>(5);
  const [incompleteCards, setIncompleteCards] = useState<Card[]>([]);
  const [numCardsToReview, setNumCardsToReview] = useState<number>(0);
  const [cardsToReview, setCardsToReview] = useState<Card[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    if (cards?.length) {
      const incompleteCards = cards.filter(
        (card) => card.correct_attempts < numReviews
      );
      setIncompleteCards(incompleteCards);
    }
  }, [cards]);

  useEffect(() => {
    if (
      numCardsToReview &&
      incompleteCards.length &&
      incompleteCards.length !== numCardsToReview
    ) {
      const numbers = Array(incompleteCards.length)
        .fill(0)
        .map((_, index) => index + 1);
      numbers.sort(() => Math.random() - 0.5);
      setCardsToReview(
        numbers.slice(0, numCardsToReview).map((i) => incompleteCards[i])
      );
    } else {
      setCardsToReview(incompleteCards);
    }
  }, [incompleteCards, numCardsToReview]);

  useEffect(() => {
    if (cardsToReview.length) {
      setCurrentCardIndex(getRandomInt(cardsToReview.length));
      setNumCardsToReview(cardsToReview.length);
    }
  }, [cardsToReview]);

  const handleKeyDown = (e: string) => {
    switch (e) {
      case "ArrowDown":
        handleAction("skip");
        break;
      case "ArrowUp":
        handleAction("show");
        break;
      case "ArrowLeft":
        handleAction("incorrect");
        break;
      case "ArrowRight":
        handleAction("correct");
      default:
        break;
    }
  };
  useKeyDown(handleKeyDown, [
    "ArrowDown",
    "ArrowLeft",
    "ArrowUp",
    "ArrowRight",
  ]);
  const handleAction = (action: Action) => {
    if (action !== "show") setShowAnswer(false);

    switch (action) {
      case "show":
        setShowAnswer(!showAnswer);
        break;
      case "skip":
        setCurrentCardIndex(getRandomInt(cardsToReview.length));
        break;
      case "correct":
        const currentCard = cardsToReview[currentCardIndex!];
        currentCard.correct_attempts++;
        if (currentCard.correct_attempts === numReviews) {
          const updated = cardsToReview
            .slice(0, currentCardIndex!)
            .concat(cardsToReview.slice(currentCardIndex! + 1));
          setCardsToReview(updated);
        } else {
          setCurrentCardIndex(getRandomInt(cardsToReview.length));
        }
        break;
      case "incorrect":
        cardsToReview[currentCardIndex!].incorrect_attempts++;
        setCurrentCardIndex(getRandomInt(cardsToReview.length));
        break;
      default:
        break;
    }
  };

  const card =
    currentCardIndex === null ? null : cardsToReview[currentCardIndex];

  return (
    <>
      <h1 className="text-3xl">
        Cards: {cards.length}, Incomplete: {incompleteCards.length}, to Review:{" "}
        {cardsToReview.length}
      </h1>

      <section className="grid grid-cols-2">
        <label htmlFor="numCards" className="flex items-center justify-center">
          How many cards to review?
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          name="numCards"
          type="number"
          value={numCardsToReview}
          onChange={(e) =>
            e.target.value ? setNumCardsToReview(parseInt(e.target.value)) : 0
          }
        />
        <label
          htmlFor="numReviews"
          className="flex justify-center items-center"
        >
          How many times to review each card?
        </label>
        <input
          name="numReviews"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="number"
          value={numReviews}
          onChange={(e) =>
            e.target.value ? setNumReviews(parseInt(e.target.value)) : 0
          }
        />
      </section>

      <p>Index: {currentCardIndex}</p>
      {card && (
        <div className="mt-20 flex flex-col items-center">
          <div className="text-4xl py-20 rounded overflow-hidden shadow-lg w-4/5 my-10 h-80 flex items-center justify-center">
            {showAnswer ? card.answer : card.question}
          </div>
          <p>
            Correct: {card.correct_attempts} - Incorrect:{" "}
            {card.incorrect_attempts}
          </p>

          <section className="flex flex-row justify-around mt-10">
            <Button onClick={() => handleAction("incorrect")}>
              Incorrect (left)
            </Button>
            <Button onClick={() => handleAction("show")}>Show (up)</Button>
            <Button onClick={() => handleAction("skip")}>Skip (down)</Button>
            <Button onClick={() => handleAction("correct")}>
              Correct (right)
            </Button>
          </section>
        </div>
      )}
    </>
  );
};

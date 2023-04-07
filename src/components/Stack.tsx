import { useEffect, useState } from "react";
import { Card } from "../models/Card";
import { getRandomInt } from "../utils/fns";
import { useKeyDown } from "../utils/useKeyDown";

interface StackProps {
  cards: Card[];
}

type Action = "correct" | "incorrect" | "skip" | "show";

export const Stack = ({ cards }: StackProps) => {
  const [numReviews, setNumReviews] = useState<number>(5);
  const [cardsToReview, setCardsToReview] = useState<Card[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    if (cards?.length) {
      setCardsToReview(
        cards.filter((card) => card.correct_attempts < numReviews)
      );
    }
  }, [cards]);

  useEffect(() => {
    if (cardsToReview.length) {
      setCurrentCardIndex(getRandomInt(cardsToReview.length));
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
      <h1>
        Cards: {cards.length}, to Review: {cardsToReview.length}
      </h1>

      <label htmlFor="numReviews">How many times to review each card?</label>
      <input
        name="numReviews"
        type="number"
        value={numReviews}
        onChange={(e) =>
          e.target.value ? setNumReviews(parseInt(e.target.value)) : 0
        }
      />

      {card && (
        <div>
          <h2>{showAnswer ? card.answer : card.question}</h2>
          <p>
            Correct: {card.correct_attempts} - Incorrect:{" "}
            {card.incorrect_attempts}
          </p>
          <button onClick={() => handleAction("incorrect")}>
            Incorrect (left)
          </button>
          <button onClick={() => handleAction("show")}>Show (up)</button>
          <button onClick={() => handleAction("skip")}>Skip (down)</button>
          <button onClick={() => handleAction("correct")}>
            Correct (right)
          </button>
        </div>
      )}
    </>
  );
};

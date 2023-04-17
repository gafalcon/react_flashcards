import React, { useMemo, useState } from "react";
import { Card } from "../models/Card";
import { answerCard } from "../services/api";
import { getRandomInt } from "../utils/fns";
import { useKeyDown } from "../utils/useKeyDown";
import Button from "./Button";

interface StackProps {
  cards: Card[];
}

type Action = "correct" | "incorrect" | "skip" | "show";

export const Stack = ({ cards }: StackProps) => {
  const [numReviews, setNumReviews] = useState<number>(5);
  const [numCardsToReview, setNumCardsToReview] = useState<number>(
    cards.length
  );

  const [currentCardIndex, setCurrentCardIndex] = useState<number | null>(
    cards.length ? getRandomInt(cards.length) : null
  );
  const [showAnswer, setShowAnswer] = useState(false);
  const [updateAnswer, setUpdateAnswer] = useState(false);

  const getIncompleteCards = () =>
    cards.filter((card) => card.correct_attempts < numReviews);

  const getCardsToReview = (incompleteCards: Card[]) => {
    const numbers = Array(incompleteCards.length)
      .fill(0)
      .map((_, index) => index + 1);
    numbers.sort(() => Math.random() - 0.5);
    return numbers.slice(0, numCardsToReview).map((i) => incompleteCards[i]);
  };

  const incompleteCards = useMemo(getIncompleteCards, [cards]);

  const cardsToReview = useMemo(
    () => getCardsToReview(incompleteCards),
    [incompleteCards, numCardsToReview]
  );

  const card =
    currentCardIndex === null ? null : cardsToReview[currentCardIndex];

  const updateNumCardsToReview: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    if (e.target.value) {
      setNumCardsToReview(parseInt(e.target.value));
      setCurrentCardIndex(0);
    } else {
      setNumCardsToReview(0);
      setCurrentCardIndex(null);
    }
  };

  const updateNumReviews: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.value) {
      setNumReviews(parseInt(e.target.value));
    } else {
      setNumReviews(0);
    }
  };

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

  const updateAnswerInDB = (cardId: string, is_correct: boolean) => {
    if (updateAnswer) {
      answerCard(cardId, is_correct).then((res) => {
        console.log({ resAnswer: res });
      });
    }
  };
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
        updateAnswerInDB(currentCard.id, true);
        if (currentCard.correct_attempts === numReviews) {
          setCurrentCardIndex(getRandomInt(cardsToReview.length - 1));
        } else {
          setCurrentCardIndex(getRandomInt(cardsToReview.length));
        }
        break;
      case "incorrect":
        const curCard = cardsToReview[currentCardIndex!];
        curCard.incorrect_attempts++;
        updateAnswerInDB(curCard.id, false);
        setCurrentCardIndex(getRandomInt(cardsToReview.length));
        break;
      default:
        break;
    }
  };

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
          onChange={updateNumCardsToReview}
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
          onChange={updateNumReviews}
        />
        <div>
          <label htmlFor="updateAnswers">Update answers in db</label>
          <input
            className="ml-2"
            name="updateAnswer"
            type="checkbox"
            checked={updateAnswer}
            onChange={() => setUpdateAnswer((answer) => !answer)}
          />
        </div>
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

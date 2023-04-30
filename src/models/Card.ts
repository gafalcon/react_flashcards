export interface Card {
  id: string;
  group: string;
  question: string;
  answer: string;
  two_way: boolean;
  incorrect_attempts: number;
  correct_attempts: number;
  incorrect_attempts_two_way: number;
  correct_attempts_two_way: number;
  complete: boolean;
}

export interface OneWayCard {
  id: string;
  group: string;
  question: string;
  answer: string;
  correct_attempts: number;
  incorrect_attempts: number;

  isFront: boolean;
}

export const toOneWay = (
  {
    id,
    group,
    question,
    answer,
    correct_attempts,
    incorrect_attempts,
    correct_attempts_two_way,
    incorrect_attempts_two_way,
  }: Card,
  isFront: boolean
) => {
  const oneWayCard: OneWayCard = {
    id,
    group,
    question,
    answer,
    correct_attempts,
    incorrect_attempts,
    isFront,
  };

  if (!isFront) {
    oneWayCard.question = answer;
    oneWayCard.answer = question;
    oneWayCard.correct_attempts = correct_attempts_two_way || 0;
    oneWayCard.incorrect_attempts = incorrect_attempts_two_way || 0;
  }

  return oneWayCard;
};

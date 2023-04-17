import { Card } from "../models/Card";

const API_URL = "https://k5ybquegf8.execute-api.us-east-1.amazonaws.com/prod";

export const getCards = async (): Promise<Card[]> => {
  const res = await fetch(`${API_URL}/flashcards`);
  const data = await res.json();
  return data.data;
};

export const answerCard = async (cardId: string, isCorrect: boolean) => {
  const res = await fetch(`${API_URL}/flashcards/${cardId}/answer`, {
    method: "PATCH",
    body: JSON.stringify({ is_correct: isCorrect }),
  });
  const data = await res.json();
  return data;
};

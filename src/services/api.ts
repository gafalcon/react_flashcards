import { Card } from "../models/Card";

const API_URL = "https://k5ybquegf8.execute-api.us-east-1.amazonaws.com/prod";

export const getCards = async (): Promise<Card[]> => {
  const res = await fetch(`${API_URL}/flashcards`);
  const data = await res.json();
  return data.data;
};

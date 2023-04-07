export interface Card {
  id: string;
  group: string;
  question: string;
  answer: string;
  two_way: boolean;
  incorrect_attempts: number;
  correct_attempts: number;
  complete: boolean;
}

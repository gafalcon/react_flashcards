import { useEffect, useState } from "react";
import "./App.css";
import { Stack } from "./components/Stack";
import { Card } from "./models/Card";
import { getCards } from "./services/api";

function App() {
  const [cards, setCards] = useState<Card[]>([]);

  useEffect(() => {
    getCards().then((cards) => {
      setCards(cards);
    });
  }, []);
  return (
    <div className="container mx-auto h-screen">
      {cards.length ? <Stack cards={cards} /> : <h1>Loading Cards....</h1>}
    </div>
  );
}

export default App;

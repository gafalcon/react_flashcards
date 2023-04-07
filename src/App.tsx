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
    <div className="App">
      <Stack cards={cards} />
    </div>
  );
}

export default App;

import { GameProvider } from "./contexts/GameContext";
import Computer from "./components/Computer";
import './App.css'


function App() {

  return (
    <GameProvider>
      <Computer />
    </GameProvider>
  )
}

export default App
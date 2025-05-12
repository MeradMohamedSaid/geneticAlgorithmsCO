import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TspGa from "./Pages/TspGa";
import Sudoku from "./Pages/Sudoko";
import Home from "./Pages/Home";
import TspGa2 from "./Pages/TspGA2";
function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sudoku" element={<Sudoku />} />
        <Route path="/TspGA" element={<TspGa2 />} />
      </Routes>
    </Router>
  );
}

export default App;

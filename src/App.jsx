import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Sudoku from "./Pages/Sudoko";
import Home from "./Pages/Home";

import TpGATest from "./Pages/TpGATest";
function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sudoku" element={<Sudoku />} />
        <Route path="/TspGA" element={<TpGATest />} />
      </Routes>
    </Router>
  );
}

export default App;

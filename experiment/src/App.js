import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import H from "./Components/h";

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<H/>}/>
      </Routes>
    </Router>
    </>
  );
}

export default App;


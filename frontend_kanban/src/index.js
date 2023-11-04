import React from "react";
import ReactDOM from "react-dom/client";
import Board from "./components/Board";

function App() {
  return (
    <div>
      {/* <h1>Hello, world!</h1>
      <h2>It is {new Date().toLocaleTimeString()}.</h2> */}
      <Board />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

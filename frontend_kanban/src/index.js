import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Header from "./components/Header";
import Board from "./components/Board";
import Register from "./components/Register";
import Login from "./components/Login";
import { Toaster } from "react-hot-toast";
import "./css/index.css";

function getToken() {
  const tokenString = localStorage.getItem("token");
  const userToken = JSON.parse(tokenString);
  return userToken;
}

function App() {
  const [token, setToken] = useState(() => getToken());

  return (
    <Router>
      <Header />
      <Routes>
        <Route
          exact
          path="/"
          element={
            <>{!token ? <Navigate to="/login" /> : <Board token={token} />}</>
          }
        ></Route>

        <Route
          exact
          path="/register"
          element={<Register setToken={setToken} />}
        ></Route>
        <Route
          exact
          path="/login"
          element={<Login setToken={setToken} />}
        ></Route>
      </Routes>
      <Toaster />
    </Router>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

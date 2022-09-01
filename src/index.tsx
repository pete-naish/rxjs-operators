import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { of } from "rxjs";

import { myMap } from "./MyObservable";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

of(1, 2, 3, 4, 5)
  .pipe(myMap((x: number) => x * 2))
  .subscribe(console.log);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

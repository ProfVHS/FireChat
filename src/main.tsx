import React from "react";
import ReactDOM from "react-dom/client";

import "./App.scss";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Auth } from "./Pages/Auth/Auth.tsx";
import { Chats } from "./Pages/Chats/Chats.tsx";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const app = initializeApp({
  apiKey: "AIzaSyCFvBIf77XAWJ62519wiJeM3mgpHy-mgdg",
  authDomain: "firechat-247e4.firebaseapp.com",
  projectId: "firechat-247e4",
  storageBucket: "firechat-247e4.appspot.com",
  messagingSenderId: "669122054209",
  appId: "1:669122054209:web:f83d2afff07b1f1bc15ec0",
  measurementId: "G-GYM194TN7H",
});

export const auth = getAuth(app);
export const firestore = getFirestore(app);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Auth />,
  },
  {
    path: "/chats",
    element: <Chats />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

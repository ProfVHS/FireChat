import { useState } from "react";
import { SendIcon } from "../Svgs";
import { addDoc, collection } from "firebase/firestore";
import { auth, firestore } from "../../App";
import { user } from "../../Pages/Chats/type";

import "./style.scss";

interface SendMessageProps {
  chatWith?: user;
}

const sendMessage = async (message: string, chatWith: user) => {
  await addDoc(collection(firestore, "messages"), {
    message,
    createdAt: new Date(),
    name: auth.currentUser?.displayName,
    avatar: auth.currentUser?.photoURL,
    uid: auth.currentUser?.uid,
    sentTo: chatWith,
  });
};

export const SendMessage = ({ chatWith }: SendMessageProps) => {
  const [message, setMessage] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    console.log(chatWith);
    e.preventDefault();
    if (message.trim() === "") return;
    sendMessage(message, chatWith!);
    setMessage("");
  };
  return (
    <form className="sendMessage" onSubmit={handleSubmit}>
      <input placeholder="Aa" value={message} onChange={(e) => setMessage(e.target.value)} />
      <button className="sendMessage__button">
        <SendIcon />
      </button>
    </form>
  );
};

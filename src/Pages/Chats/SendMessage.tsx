import { useState } from "react";
import { SendIcon } from "../../components/Svgs";
import { addDoc, collection } from "firebase/firestore";
import { auth, firestore } from "../../App";
import { user } from "./type";

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
    e.preventDefault();
    if (message.trim() === "") return;
    sendMessage(message, chatWith!);
    setMessage("");
  };
  return (
    <form className="chats__send-message" onSubmit={handleSubmit}>
      <input placeholder="Aa" value={message} onChange={(e) => setMessage(e.target.value)} />
      <button className="chats__send-message__button">
        <SendIcon />
      </button>
    </form>
  );
};

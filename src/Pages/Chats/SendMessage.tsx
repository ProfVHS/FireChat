import { useState } from "react";
import { SendIcon } from "../../components/Svgs";
import { addDoc, collection } from "firebase/firestore";
import { auth, firestore } from "../../main";
import { user } from "./type";

interface SendMessageProps {
  chatWith?: user;
}

export const SendMessage = ({ chatWith }: SendMessageProps) => {
  const [message, setMessage] = useState<string>("");

  const sendMessage = async () => {
    await addDoc(collection(firestore, "messages"), {
      message,
      createdAt: new Date(),
      name: auth.currentUser?.displayName,
      avatar: auth.currentUser?.photoURL,
      uid: auth.currentUser?.uid,
      sentTo: chatWith,
    });
  };
  return (
    <div className="chats__send-message">
      <input placeholder="Aa" onChange={(e) => setMessage(e.target.value)} />
      <button className="chats__send-message__button" onClick={sendMessage}>
        <SendIcon />
      </button>
    </div>
  );
};

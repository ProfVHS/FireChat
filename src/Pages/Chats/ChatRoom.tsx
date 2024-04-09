import { collection, limit, onSnapshot, orderBy, query, Timestamp } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { auth, firestore } from "../../App";
import { Message } from "../../components/Message/Message";
import { SendMessage } from "../../components/SendMessage/SendMessage";
import { user } from "./type";

type message = {
  id: string;
  message: string;
  createdAt: Timestamp;
  uid: string;
  avatar: string;
};

interface ChatRoomProps {
  chatWith?: user;
}
export const ChatRoom = ({ chatWith }: ChatRoomProps) => {
  const [messages, setMessages] = useState<message[]>();

  const messagesEndRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (chatWith === undefined) return;
    const q = query(collection(firestore, "messages"), orderBy("createdAt", "desc"), limit(50));

    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      const fetchedMessages: message[] = [];
      QuerySnapshot.forEach((doc: any) => {
        if (doc.data().uid === auth.currentUser?.uid && doc.data().sentTo.uid === chatWith.uid) {
          fetchedMessages.push({ ...doc.data(), id: doc.id });
          return;
        }
        if (doc.data().uid === chatWith.uid && doc.data().sentTo.uid === auth.currentUser?.uid) {
          fetchedMessages.push({ ...doc.data(), id: doc.id });
        }
      });
      const sortedMessages: message[] = fetchedMessages.sort((a: any, b: any) => a.createdAt - b.createdAt);
      setMessages(sortedMessages);
    });

    return () => unsubscribe();
  }, [chatWith]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <div className="chats__messages">
        {messages?.map((message) => (
          <Message key={message.id} message={message.message} uid={message.uid} avatar={message.avatar} />
        ))}
        <span ref={messagesEndRef} />
      </div>
      <SendMessage chatWith={chatWith} />
    </>
  );
};

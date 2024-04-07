import { addDoc, collection, limit, onSnapshot, or, orderBy, Query, query, QuerySnapshot, Timestamp, where } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { auth, firestore } from "../../main";
import { Message } from "./Message";
import { SendMessage } from "./SendMessage";
import { user } from "./type";

type message = {
  id: string;
  message: string;
  createdAt: Timestamp;
  uid: string;
};

interface ChatRoomProps {
  chatWith?: user;
}
export const ChatRoom = ({ chatWith }: ChatRoomProps) => {
  const [messages, setMessages] = useState<message[]>();

  useEffect(() => {
    if (chatWith === undefined) return;
    const q = query(collection(firestore, "messages"), orderBy("createdAt"), limit(50));

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

  console.log(chatWith);
  console.log(messages);
  console.log(auth.currentUser?.uid);

  return (
    <>
      <div className="chats__messages">
        {messages?.map((message) => (
          <Message key={message.id} message={message.message} uid={message.uid} />
        ))}
      </div>
      <SendMessage chatWith={chatWith} />
    </>
  );
};

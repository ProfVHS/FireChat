import { auth } from "../../App";

import DefaultPersonAvatar from "../../assets/profile.png";

interface MessageProps {
  message: string;
  uid: string;
  //   isSender: boolean;
}
export const Message = ({ message, uid }: MessageProps) => {
  return (
    <div className={`chats__message ${uid === auth.currentUser?.uid ? "sent" : "received"}`}>
      <img className={`${uid === auth.currentUser?.uid ? "sender" : "receiver"}`} src={auth.currentUser?.photoURL ? auth.currentUser.photoURL : DefaultPersonAvatar} alt="Profile" />
      <div className={`chats__message-bubble ${uid === auth.currentUser?.uid ? "sent" : "received"}`}>
        <span>{message}</span>
      </div>
    </div>
  );
};

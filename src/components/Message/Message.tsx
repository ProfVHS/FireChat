import { auth } from "../../App";

import "./style.scss";
import DefaultPersonAvatar from "../../assets/profile.png";

interface MessageProps {
  message: string;
  uid: string;
  avatar: string;
  //   isSender: boolean;
}
export const Message = ({ message, uid, avatar }: MessageProps) => {
  return (
    <div className={`message ${uid === auth.currentUser?.uid ? "sent" : "received"}`}>
      <img
        className={`message-userProfile ${uid === auth.currentUser?.uid ? "sender" : "receiver"}`}
        src={auth.currentUser?.uid === uid ? (auth.currentUser?.photoURL ? auth.currentUser?.photoURL : DefaultPersonAvatar) : avatar ? avatar : DefaultPersonAvatar}
        alt="Profile"
      />
      <div className={`message-bubble ${uid === auth.currentUser?.uid ? "sent" : "received"}`}>
        <span>{message}</span>
      </div>
    </div>
  );
};

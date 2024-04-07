import { useEffect, useState } from "react";
import { auth } from "../../main";
import { useNavigate } from "react-router-dom";

import "./style.scss";

import DefaultProfilePhoto from "../../assets/profile.png";
import { EditIcon, FireChatText, FireIcon, SignOutIcon } from "../../components/Svgs";
import { ChatRoom } from "./ChatRoom";
import { Users } from "./Users";
import { user } from "./type";

export const Chats = () => {
  const [chatWith, setChatWith] = useState<user>();

  const navigator = useNavigate();
  useEffect(() => {
    if (auth.currentUser === null) {
      navigator("/");
    }
  }, []);

  const SignOut = async () => {
    await auth.signOut();
    navigator("/");
  };

  return (
    <div className="chats">
      <div className="chats__sidebar">
        <div className="chats__sidebar__header">
          <FireIcon className="chats__sidebar__header-icon" />
          <FireChatText className="chats__sidebar__header-text" />
        </div>
        <div className="chats__sidebar__profile">
          {auth.currentUser?.photoURL ? <img src={auth.currentUser?.photoURL} alt="Profile" /> : <img src={DefaultProfilePhoto} alt="Profile" />}
          <div className="chats__sidebar__profile-name">
            <span className="chats__sidebar__profile-displayname">{auth.currentUser?.displayName}</span>
            <span className="chats__sidebar__profile-email">{auth.currentUser?.email}</span>
          </div>
          <EditIcon className="chats__sidebar__profile-edit" />
          <SignOutIcon className="chats__sidebar__profile-signout" onClick={SignOut} />
        </div>
        <input type="text" className="chats__sidebar__search" placeholder="Search" />
        <Users setChatWith={setChatWith} chatWith={chatWith} />
      </div>
      <div className="chats__content">
        <div className="chats__content__header">{chatWith?.displayName}</div>
        <ChatRoom chatWith={chatWith} />
      </div>
    </div>
  );
};

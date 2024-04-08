import { useEffect, useState } from "react";
import { auth } from "../../App";
import { useNavigate } from "react-router-dom";

import "./style.scss";

import DefaultProfilePhoto from "../../assets/profile.png";
import { EditIcon, FireChatText, FireIcon, SignOutIcon } from "../../components/Svgs";
import { ChatRoom } from "./ChatRoom";
import { Users } from "./Users";
import { user } from "./type";
import { EditModal } from "../../components/EditModal/EditModal";
import { AnimatePresence } from "framer-motion";

export const Chats = () => {
  const [chatWith, setChatWith] = useState<user>();
  const [editModal, setEditModal] = useState<boolean>(false);

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

  const closeEditModal = () => {
    console.log("Closing Edit Modal");
    setEditModal(false);
  };

  return (
    <>
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
            <button className="chats__sidebar__profile-edit" onClick={() => setEditModal(true)}>
              <EditIcon className="chats__sidebar__profile-btn-icon" />
            </button>
            <button className="chats__sidebar__profile-signout" onClick={SignOut}>
              <SignOutIcon className="chats__sidebar__profile-btn-icon" />
            </button>
          </div>
          <span className="chats__sidebar__title">Chats</span>
          <Users setChatWith={setChatWith} chatWith={chatWith} />
        </div>
        <div className="chats__content">
          <div className="chats__content__header">{chatWith?.displayName}</div>
          <ChatRoom chatWith={chatWith} />
        </div>
      </div>
      <AnimatePresence>{editModal && <EditModal closeEditModal={closeEditModal} />}</AnimatePresence>
    </>
  );
};

import { useEffect, useState } from "react";
import { auth } from "../../App";
import { useNavigate } from "react-router-dom";

import "./style.scss";

import DefaultProfilePhoto from "../../assets/profile.png";
import { EditIcon, FireChatText, FireIcon, SignOutIcon } from "../../components/Svgs";
import { ChatRoom } from "./ChatRoom";
import { Users } from "../../components/Users/Users";
import { modalType, user } from "./type";
import { EditDisplayNameModal } from "../../components/Modals/EditDisplayNameModal";
import { AnimatePresence } from "framer-motion";
import { EditProfilePictureModal } from "../../components/Modals/EditProfilePictureModal";

export const Chats = () => {
  const [chatWith, setChatWith] = useState<user>();
  const [editModal, setEditModal] = useState<modalType>("CLOSED");
  const navigator = useNavigate();

  useEffect(() => {
    if (auth.currentUser === null) {
      navigator("/");
    }
  }, []);

  const closeEditModal = () => {
    console.log("Closing Edit Modal");
    setEditModal("CLOSED");
  };

  return (
    <>
      <div className="chats">
        <div className="chats__sidebar">
          <div className="chats__sidebar__header">
            <FireIcon className="chats__sidebar__header-icon" />
            <FireChatText className="chats__sidebar__header-text" />
          </div>
          <CurrentUser setEditModal={setEditModal} />
          <span className="chats__sidebar__title">Chats</span>
          <Users setChatWith={setChatWith} chatWith={chatWith} />
        </div>
        <div className="chats__content">
          {chatWith ? (
            <>
              <div className="chats__content__header">{chatWith?.displayName}</div>
              <ChatRoom chatWith={chatWith} />
            </>
          ) : (
            <div className="chats__content__empty">Select a user to chat</div>
          )}
        </div>
      </div>
      <AnimatePresence>
        {editModal === "EDIT_DISPLAY_NAME" && <EditDisplayNameModal closeEditModal={closeEditModal} />}
        {editModal === "EDIT_PROFILE_PICTURE" && <EditProfilePictureModal closeEditModal={closeEditModal} />}
      </AnimatePresence>
    </>
  );
};

interface CurrentUserProps {
  setEditModal: (value: modalType) => void;
}
const CurrentUser = ({ setEditModal }: CurrentUserProps) => {
  const navigator = useNavigate();
  const SignOut = async () => {
    await auth.signOut();
    navigator("/");
  };
  return (
    <div className="chats__sidebar__profile">
      <div className="chats__sidebar__profile__picture" onClick={() => setEditModal("EDIT_PROFILE_PICTURE")}>
        <img className="chats__sidebar__profile__picture-img" src={auth.currentUser?.photoURL ? auth.currentUser?.photoURL : DefaultProfilePhoto} alt="Profile" />
        <EditIcon className="chats__sidebar__profile__picture-editIcon" />
      </div>
      <div className="chats__sidebar__profile-name">
        <span className="chats__sidebar__profile-displayname">{auth.currentUser?.displayName}</span>
        <span className="chats__sidebar__profile-email">{auth.currentUser?.email}</span>
      </div>
      <button className="chats__sidebar__profile-edit" onClick={() => setEditModal("EDIT_DISPLAY_NAME")}>
        <EditIcon className="chats__sidebar__profile-btn-icon" />
      </button>
      <button className="chats__sidebar__profile-signout" onClick={SignOut}>
        <SignOutIcon className="chats__sidebar__profile-btn-icon" />
      </button>
    </div>
  );
};

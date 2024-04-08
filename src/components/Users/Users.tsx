import { collection, onSnapshot, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, firestore } from "../../App";

import DefaultProfilePhoto from "../../assets/profile.png";
import { user } from "../../Pages/Chats/type";

import "./style.scss";

interface UsersProps {
  setChatWith: (user: user) => void;
  chatWith?: user;
}

export const Users = ({ setChatWith, chatWith }: UsersProps) => {
  const [users, setUsers] = useState<user[]>();

  useEffect(() => {
    const q = query(collection(firestore, "users"));
    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      const fetchedUsers: user[] = [];
      QuerySnapshot.forEach((doc: any) => {
        if (doc.data().uid === auth.currentUser?.uid) return;
        fetchedUsers.push({ ...doc.data(), id: doc.id });
      });
      setUsers(fetchedUsers);
    });

    return () => unsubscribe();
  }, []);

  const handleUserClick = (displayName: string, uid: string) => {
    const newUser: user = { displayName: displayName, uid: uid };
    setChatWith(newUser);
  };

  return (
    <div className="users">
      {users?.map((user) => (
        <div key={user.uid} className={`users__item ${chatWith?.uid === user.uid ? "selected" : ""}`} onClick={() => handleUserClick(user.displayName, user.uid)}>
          <img src={DefaultProfilePhoto} alt="Profile" />
          <span className={`users__item-displayname ${chatWith?.uid === user.uid ? "selected" : ""}`}>{user.displayName}</span>
        </div>
      ))}
    </div>
  );
};

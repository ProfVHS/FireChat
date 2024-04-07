import { useState } from "react";
import "./style.scss";
import { updateProfile } from "firebase/auth";
import { auth, firestore } from "../../main";
import { collection, doc, getDoc, getDocs, onSnapshot, query, QuerySnapshot, updateDoc, where } from "firebase/firestore";

interface EditModalProps {
  setEditModal: (value: boolean) => void;
}

export const EditModal = ({ setEditModal }: EditModalProps) => {
  const [displayName, setDisplayName] = useState<string>("");
  const changeDisplayName = async () => {
    console.log(displayName);
    const user = auth.currentUser;
    if (user) {
      await updateProfile(user, {
        displayName: displayName,
      });
      const q = query(collection(firestore, "users"), where("uid", "==", user.uid));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0];
        await updateDoc(docRef.ref, {
          displayName: displayName,
        });
      }
    }

    setEditModal(false);
  };
  return (
    <div className="modal">
      <div className="modal__blur"></div>
      <div className="modal__content">
        <span className="modal__content__title">Edit Profile</span>
        <label>Change your display name</label>
        <input type="text" placeholder="Display Name" onChange={(e) => setDisplayName(e.target.value)} />
        <div className="modal__content__buttons">
          <button className="modal__content__button save" onClick={() => changeDisplayName()}>
            Save
          </button>
          <button className="modal__content__button cancel" onClick={() => setEditModal(false)}>
            Cancel
          </button>
          <button className="modal__content__button delete">Delete Account</button>
        </div>
      </div>
    </div>
  );
};
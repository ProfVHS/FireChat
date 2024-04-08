import { useState } from "react";
import "./style.scss";
import { updateProfile } from "firebase/auth";
import { auth, firestore } from "../../App";
import { collection, deleteDoc, getDocs, or, query, updateDoc, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

interface EditModalProps {
  setEditModal: (value: boolean) => void;
}

export const EditModal = ({ setEditModal }: EditModalProps) => {
  const [displayName, setDisplayName] = useState<string>("");
  const navigate = useNavigate();

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

  const deleteAllMessages = async (uid: string) => {
    const q = query(collection(firestore, "messages"), or(where("uid", "==", uid), where("sentTo.uid", "==", uid)));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
  };

  const deleteAccount = async (uid: string) => {
    const q = query(collection(firestore, "users"), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docRef = querySnapshot.docs[0];
      await deleteDoc(docRef.ref);
    }
    auth.currentUser?.delete();
  };

  const handleDeleteButton = async () => {
    const user = auth.currentUser;
    if (user) {
      await deleteAllMessages(user.uid);
      await deleteAccount(user.uid);
    }
    auth.signOut();
    navigate("/");
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
          <button className="modal__content__button delete" onClick={handleDeleteButton}>
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

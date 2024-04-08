import { useEffect, useState } from "react";
import "./style.scss";
import { updateProfile } from "firebase/auth";
import { auth, firestore } from "../../App";
import { collection, deleteDoc, getDocs, or, query, updateDoc, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

import { useAnimate, usePresence, motion } from "framer-motion";

interface EditDisplayNameModalProps {
  closeEditModal: () => void;
}

export const EditDisplayNameModal = ({ closeEditModal }: EditDisplayNameModalProps) => {
  const [displayName, setDisplayName] = useState<string>("");
  const navigate = useNavigate();

  const [scope, animate] = useAnimate();
  const [isPresence, safeToRemove] = usePresence();

  useEffect(() => {
    if (isPresence) {
      const enterAnimation = async () => {
        await animate(".modal__blur", { opacity: [0, 1] }, { duration: 0.2 });
        await animate(".modal__content", { opacity: [0, 1], scale: [0, 1] }, { duration: 0.4, type: "spring" });
      };
      enterAnimation();
    } else {
      const exitAnimation = async () => {
        animate(".modal__content", { opacity: 0, scale: 0 }, { duration: 0.4, type: "spring" });
        await animate(scope.current, { opacity: [1, 0] }, { duration: 0.3, ease: "easeInOut" });
        safeToRemove();
      };
      exitAnimation();
    }
  }, [isPresence]);

  const changeDisplayName = async () => {
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

    closeEditModal();
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
    <div className="modal" ref={scope}>
      <div className="modal__blur"></div>
      <motion.div className="modal__content" initial={{ opacity: 0, scale: 0 }}>
        <span className="modal__content__title">Edit Profile</span>
        <label>Change your display name</label>
        <input type="text" placeholder="Display Name" onChange={(e) => setDisplayName(e.target.value)} />
        <div className="modal__content__buttons">
          <button className="modal__content__button save" onClick={() => changeDisplayName()}>
            Save
          </button>
          <button className="modal__content__button cancel" onClick={closeEditModal}>
            Cancel
          </button>
          <button className="modal__content__button delete" onClick={handleDeleteButton}>
            Delete Account
          </button>
        </div>
      </motion.div>
    </div>
  );
};

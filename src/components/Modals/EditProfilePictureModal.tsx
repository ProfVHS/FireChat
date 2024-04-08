import { updateProfile } from "firebase/auth";
import { useAnimate, usePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { auth, firestore } from "../../App";
import { collection, getDocs, query, updateDoc, where } from "firebase/firestore";

interface EditProfilePictureModalProps {
  closeEditModal: () => void;
}
export const EditProfilePictureModal = ({ closeEditModal }: EditProfilePictureModalProps) => {
  const [pictureUrl, setPictureUrl] = useState<string>("");

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

  const updateProfilePictureInFirestore = async (uid: string) => {
    const q = query(collection(firestore, "users"), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docRef = querySnapshot.docs[0];
      await updateDoc(docRef.ref, {
        photoURL: pictureUrl,
      });
    }
  };

  const handleSave = async () => {
    const user = auth.currentUser;
    if (user) {
      await updateProfile(user, { photoURL: pictureUrl }).then(() => {
        updateProfilePictureInFirestore(user.uid).then(() => {
          closeEditModal();
        });
      });
    }
  };

  return (
    <div className="modal" ref={scope}>
      <div className="modal__blur"></div>
      <motion.div className="modal__content" initial={{ opacity: 0, scale: 0 }}>
        <span className="modal__content__title">Edit Profile Picture</span>
        <label>Enter profile picture's url</label>
        <input type="text" placeholder="url" onChange={(e) => setPictureUrl(e.target.value)} />
        <div className="modal__content__buttons">
          <button className="modal__content__button save" onClick={handleSave}>
            Save
          </button>
          <button className="modal__content__button cancel" onClick={closeEditModal}>
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
};

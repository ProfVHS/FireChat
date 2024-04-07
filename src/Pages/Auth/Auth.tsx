import { useEffect, useState } from "react";
import { FireChatText, FireIcon, LoginIcon, PersonIcon } from "../../components/Svgs";
import "./style.scss";
import { AnimatePresence, useAnimate, usePresence } from "framer-motion";

import ProfilePicture from "../../assets/profile.png";

import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateCurrentUser, updateProfile } from "firebase/auth";
import { auth, firestore } from "../../main";
import { useNavigate } from "react-router-dom";
import { addDoc, collection } from "firebase/firestore";

export const Auth = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true);

  return (
    <div className="auth">
      <Title isLogin={isLogin} setIsLogin={setIsLogin} />
      <Register />
      <Login />
    </div>
  );
};

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigator = useNavigate();

  const SignIn = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });

    navigator("/chats");
  };
  return (
    <div className={`auth__form`}>
      <div className="auth__form__circle">
        <LoginIcon />
      </div>
      <div className="auth__form__title">Login</div>
      <div className="auth__form__desc">Welcome back to our chat!</div>
      <form>
        <label className="auth__form__label">Email</label>
        <input type="email" className="auth__form__input" onChange={(e) => setEmail(e.target.value)} />
        <label className="auth__form__label">Password</label>
        <input type="password" className="auth__form__input" onChange={(e) => setPassword(e.target.value)} />
        <button className="auth__form__button" onClick={SignIn}>
          Login
        </button>
      </form>
    </div>
  );
};

const Register = () => {
  const [email, setEmail] = useState<string>("");
  const [displayName, setDisplayName] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const navigator = useNavigate();

  const addUserToCollection = async (displayName: string, uid: string) => {
    await addDoc(collection(firestore, "users"), {
      displayName: displayName,
      uid: uid,
    });
  };

  const signUpWithEmail = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });

    if (auth.currentUser) {
      await updateProfile(auth.currentUser, { displayName: displayName }).then(() => {
        if (auth.currentUser) {
          addUserToCollection(displayName, auth.currentUser.uid);
        }
      });
    }

    await navigator("/chats");
  };
  return (
    <div className={`auth__form`}>
      <div className="auth__form__circle">
        <PersonIcon />
      </div>
      <div className="auth__form__title">Register</div>
      <div className="auth__form__desc">Please enter your login and password!</div>
      <form>
        <label className="auth__form__label">Display Name</label>
        <input type="text" className="auth__form__input" onChange={(e) => setDisplayName(e.target.value)} />
        <label className="auth__form__label">Email</label>
        <input type="email" className="auth__form__input" onChange={(e) => setEmail(e.target.value)} />
        <label className="auth__form__label">Password</label>
        <input type="password" className="auth__form__input" onChange={(e) => setPassword(e.target.value)} />
        <button className="auth__form__button" onClick={signUpWithEmail}>
          Register
        </button>
      </form>
    </div>
  );
};

interface AuthTitleProps {
  isLogin: boolean;
  setIsLogin: (value: boolean) => void;
}
const Title = ({ isLogin, setIsLogin }: AuthTitleProps) => {
  const [scope, animate] = useAnimate();
  useEffect(() => {
    if (!isLogin) {
      animate(scope.current, { x: "100%" }, { duration: 0.4, type: "tween" });
    } else {
      animate(scope.current, { x: "0%" }, { duration: 0.4, type: "tween" });
    }
  }, [isLogin]);

  const handleChange = () => {
    const newIsLogin = !isLogin;
    setIsLogin(newIsLogin);
  };
  return (
    <div className={`auth__title `} ref={scope}>
      <AnimatePresence>{isLogin && <ChangeButton text="Register" handleChange={handleChange} isLogin={true} />}</AnimatePresence>
      <AnimatePresence>{!isLogin && <ChangeButton text="Login" handleChange={handleChange} isLogin={false} />}</AnimatePresence>
      <FireIcon />
      <FireChatText />
    </div>
  );
};

interface ChangeButtonProps {
  text: string;
  handleChange: () => void;
  isLogin: boolean;
}

const ChangeButton = ({ text, handleChange, isLogin }: ChangeButtonProps) => {
  const [scope, animate] = useAnimate();
  const [isPresence, safeToRemove] = usePresence();
  useEffect(() => {
    if (isPresence) {
      const enterAnimation = async () => {
        await animate(scope.current, { opacity: [0, 1], scale: [0, 1] }, { duration: 0.2, type: "spring", delay: 0.4 });
      };
      enterAnimation();
    } else {
      const exitAnimation = async () => {
        await animate(scope.current, { opacity: 0, scale: 0 }, { duration: 0.4, type: "spring" });
        safeToRemove();
      };
      exitAnimation();
    }
  }, [isPresence]);
  return (
    <button ref={scope} className={`auth__title__button ${isLogin ? "left" : "right"}`} onClick={() => handleChange()}>
      {text}
    </button>
  );
};

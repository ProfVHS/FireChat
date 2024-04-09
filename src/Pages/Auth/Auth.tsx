import { useEffect, useState } from "react";
import { FireChatText, FireIcon, LoginIcon, PersonIcon } from "../../components/Svgs";
import "./style.scss";
import { AnimatePresence, useAnimate, usePresence } from "framer-motion";

import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, firestore } from "../../App.tsx";
import { useNavigate } from "react-router-dom";
import { addDoc, collection } from "firebase/firestore";
import { set } from "firebase/database";

export const Auth = () => {
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState<boolean>(true);

  useEffect(() => {
    if (auth.currentUser) {
      navigate("/chats");
    }
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleChange = () => {
    const newIsLogin = !isLogin;
    setIsLogin(newIsLogin);
  };

  return (
    <div className="auth">
      <Title isLogin={isLogin} setIsLogin={setIsLogin} />
      {windowWidth > 768 ? (
        <>
          <Register />
          <Login />
        </>
      ) : (
        <>
          {isLogin ? (
            <>
              <Login />
              <AnimatePresence>{isLogin && <ChangeButton text="Register" handleChange={handleChange} isLogin={false} />}</AnimatePresence>
            </>
          ) : (
            <>
              <Register />
              <AnimatePresence>{!isLogin && <ChangeButton text="Login" handleChange={handleChange} isLogin={false} />}</AnimatePresence>
            </>
          )}
        </>
      )}
    </div>
  );
};

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<string[]>([]);
  const navigator = useNavigate();

  const SignIn = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setErrors([]);
    e.preventDefault();

    if (email.trim() === "") {
      setErrors((prevErrors) => [...prevErrors, "E-mail is required"]);
      return;
    }
    if (password.trim() === "") {
      setErrors((prevErrors) => [...prevErrors, "Password is required"]);
      return;
    }
    await signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        navigator("/chats");
      })
      .catch((error) => {
        const errorCode = error.code;
        console.log(errorCode);
        setErrors((prevErrors) => [...prevErrors, "Incorrect e-mail or password"]);
        setPassword("");
      });
  };

  const checkForEmailErrors = () => {
    return errors.find((error) => error === "E-mail is required" || email === "Incorrect e-mail or password");
  };

  const checkForPasswordErrors = () => {
    return errors.find((error) => error === "Password is required" || email === "Incorrect e-mail or password");
  };
  return (
    <div className={`auth__form`}>
      <div className="auth__form__circle">
        <LoginIcon />
      </div>
      <div className="auth__form__title">Login</div>
      <div className="auth__form__desc">Welcome back to our chat!</div>
      {errors.length > 0 && <Errors errors={errors} />}
      <form>
        <label className="auth__form__label">Email</label>
        <input type="email" className={`auth__form__input ${checkForEmailErrors() && "error"}`} value={email} onChange={(e) => setEmail(e.target.value)} />
        <label className="auth__form__label">Password</label>
        <input type="password" className={`auth__form__input ${checkForPasswordErrors() && "error"}`} value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="auth__form__button" onClick={SignIn}>
          Login
        </button>
      </form>
    </div>
  );
};
interface ErrorsProps {
  errors: string[];
}
const Errors = ({ errors }: ErrorsProps) => {
  return (
    <div className="auth__form__errors">
      {errors.map((error, i) => {
        return (
          <div key={i} className="auth__form__errors-item">
            {error}
          </div>
        );
      })}
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
      .then(async () => {
        if (auth.currentUser) {
          await updateProfile(auth.currentUser, { displayName: displayName }).then(() => {
            if (auth.currentUser) {
              addUserToCollection(displayName, auth.currentUser.uid);
            }
          });
          await navigator("/chats");
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        return;
      });
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

import { useEffect, useState } from "react";
import { FireChatText, FireIcon, LoginIcon, PersonIcon } from "../Svgs";
import "./style.scss";
import { AnimatePresence, useAnimate, usePresence } from "framer-motion";
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
  return (
    <div className={`auth__form`}>
      <div className="auth__form__circle">
        <LoginIcon />
      </div>
      <div className="auth__form__title">Login</div>
      <div className="auth__form__desc">Welcome back to our chat!</div>
      <form>
        <label className="auth__form__label">Username</label>
        <input type="text" className="auth__form__input" />
        <label className="auth__form__label">Password</label>
        <input type="password" className="auth__form__input" />
        <button className="auth__form__button">Login</button>
      </form>
    </div>
  );
};

const Register = () => {
  return (
    <div className={`auth__form`}>
      <div className="auth__form__circle">
        <PersonIcon />
      </div>
      <div className="auth__form__title">Register</div>
      <div className="auth__form__desc">Please enter your login and password!</div>
      <form>
        <label className="auth__form__label">Username</label>
        <input type="text" className="auth__form__input" />
        <label className="auth__form__label">Name</label>
        <input type="text" className="auth__form__input" />
        <label className="auth__form__label">Password</label>
        <input type="password" className="auth__form__input" />
        <button className="auth__form__button">Login</button>
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

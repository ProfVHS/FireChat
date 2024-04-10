import { useEffect, useState } from "react";
import { FireChatText, FireIcon } from "../../components/Svgs";
import "./style.scss";
import { AnimatePresence, useAnimate, usePresence, motion } from "framer-motion";

import { auth } from "../../App.tsx";
import { useNavigate } from "react-router-dom";
import { Register } from "./Register.tsx";
import { Login } from "./Login.tsx";

export const Auth = () => {
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState<boolean>(false);

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
    <motion.div className={`auth__title `} ref={scope} initial={{ x: "100%" }}>
      <AnimatePresence>{isLogin && <ChangeButton text="Register" handleChange={handleChange} isLogin={true} />}</AnimatePresence>
      <AnimatePresence>{!isLogin && <ChangeButton text="Login" handleChange={handleChange} isLogin={false} />}</AnimatePresence>
      <FireIcon />
      <FireChatText />
    </motion.div>
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

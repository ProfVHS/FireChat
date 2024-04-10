import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../App.tsx";
import { useNavigate } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import { LoginIcon } from "../../components/Svgs.tsx";

type LoginInputs = {
  email: string;
  password: string;
};

export const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInputs>();

  const navigator = useNavigate();

  const onSubmit: SubmitHandler<LoginInputs> = async (userData) => {
    console.log(userData);
    await signInWithEmailAndPassword(auth, userData.email, userData.password)
      .then(() => {
        navigator("/chats");
      })
      .catch((error) => {
        const errorCode = error.code;
        console.log(errorCode);
      });
  };

  return (
    <div className={`auth__form`}>
      <div className="auth__form__circle">
        <LoginIcon />
      </div>
      <div className="auth__form__title">Login</div>
      <div className="auth__form__desc">Welcome back to our chat!</div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label className="auth__form__label">Email</label>
        {errors.email && <span className="auth__form__error">{errors.email.message}</span>}
        <input type="email" className="auth__form__input" {...register("email", { required: "Please enter the e-mail" })} />
        <label className="auth__form__label">Password</label>
        {errors.password && <span className="auth__form__error">{errors.password.message}</span>}
        <input type="password" className="auth__form__input" {...register("password", { required: "Please enter the passowrd " })} />
        <button className="auth__form__button">Login</button>
      </form>
    </div>
  );
};

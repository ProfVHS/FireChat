import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, firestore } from "../../App.tsx";
import { useNavigate } from "react-router-dom";
import { addDoc, collection } from "firebase/firestore";
import { SubmitHandler, useForm } from "react-hook-form";
import { PersonIcon } from "../../components/Svgs";

type RegisterInputs = {
  displayName: string;
  email: string;
  password: string;
};

export const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInputs>();

  const navigator = useNavigate();

  const addUserToCollection = async (displayName: string, uid: string) => {
    await addDoc(collection(firestore, "users"), {
      displayName: displayName,
      uid: uid,
    });
  };

  const onSubmit: SubmitHandler<RegisterInputs> = async (userData) => {
    console.log(userData);
    await createUserWithEmailAndPassword(auth, userData.email, userData.password)
      .then(async (user) => {
        await updateProfile(user.user, { displayName: userData.displayName }).then(async () => {
          await addUserToCollection(userData.displayName, user.user.uid);
          await navigator("/chats");
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        console.log(errorCode);
      });
  };

  return (
    <div className={`auth__form`}>
      <div className="auth__form__circle">
        <PersonIcon />
      </div>
      <div className="auth__form__title">Register</div>
      <div className="auth__form__desc">Please enter your login and password!</div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <label className="auth__form__label">Display Name</label>
        {errors.displayName && <span className="auth__form__error">{errors.displayName.message}</span>}
        <input
          type="text"
          className={`auth__form__input `}
          {...register("displayName", {
            required: "Display Name is required",
            minLength: { value: 3, message: "Display Name must have at least 3 characters" },
            maxLength: { value: 20, message: "Display Name can have maximum 20 characters" },
          })}
        />

        <label className="auth__form__label">Email</label>
        {errors.email && <span className="auth__form__error">{errors.email.message}</span>}
        <input
          type="email"
          className={`auth__form__input `}
          {...register("email", {
            required: "E-mail is required",
            pattern: {
              value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
              message: "Please enter a valid email",
            },
          })}
        />

        <label className="auth__form__label">Password</label>
        {errors.password && <span className="auth__form__error">{errors.password.message}</span>}
        <input
          type="password"
          className={`auth__form__input `}
          {...register("password", {
            required: "Password is required",
            minLength: { value: 6, message: "Password must have at least 6 characters" },
          })}
        />
        <button className="auth__form__button">Register</button>
      </form>
    </div>
  );
};

import { useEffect, useState } from "react";
import { CheckBox } from "../Components/CheckBox";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { LogInUser, SignUpUser } from "../Actions/SupabaseActions";
import toast from "react-hot-toast";

function Login() {
  const [checked, setChecked] = useState(false);
  const navigate = useNavigate();

  const loggedInfo = JSON.parse(
    localStorage.getItem("sb-xqpgunhudqrnqtfkbiwg-auth-token"),
  );

  //if there was no logged Info we assume the data has expired or the user has never logged in before

  //i added 3 zeros to it because supabase date.now() is wrong
  const hasExpired = loggedInfo
    ? Date.now() > Number(loggedInfo?.expires_at + "000")
    : true;

  //if the token in the storage had not expired when the user navigated to the log in page, redirect back to profile
  useEffect(
    function () {
      if (!hasExpired) {
        navigate("/home");
      }
    },
    [hasExpired, navigate, loggedInfo],
  );

  //if it has expired, return the sign in page, if not return nothing cus we are redirecting

  return (
    <main className="flex h-dvh w-full items-center justify-center bg-primaryBgColor px-6">
      <div className="w-full md:w-3/4 lg:w-1/2 ">
        <span className="flex justify-center">
          <CheckBox checked={checked} setChecked={setChecked} />
        </span>

        {checked ? <SignUpForm /> : <LoginInForm />}
      </div>
    </main>
  );
}

function LoginInForm() {
  const navigate = useNavigate();
  const { formState, register, handleSubmit } = useForm();

  const { errors } = formState;

  async function handleLogin(userData) {
    const { password, email } = userData;

    try {
      const createUser = await LogInUser(email, password);
      navigate("/home");
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-semibold">Log In</h2>
      <form className="block space-y-6" onSubmit={handleSubmit(handleLogin)}>
        <InputGroup>
          <label htmlFor="email" className="text-base font-normal">
            Email
          </label>

          {errors?.email?.message ? (
            <p className="text-xs text-red-600">{errors?.email?.message}</p>
          ) : null}

          <input
            className="rounded-sm border-none px-2 py-2.5 outline-none transition-all duration-500 ease-in-out hover:outline-1 hover:outline-stone-500 focus:outline-1 focus:outline-stone-500 active:outline-1 active:outline-stone-500"
            type="email"
            id="email"
            name="email"
            placeholder="YourEmail@Email.com"
            {...register("email", {
              required: { value: true, message: "Please enter your email" },
            })}
          />
        </InputGroup>

        <InputGroup>
          <label htmlFor="password" className="text-base font-normal">
            Password
          </label>

          {errors?.password?.message ? (
            <p className="text-xs text-red-600">{errors?.password?.message}</p>
          ) : null}

          <input
            className="rounded-sm border-none px-2 py-2.5 outline-none transition-all duration-500 ease-in-out hover:outline-1 hover:outline-stone-500 focus:outline-1 focus:outline-stone-500 active:outline-1 active:outline-stone-500"
            type="password"
            id="password"
            placeholder="Your Password"
            {...register("password", {
              required: { value: true, message: "Please enter your password" },
            })}
          />
        </InputGroup>

        <button
          type="submit"
          className="bg-bellsBlue  hover:bg-hoverBellsBlue block w-full rounded-sm p-2.5 text-center text-lg font-semibold text-white duration-300"
        >
          Log In
        </button>
      </form>
    </div>
  );
}

function SignUpForm() {
  const { formState, handleSubmit, register, getValues, reset } = useForm();

  const { errors } = formState;

  async function handleLogIn(userData) {
    const { email, password } = userData;

    try {
      const createUser = await SignUpUser(email, password);
      toast.success(`An email has been sent to ${email}`);
      reset();
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-semibold">Sign Up</h2>
      <form className="block space-y-6" onSubmit={handleSubmit(handleLogIn)}>
        <InputGroup>
          <label htmlFor="email" className="text-base font-normal">
            Email
          </label>

          {errors?.email?.message ? (
            <p className="text-xs text-red-600">{errors?.email?.message}</p>
          ) : null}

          <input
            className="rounded-sm border-none px-2 py-2.5 outline-none transition-all duration-500 ease-in-out hover:outline-1 hover:outline-stone-500 focus:outline-1 focus:outline-stone-500 active:outline-1 active:outline-stone-500"
            type="email"
            id="email"
            placeholder="YourEmail@Email.com"
            {...register("email", {
              required: { value: true, message: "Please enter your email" },
              pattern: {
                value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Please enter a valid email address",
              },
            })}
          />
        </InputGroup>

        <InputGroup>
          <label htmlFor="password" className="text-base font-normal">
            Password
          </label>

          {errors?.password?.message ? (
            <p className="text-xs  text-red-600">{errors?.password?.message}</p>
          ) : null}

          <input
            className="rounded-sm border-none px-2 py-2.5 outline-none transition-all duration-500 ease-in-out hover:outline-1 hover:outline-stone-500 focus:outline-1 focus:outline-stone-500 active:outline-1 active:outline-stone-500"
            type="password"
            id="password"
            placeholder="Your Password"
            {...register("password", {
              required: { value: true, message: "Please enter your password" },
              minLength: { value: 7, message: "At least 7 characters" },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+/,
                message:
                  "Must contain uppercase & lowercase letters and a number",
              },
            })}
          />
        </InputGroup>

        <InputGroup>
          <label htmlFor="validate" className="text-base font-normal">
            Re-type Password
          </label>

          {errors?.validatePassword?.message ? (
            <p className="text-xs  text-red-600">
              {errors?.validatePassword?.message}
            </p>
          ) : null}

          <input
            className="rounded-sm border-none px-2 py-2.5 outline-none transition-all duration-500 ease-in-out hover:outline-1 hover:outline-stone-500 focus:outline-1 focus:outline-stone-500 active:outline-1 active:outline-stone-500"
            type="password"
            id="validate"
            placeholder="Your Password Again"
            {...register("validatePassword", {
              required: {
                value: true,
                message: "Please enter your password again",
              },
              validate: {
                function(val) {
                  return val === getValues().password
                    ? true
                    : "Passwords do not match";
                },
              },
            })}
          />
        </InputGroup>

        <button
          type="submit"
          className="bg-bellsBlue  hover:bg-hoverBellsBlue block w-full rounded-sm p-2.5 text-center text-lg font-semibold text-white duration-300"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}

function InputGroup({ children }) {
  return <div className="flex flex-col space-y-1.5">{children}</div>;
}

export default Login;

export function FormAction() {}

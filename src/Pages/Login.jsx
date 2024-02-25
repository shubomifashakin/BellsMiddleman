import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";

import toast from "react-hot-toast";

import { IoIosAddCircle, IoIosCloseCircle } from "react-icons/io";

import { CheckBox } from "../Components/CheckBox";
import { FindCourse, LogInUser, SignUpUser } from "../Actions/SupabaseActions";

function Login() {
  const [checked, setChecked] = useState(false);
  const navigate = useNavigate();

  const loggedInfo = JSON.parse(
    localStorage.getItem("sb-xqpgunhudqrnqtfkbiwg-auth-token"),
  );

  //545-signature
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

  //if it has expired, return the sign in page, if not, return nothing cus we are redirecting

  return (
    <main className="flex h-dvh w-full items-center justify-center bg-primaryBgColor px-6">
      <div className="w-full space-y-3 md:w-3/4 lg:w-1/2 ">
        <span className="flex justify-center">
          <CheckBox checked={checked} setChecked={setChecked} />
        </span>

        {checked ? <SignUpForm /> : <LoginInForm />}

        <BottomLinks checked={checked} />
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
        <InputGroup label={"Email"}>
          {errors?.email?.message ? (
            <p className="text-xs text-red-600">{errors?.email?.message}</p>
          ) : null}

          <input
            className="input-style"
            type="email"
            id="Email"
            name="email"
            placeholder="YourEmail@Email.com"
            {...register("email", {
              required: { value: true, message: "Please enter your email" },
            })}
          />
        </InputGroup>

        <InputGroup label={"Password"}>
          {errors?.password?.message ? (
            <p className="text-xs text-red-600">{errors?.password?.message}</p>
          ) : null}

          <input
            className="input-style"
            type="password"
            id="Password"
            placeholder="Your Password"
            {...register("password", {
              required: { value: true, message: "Please enter your password" },
            })}
          />
        </InputGroup>

        <button
          type="submit"
          className="font-base  block w-full rounded-sm bg-bellsBlue p-2 text-center text-base text-white duration-300 hover:bg-hoverBellsBlue"
        >
          Log In
        </button>
      </form>
    </div>
  );
}

function SignUpForm() {
  const [step, setStep] = useState(1);

  const [step1Data, setStep1Data] = useState(null);
  const [step2Data, setStep2Data] = useState(null);

  const [selectedCourses, setSelectedCourses] = useState([]);

  //form state for step1
  const { formState, handleSubmit, register, getValues } = useForm();

  //form state for step2
  const {
    formState: formState2,
    handleSubmit: handleSubmit2,
    register: register2,
  } = useForm();

  const { errors } = formState;
  const { errors: errors2 } = formState2;

  function decrStep() {
    if (step === 1) return;
    setStep((c) => c - 1);
  }

  function incrStep() {
    if (step === 3) return;
    setStep((c) => c + 1);
  }

  function handleStep1(userData) {
    //store the users step1 data
    setStep1Data(userData);

    //go to the next step
    incrStep();
  }

  function handleStep2(userData) {
    //store the users step2 data
    setStep2Data(userData);

    //go to the next step
    incrStep();
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Sign Up</h2>

        <div className="flex space-x-2">
          <span
            className={`block h-3 w-3 rounded-full  ${step >= 1 ? " border border-stone-700 bg-hoverBellsBlue " : "bg-bellsBlue"}`}
          ></span>
          <span
            className={`block h-3 w-3 rounded-full  ${step >= 2 ? " border border-stone-700 bg-hoverBellsBlue " : "bg-bellsBlue"}`}
          ></span>
          <span
            className={`block h-3 w-3 rounded-full  ${step >= 3 ? " border border-stone-700 bg-hoverBellsBlue " : "bg-bellsBlue"}`}
          ></span>
        </div>
      </div>

      {step === 1 ? (
        <Step1Form
          handleStep1={handleStep1}
          getValues={getValues}
          handleSubmit={handleSubmit}
          register={register}
          errors={errors}
        />
      ) : null}

      {step === 2 ? (
        <Step2Form
          handleStep2={handleStep2}
          handleSubmit2={handleSubmit2}
          register2={register2}
          errors2={errors2}
          decrStep={decrStep}
        />
      ) : null}

      {step === 3 ? (
        <Step3Form
          selectedCourses={selectedCourses}
          setSelectedCourses={setSelectedCourses}
        />
      ) : null}

      {/**show the next and previous buttons after going to step 2 */}
      {step >= 3 ? (
        <div className="flex justify-between">
          <Button action={decrStep} label={"Previous"} />

          <Button label={"Sign Up"} />
        </div>
      ) : null}
    </div>
  );
}

function Step1Form({ handleSubmit, handleStep1, register, errors, getValues }) {
  return (
    <form
      className="flex flex-col space-y-6 "
      onSubmit={handleSubmit(handleStep1)}
    >
      <InputGroup label={"Email"}>
        {errors?.email?.message ? (
          <p className="text-xs text-red-600">{errors?.email?.message}</p>
        ) : null}

        <input
          className="input-style"
          type="email"
          id="Email"
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

      <InputGroup label={"Password"}>
        {errors?.password?.message ? (
          <p className="text-xs  text-red-600">{errors?.password?.message}</p>
        ) : null}

        <input
          className="input-style"
          type="password"
          id="Password"
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

      <InputGroup label={"Re-type Password"}>
        {errors?.validatePassword?.message ? (
          <p className="text-xs  text-red-600">
            {errors?.validatePassword?.message}
          </p>
        ) : null}

        <input
          className="input-style"
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

      <Button label={"Next"} />
    </form>
  );
}

function Step2Form({
  handleSubmit2,
  handleStep2,
  register2,
  errors2,
  decrStep,
}) {
  return (
    <form
      className="flex flex-col space-y-6 "
      onSubmit={handleSubmit2(handleStep2)}
    >
      <InputGroup label={"Matric Number"}>
        {errors2?.matricNo?.message ? (
          <p className="text-xs text-red-600">{errors2?.matricNo?.message}</p>
        ) : null}

        <input
          className="input-style"
          type="text"
          id="matricNo"
          placeholder="Your Matric Number"
          {...register2("matricNo", {
            required: {
              value: true,
              message: "Please enter your matric number",
            },
            pattern: {
              value: /^[0-9]{4}\/[0-9]{4}$/,
              message: "Please enter a valid matric number",
            },
          })}
        />
      </InputGroup>

      <InputGroup label={"College"}>
        {errors2?.college?.message ? (
          <p className="text-xs  text-red-600">{errors2?.college?.message}</p>
        ) : null}

        <input
          className="input-style"
          type="text"
          id="college"
          placeholder="Your College"
          {...register2("college", {
            required: { value: true, message: "Please enter your college" },
          })}
        />
      </InputGroup>

      <InputGroup label={"Department"}>
        {errors2?.dept?.message ? (
          <p className="text-xs  text-red-600">{errors2?.dept?.message}</p>
        ) : null}

        <input
          className="input-style"
          type="text"
          id="dept"
          placeholder="Your Department"
          {...register2("dept", {
            required: {
              value: true,
              message: "Please enter your department",
            },
          })}
        />
      </InputGroup>

      <div className="flex justify-between">
        <Button action={decrStep} label={"Previous"} />
        <Button label={"Next"} />
      </div>
    </form>
  );
}

function Step3Form({ selectedCourses, setSelectedCourses }) {
  const [searchCourse, setSearchCourse] = useState("");
  const [foundCourses, setFoundCourses] = useState([]);
  const [error, setError] = useState("");

  function addCourse(course) {
    if (selectedCourses.includes(course)) return;
    setSelectedCourses((c) => [...c, course]);
  }

  function removeCourse(course) {
    setSelectedCourses((c) => c.filter((c, i) => c !== course));
  }

  //search for course on change
  useEffect(
    function () {
      const abortController = new AbortController();
      async function getCourses() {
        try {
          const data = await FindCourse(searchCourse, abortController);
          setFoundCourses(data);
        } catch (err) {
          if (abortController.signal.aborted) return;
          setError(err.message);
        }
      }

      getCourses();

      return () => abortController.abort();
    },
    [searchCourse],
  );

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-xs">Select Courses You Are Offering</h2>
        <span className="text-xs">
          {selectedCourses.length} courses selected
        </span>
      </div>

      <input
        type="search"
        placeholder="Search for a course"
        className="input-style w-full "
        onChange={(e) => setSearchCourse(e.target.value)}
      />

      <div className="max-h-52 overflow-y-auto p-2 lg:max-h-40">
        {/**if the user is searching for a course, show the found courses */}
        {searchCourse.length ? (
          <>
            {foundCourses.map((course, i) => {
              return (
                <div className="flex items-center justify-between py-2" key={i}>
                  <span> {course.course_code}</span>

                  <div className="flex items-center">
                    <button
                      className="text-sm transition-colors duration-300 ease-in-out hover:text-hoverBellsBlue active:text-hoverBellsBlue"
                      onClick={() => addCourse(course.course_code)}
                    >
                      <IoIosAddCircle className=" text-xl text-black hover:text-hoverBellsBlue" />
                    </button>
                  </div>
                </div>
              );
            })}
          </>
        ) : null}

        {/**if the user is not searching for anything show the selected courses */}
        {!searchCourse.length ? (
          <>
            {selectedCourses.map((course, i) => {
              return (
                <div className="flex items-center justify-between py-2" key={i}>
                  <span> {course}</span>

                  <div className="flex items-center px-1">
                    <button
                      className="text-sm transition-colors duration-300 ease-in-out hover:text-hoverBellsBlue active:text-hoverBellsBlue"
                      onClick={() => removeCourse(course)}
                    >
                      <IoIosCloseCircle className=" text-xl text-black hover:text-hoverBellsBlue" />
                    </button>
                  </div>
                </div>
              );
            })}
          </>
        ) : null}
      </div>
    </div>
  );
}

function Button({ action, label }) {
  return action ? (
    <button
      onClick={action}
      type="button"
      className="font-base  block rounded-sm bg-bellsBlue p-1.5 text-center text-base text-white duration-300 hover:bg-hoverBellsBlue"
    >
      {label}
    </button>
  ) : (
    <button
      type="submit"
      className="font-base block self-end rounded-sm bg-bellsBlue p-1.5 text-center text-base text-white duration-300 hover:bg-hoverBellsBlue"
    >
      {label}
    </button>
  );
}

function InputGroup({ label, children }) {
  return (
    <div className="flex flex-col space-y-1.5">
      <label htmlFor={label} className="text-base font-normal">
        {label}
      </label>

      {children}
    </div>
  );
}

function BottomLinks({ checked }) {
  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <p className="text-center text-xs">
        Are you a lecturer? Visit &nbsp;
        <a
          href="#"
          className="underline transition-colors duration-300 ease-in-out hover:text-hoverBellsBlue"
        >
          www.lecturer.com
        </a>
      </p>

      {!checked ? (
        <a
          href="#"
          className="text-xs underline transition-colors duration-300 ease-in-out hover:text-hoverBellsBlue"
        >
          Forgot Password?
        </a>
      ) : null}
    </div>
  );
}
export default Login;

export function FormAction() {}

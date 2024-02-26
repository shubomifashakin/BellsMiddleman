import { useEffect, useLayoutEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";

import toast from "react-hot-toast";

import { IoIosAddCircle, IoIosCloseCircle } from "react-icons/io";

import { CheckBox } from "../Components/CheckBox";
import {
  FindCourse,
  GetColleges,
  LogInUser,
  SignUpUser,
} from "../Actions/SupabaseActions";
import { sortArrayBasedOnLetters } from "../Actions/HelperActions";

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

        {checked ? <SignUpForm setChecked={setChecked} /> : <LoginInForm />}

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
      const logInUser = await LogInUser(email, password);
      navigate("/home");
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <div className="animate-flash space-y-2">
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

const initialSignUpState = {
  selectedCourses: [],
  matricNo: "",
  college: "",
  dept: "",
  email: "",
  password: "",
  valPassword: "",
};

function SignUpReducer(state, { payload, label }) {
  switch (label) {
    case "setEmail":
      return { ...state, email: payload };

    case "setPassword":
      return { ...state, password: payload };

    case "setValPassword":
      return { ...state, valPassword: payload };

    case "setCollege":
      return { ...state, college: payload };

    case "setMatricNo":
      return { ...state, matricNo: payload };

    case "setDept":
      return { ...state, dept: payload };

    case "addCourse":
      return { ...state, selectedCourses: [...state.selectedCourses, payload] };

    case "removeCourse":
      return {
        ...state,
        selectedCourses: state.selectedCourses.filter((c) => c !== payload),
      };
  }
}

function SignUpForm({ setChecked }) {
  const [step, setStep] = useState(1);

  const [
    { selectedCourses, matricNo, college, dept, email, password, valPassword },
    dispatch,
  ] = useReducer(SignUpReducer, initialSignUpState);

  function decrStep() {
    if (step === 1) return;
    setStep((c) => c - 1);
  }

  function incrStep() {
    if (step === 3) return;
    setStep((c) => c + 1);
  }

  //handles the signing up
  async function handleSignUp() {
    //if no course was selected, prevent user from submitting
    if (!selectedCourses.length) return;

    try {
      const createUser = await SignUpUser(email, password);
      toast.success(`An email has been sent to ${email}`);

      //show log in ui
      setChecked(false);
    } catch (error) {
      toast.error(error.message);
    }
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
          incrStep={incrStep}
          email={email}
          password={password}
          valPassword={valPassword}
          dispatch={dispatch}
        />
      ) : null}

      {step === 2 ? (
        <Step2Form
          decrStep={decrStep}
          incrStep={incrStep}
          dispatch={dispatch}
          matricNo={matricNo}
          college={college}
          dept={dept}
        />
      ) : null}

      {step === 3 ? (
        <Step3Form
          selectedCourses={selectedCourses}
          handleSignUp={handleSignUp}
          dispatch={dispatch}
          decrStep={decrStep}
        />
      ) : null}
    </div>
  );
}

function Step1Form({ incrStep, email, password, valPassword, dispatch }) {
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [valError, setValError] = useState("");

  function handleEmail(value) {
    dispatch({ label: "setEmail", payload: value });

    setEmailError("");
  }

  function handlePassword(value) {
    dispatch({ label: "setPassword", payload: value });

    setPasswordError("");
  }

  function handleValPassword(value) {
    dispatch({ label: "setValPassword", payload: value });

    setValError("");
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!email && !password && !valPassword) {
      setPasswordError("Please enter your password");
      setEmailError("Please enter your email");
      setValError("Please enter your password");
      return;
    }

    if (!email) {
      setEmailError("Please enter your email");
      return;
    }

    if (!password) {
      setPasswordError("Please enter your password");
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+/.test(password)) {
      setPasswordError(
        "Must contain uppercase & lowercase letters and a number",
      );
      return;
    }

    if (!valPassword) {
      setValError("Please enter your password again");
      7;

      return;
    }

    if (password !== valPassword) {
      setValError("Passwords do not match");
      setPasswordError("Passwords do not match");
      return;
    }

    //go to next step
    incrStep();
  }

  return (
    <form
      className="flex animate-flash flex-col space-y-6 "
      onSubmit={handleSubmit}
    >
      <InputGroup label={"Email"}>
        {emailError ? (
          <p className="text-xs text-red-600">{emailError}</p>
        ) : null}

        <input
          className="input-style"
          type="email"
          id="Email"
          placeholder="YourEmail@Email.com"
          value={email}
          onChange={(e) => handleEmail(e.target.value)}
        />
      </InputGroup>

      <InputGroup label={"Password"}>
        {passwordError ? (
          <p className="text-xs  text-red-600">{passwordError}</p>
        ) : null}

        <input
          className="input-style"
          type="password"
          id="Password"
          placeholder="Your Password"
          value={password}
          onChange={(e) => handlePassword(e.target.value)}
        />
      </InputGroup>

      <InputGroup label={"Re-type Password"}>
        {valError ? <p className="text-xs  text-red-600">{valError}</p> : null}

        <input
          className="input-style"
          type="password"
          id="validate"
          placeholder="Your Password Again"
          value={valPassword}
          onChange={(e) => handleValPassword(e.target.value)}
        />
      </InputGroup>

      <Button label={"Next"} />
    </form>
  );
}

function Step2Form({ decrStep, incrStep, matricNo, college, dept, dispatch }) {
  const [allColleges, setAllColleges] = useState([]);
  const [allDepts, setAllDepts] = useState([]);

  const sortedDepts = sortArrayBasedOnLetters(allDepts);

  const [errorMatric, setErrorMatric] = useState("");
  const [errorColl, setErrorColl] = useState("");
  const [errorDept, setErrorDept] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!matricNo && !college && !dept) {
      setErrorMatric("Please enter your matric number");
      setErrorDept("Please select your department");
      setErrorColl("Please select your college");
      return;
    }

    if (!matricNo) {
      setErrorMatric("Please enter your matric number");
      return;
    }

    if (!college) {
      setErrorColl("Please select your college");

      if (!/^[0-9]{4}\/[0-9]{4}$/.test(matricNo)) {
        setErrorMatric("Please enter a valid matric number");
      }
      return;
    }

    if (!dept) {
      setErrorDept("Please select your department");
      7;

      if (!/^[0-9]{4}\/[0-9]{4}$/.test(matricNo)) {
        setErrorMatric("Please enter a valid matric number");
      }
      return;
    }

    if (!/^[0-9]{4}\/[0-9]{4}$/.test(matricNo)) {
      setErrorMatric("Please enter a valid matric number");
      return;
    }

    //go to the next step
    incrStep();
  }

  function handleMatric(value) {
    dispatch({ label: "setMatricNo", payload: value });

    setErrorMatric("");
  }

  function handleCollege(value) {
    dispatch({ label: "setCollege", payload: value });

    setErrorColl("");
  }

  function handleDept(value) {
    dispatch({ label: "setDept", payload: value });

    setErrorDept("");
  }

  //get list of colleges on mount
  useLayoutEffect(function () {
    //get list of colleges
    async function getColleges() {
      try {
        const colleges = await GetColleges();
        setAllColleges(colleges);
      } catch (err) {
        console.log(err);
      }
    }

    getColleges();
  }, []);

  //get list of departments if a college has been selected, refetch anytime the college changes
  useEffect(
    function () {
      //if user has not selected a college, do not fetch yet
      if (!college || !allColleges.length) return;

      const deptsInCollege = allColleges.find((c) => {
        return c.college === college;
      }).departments;

      setAllDepts(deptsInCollege);
    },
    [college, allColleges],
  );

  return (
    <form
      className="flex animate-flash flex-col space-y-6 "
      onSubmit={handleSubmit}
    >
      <InputGroup label={"Matric Number"}>
        {errorMatric ? (
          <p className="text-xs text-red-600">{errorMatric}</p>
        ) : null}

        <input
          className="input-style"
          type="text"
          id="matricNo"
          placeholder="Your Matric Number"
          value={matricNo}
          onChange={(e) => handleMatric(e.target.value)}
        />
      </InputGroup>

      <InputGroup label={"College"}>
        {errorColl ? <p className="text-xs text-red-600">{errorColl}</p> : null}

        <select
          className="input-style"
          value={college ? college : null}
          onChange={(e) => handleCollege(e.target.value)}
        >
          <option className="text-center" selected disabled>
            --- Please select your college ---
          </option>

          {allColleges.map((college, i) => {
            return (
              <option className="text-center" value={college.college} key={i}>
                {college.college}
              </option>
            );
          })}
        </select>
      </InputGroup>

      {/*show the selection input if the user has selected a college && all the departments for that college have been fetched */}
      {allDepts.length ? (
        <InputGroup label={"Department"}>
          {errorDept ? (
            <p className="text-xs text-red-600">{errorDept}</p>
          ) : null}

          <select
            className="input-style"
            value={dept ? dept : null}
            onChange={(e) => handleDept(e.target.value)}
          >
            <option className="text-center" selected disabled>
              --- Please select a department ---
            </option>

            {sortedDepts.map((dept, i) => {
              return (
                <option className="text-center" key={i} value={dept}>
                  {dept}
                </option>
              );
            })}
          </select>
        </InputGroup>
      ) : null}

      <div className="flex justify-between">
        <Button action={decrStep} label={"Previous"} />
        <Button label={"Next"} />
      </div>
    </form>
  );
}

function Step3Form({ decrStep, selectedCourses, dispatch, handleSignUp }) {
  const [{ searchParam, loading, error, foundCourses }, dispatch2] = useReducer(
    step3Reducer,
    initialStep3State,
  );

  function addCourse(e, course) {
    e.stopPropagation();
    e.preventDefault();
    if (selectedCourses.includes(course)) return;
    dispatch({ label: "addCourse", payload: course });
  }

  function removeCourse(e, course) {
    e.stopPropagation();
    e.preventDefault();
    dispatch({ label: "removeCourse", payload: course });
  }

  function handleSubmit(e) {
    e.preventDefault();
    handleSignUp();
  }

  //search for course on change
  useEffect(
    function () {
      const abortController = new AbortController();

      async function getCourses() {
        try {
          const data = await FindCourse(searchParam, abortController);

          dispatch2({ label: "foundCourses", payload: data });
        } catch (err) {
          if (abortController.signal.aborted) {
            dispatch2({ label: "stopLoading" });
            return;
          }
          dispatch2({ label: "error", payload: err.message });
        }
      }

      if (searchParam.length) {
        getCourses();
      }

      return () => abortController.abort();
    },
    [searchParam],
  );

  return (
    <form className="animate-flash space-y-2" onSubmit={handleSubmit}>
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
        value={searchParam}
        onChange={(e) =>
          dispatch2({ label: "searching", payload: e.target.value })
        }
      />

      <div className="max-h-52 overflow-y-auto p-2 lg:max-h-40">
        {/**if we have finished searching */}
        {searchParam && !loading && !error ? (
          <>
            {foundCourses.length ? (
              foundCourses.map((course, i) => {
                return (
                  <div
                    className="flex items-center justify-between py-2"
                    key={i}
                  >
                    <span> {course.course_code}</span>

                    <div className="flex items-center">
                      <button
                        className="text-sm transition-colors duration-300 ease-in-out hover:text-hoverBellsBlue active:text-hoverBellsBlue"
                        onClick={(e) => addCourse(e, course.course_code)}
                      >
                        <IoIosAddCircle className=" text-xl text-black hover:text-hoverBellsBlue" />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-sm">No course found</p>
            )}
          </>
        ) : null}

        {/** if we are still searching */}
        {loading && searchParam ? (
          <p className="text-center text-sm">Finding Course...</p>
        ) : null}

        {/**if the user is not searching for anything show the selected courses */}
        {!searchParam ? (
          <>
            {selectedCourses.map((course, i) => {
              return (
                <div className="flex items-center justify-between py-2" key={i}>
                  <span> {course}</span>

                  <div className="flex items-center px-1">
                    <button
                      className="text-sm transition-colors duration-300 ease-in-out hover:text-hoverBellsBlue active:text-hoverBellsBlue"
                      onClick={(e) => removeCourse(e, course)}
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

      <div className="flex justify-between">
        <Button action={decrStep} label={"Previous"} />

        <Button label={"Sign Up"} />
      </div>
    </form>
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

function step3Reducer(state, { payload, label }) {
  switch (label) {
    case "searching":
      return { ...state, searchParam: payload, loading: true };

    case "stopLoading":
      return { ...state, loading: false };

    case "error":
      return { ...state, loading: false, error: payload };

    case "foundCourses":
      return { ...state, loading: false, foundCourses: payload };
  }
}

const initialStep3State = {
  searchParam: "",
  foundCourses: [],
  error: "",
  loading: false,
};

export default Login;

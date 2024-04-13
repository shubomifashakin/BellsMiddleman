import { useEffect, useReducer, useRef, useState } from "react";
import { useLoaderData, useNavigate } from "react-router";

import { FaEye } from "react-icons/fa";

import toast from "react-hot-toast";

import { SortArrayBasedOnLetters } from "../Actions/HelperActions";
import { IoIosAdd, IoIosAddCircle, IoIosCloseCircle } from "react-icons/io";
import { Modal, TextField, Typography } from "@mui/material";

import { Navbar } from "../Components/Navbar";
import { Button } from "../Components/Button";

import {
  FindCourse,
  GetStudentsData,
  UpdateCourses,
} from "../Actions/SupabaseActions";

function HomePage() {
  const [courses2, setCourses2] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  const { courses, matric_no, college, dept } = useLoaderData();

  const navigate = useNavigate();

  function handleToggleModal() {
    setModalOpen((c) => !c);
  }

  useEffect(
    function () {
      async function isJSON() {
        try {
          //If the student has never updated courses, its still a json
          const coursesJson = JSON.parse(courses);

          setCourses2(SortArrayBasedOnLetters(coursesJson));
        } catch (e) {
          //if the student has updated before, then it is a regular array
          setCourses2(SortArrayBasedOnLetters(courses));
        }
      }

      isJSON();
    },
    [courses],
  );

  return (
    <>
      <Navbar />

      <main className="relative row-span-2 flex flex-col space-y-4  bg-primaryBgColor  px-6 py-4 lg:py-2 ">
        <div className="flex cursor-default flex-col space-y-2  text-xs text-white lg:flex-row lg:items-center lg:justify-between">
          <p className=" rounded-sm bg-bellsBlue px-2 py-2 shadow-sm">
            Matric No: <span className="font-semibold">{matric_no}</span>
          </p>

          <p className=" rounded-sm bg-bellsBlue px-2 py-2 shadow-sm">
            College: <span className="font-semibold">{college}</span>
          </p>

          <p className=" rounded-sm bg-bellsBlue px-2 py-2 shadow-sm">
            Department: <span className="font-semibold">{dept}</span>
          </p>
        </div>

        <div className="relative w-full overflow-y-auto">
          <h2 className="cursor-default border border-stone-400 bg-bellsBlue p-2 text-xs font-semibold uppercase text-white lg:text-left">
            Courses Offered
          </h2>

          <table className=" w-full  divide-y divide-stone-400 rounded-sm border border-t-0 border-stone-400 p-4 text-center ">
            <thead className="bg-bellsBlue text-white">
              <tr className="divide-x divide-stone-400">
                <th className="py-3.5">S/N</th>
                <th className="py-3.5">Course</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-stone-400">
              {courses2.map((course, index) => {
                return (
                  <tr
                    className={`cursor-pointer divide-x divide-stone-400   transition-all duration-300 ease-in-out hover:bg-bellsBlue hover:text-white ${index % 2 ? "bg-tableEven" : "bg-tableOdd"}`}
                    onClick={() => navigate(`/${course}`)}
                    key={index}
                  >
                    <td className="py-3">{index + 1}</td>

                    <td className="hidden py-3 lg:block">
                      {course}&nbsp;
                      <span className="text-xs">[click to view]</span>
                    </td>

                    <td className="flex items-center justify-center py-3 lg:hidden">
                      {course} &nbsp;
                      <span className="text-base">
                        <FaEye />
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {modalOpen ? (
            <ModalComp
              handleToggleModal={handleToggleModal}
              selectedCourses={courses2}
            />
          ) : null}
        </div>
        <ModalButton onClick={handleToggleModal} />
      </main>
    </>
  );
}

function ModalComp({ handleToggleModal, selectedCourses }) {
  const [updatedCourses, setUpdatedCourses] = useState(selectedCourses);

  const [{ foundCourses, loading, searchParam }, dispatch] = useReducer(
    Step3Reducer,
    initialStep3State,
  );

  const searchRef = useRef(null);

  const navigate = useNavigate();

  function addCourse(e, course) {
    e.stopPropagation();
    e.preventDefault();

    if (selectedCourses.includes(course)) return;

    setUpdatedCourses((c) => [...c, course]);

    dispatch({ label: "clearSearchParam" });
    searchRef.current.focus();
  }

  function removeCourse(e, course) {
    e.stopPropagation();
    e.preventDefault();

    setUpdatedCourses((c) => c.filter((c2) => c2 !== course));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      //if the updated courses and previous courses are the same length and they are the same selected courses
      if (
        updatedCourses.length === selectedCourses.length &&
        updatedCourses.every((c, i) => {
          return c === selectedCourses[i];
        })
      )
        return;

      await UpdateCourses(updatedCourses);
      toast.success("Successfully Updated Courses");

      //refresh the page
      navigate(`/home`);

      //close the modal
      handleToggleModal();
    } catch (err) {
      toast.error(err.message);
    }
  }

  useEffect(
    function () {
      const abortController = new AbortController();

      async function findCourse() {
        try {
          const courses = await FindCourse(searchParam, abortController);

          dispatch({ label: "foundCourses", payload: courses });
        } catch (err) {
          if (abortController.signal.aborted) {
            dispatch({ label: "stopLoading" });
            return;
          }

          dispatch({ label: "error", payload: err.message });
        }
      }

      if (searchParam.length > 1) {
        findCourse();
      }

      return () => abortController.abort();
    },
    [searchParam],
  );

  return (
    <Modal open={true} onClose={handleToggleModal}>
      <div className="absolute left-1/2 top-1/2 w-3/4 -translate-x-1/2 -translate-y-1/2 rounded-sm border border-stone-500 bg-primaryBgColor px-4 py-6 ">
        <form className="space-y-3" onSubmit={handleSubmit}>
          <Typography
            sx={{
              fontSize: "1.05rem",
              fontWeight: 600,
              textAlign: "left",
              textTransform: "capitalize",
              fontFamily: "Poppins,sans-serif",
            }}
          >
            Edit Courses
          </Typography>

          <TextField
            id="outlined-basic"
            label="Course Code"
            variant="outlined"
            fullWidth
            ref={searchRef}
            onChange={(e) =>
              dispatch({ label: "searching", payload: e.target.value })
            }
          />

          <ul className="max-h-64 overflow-y-auto p-2 lg:max-h-64">
            {searchParam && !loading ? (
              <>
                <h2 className="text-xs">Found Courses</h2>
                {foundCourses.length ? (
                  foundCourses.map((course, i) => {
                    return !selectedCourses.includes(course.course_code) ? (
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
                    ) : null;
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

            {/*if we are not searching for anything */}
            {!searchParam ? (
              <>
                <h2 className="text-xs">
                  Selected Courses ({updatedCourses.length})
                </h2>

                {updatedCourses.map((course, i) => {
                  return (
                    <div
                      className="flex items-center justify-between py-2"
                      key={i}
                    >
                      <span> {course}</span>

                      <div className="flex items-center px-1">
                        <button
                          className="text-sm transition-colors duration-300 ease-in-out hover:text-hoverBellsBlue active:text-hoverBellsBlue"
                          onClick={(e) => removeCourse(e, course)}
                        >
                          <IoIosCloseCircle className=" text-2xl text-black hover:text-hoverBellsBlue lg:text-xl" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </>
            ) : null}
          </ul>

          <Button label={"Update Courses"} type="full" />
        </form>
      </div>
    </Modal>
  );
}

function ModalButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute bottom-12 right-12 rounded-full bg-bellsBlue bg-opacity-50 p-2 text-center text-3xl text-white transition-colors duration-300 ease-in-out hover:bg-opacity-100 active:bg-opacity-100"
    >
      <IoIosAdd />
    </button>
  );
}

function Step3Reducer(state, { payload, label }) {
  switch (label) {
    case "searching":
      return { ...state, searchParam: payload, loading: true };

    case "stopLoading":
      return { ...state, loading: false };

    case "error":
      return { ...state, loading: false, error: payload };

    case "foundCourses":
      return { ...state, loading: false, foundCourses: payload };

    case "clearSearchParam":
      return { ...state, searchParam: "" };
  }
}

const initialStep3State = {
  searchParam: "",
  foundCourses: [],
  error: "",
  loading: false,
};

export async function HomeLoader() {
  const studData = await GetStudentsData();
  return studData[0] ? studData[0] : null;
}

export default HomePage;

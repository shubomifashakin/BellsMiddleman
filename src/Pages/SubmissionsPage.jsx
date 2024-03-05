import { useEffect, useRef, useState } from "react";

import { useLoaderData, useNavigate, useParams } from "react-router";

import toast from "react-hot-toast";

import { Navbar } from "../Components/Navbar";
import { CourseNavLink } from "../Components/Navlink";
import { InputGroup } from "../Components/InputGroup";
import { Button } from "../Components/Button";
import LoadingScreen from "../Components/LoadingScreen";

import { MdCloudUpload, MdOutlinePendingActions } from "react-icons/md";
import { FaFilePdf } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";

import {
  DownloadFile,
  FileExists,
  GetStudentsData,
  UploadAssignment,
} from "../Actions/SupabaseActions";

function SubmissionsPage() {
  const [submitting, setSubmitting] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState("");

  const fileRef = useRef(null);

  const { studentsData, hasSubmitted } = useLoaderData();
  const [{ college, matric_no, dept }] = studentsData;

  const submitStatus = hasSubmitted.length ? true : false;

  const { code, assName } = useParams();
  const navigate = useNavigate();

  function handleDragEnter() {
    setDragging(true);
  }

  function handleDrageLeave() {
    setDragging(false);
  }

  function handleDrop(e) {
    e.preventDefault();
    const selectedFile = e.dataTransfer.files[0];

    setDragging(false);
    setFile(selectedFile);
  }

  function triggerFile() {
    fileRef.current.click();
  }

  function storeSelectedFile(e) {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  }

  function removeFile(e) {
    e.stopPropagation();
    setFile(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!file) {
      toast.error("Please select a file to submit");
      fileRef.current.focus();
      return;
    }

    //if it is still submitting, prevent another submission
    if (submitting) return;

    //if not, continue submitting
    if (!submitting) {
      setSubmitting(true);
    }

    const details = {
      courseCode: code,
      college,
      matric_no,
      dept,
      file,
      assName,
    };

    try {
      await UploadAssignment(details);

      setSubmitting(false);

      toast.success(`${assName} Submitted`);

      navigate(`/${code}/assignments`);
    } catch (err) {
      setSubmitting(false);

      const error =
        err.message === "The resource already exists"
          ? "You have submitted"
          : err.message;

      toast.error(error);
    }

    return;
  }

  async function handleDownload(filename, submission = false) {
    try {
      //if we want the assignment itself, download the assignment, if not download what we submitted

      // Fetch the PDF file content
      const pdfBlob = !submission
        ? await DownloadFile(`${code}/assignments/uploads/${filename}`)
        : await DownloadFile(`${code}/assignments/submissions/${filename}`);

      // Create a Blob URL from the Blob
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // Create a temporary anchor element
      const a = document.createElement("a");
      a.href = pdfUrl;
      a.download = filename;

      // trigger a click event on the anchor element
      a.click();

      // Revoke the Blob URL after the tab is closed
      //this prevents the document that was opened from being opened again
      URL.revokeObjectURL(pdfUrl);
    } catch (err) {
      toast.error(err.message);
    }
  }

  //prevents default behaviour for drag and drop
  useEffect(function () {
    function fns(e) {
      e = e || event;
      e.preventDefault();
    }

    window.addEventListener("dragover", fns, false);

    window.addEventListener("drop", fns, false);

    return () => {
      window.removeEventListener("dragover", fns);
      window.removeEventListener("drop", fns);
    };
  }, []);

  return (
    <>
      <Navbar>
        <li className="active text-hoverBellsBlue">
          <CourseNavLink path={`/${code}`} label={code} />
        </li>

        <li className="active text-hoverBellsBlue">
          <CourseNavLink
            path={`/submissions/${code}/${assName}`}
            label={"Submissions"}
          />
        </li>
      </Navbar>

      {submitting ? <LoadingScreen /> : null}

      <main className="row-span-2 flex h-full flex-col  space-y-4 bg-primaryBgColor p-4 lg:px-6 lg:py-4">
        <div className="flex items-center justify-between">
          <DownloadAssignment handleDownload={handleDownload} />

          <Status
            status={submitStatus}
            studentsData={studentsData}
            handleDownload={handleDownload}
          />
        </div>

        <form
          onSubmit={handleSubmit}
          className="h-full space-y-6 overflow-y-auto rounded-sm  p-0.5"
        >
          <h2 className=" cursor-default rounded-t bg-bellsBlue p-2 text-base font-semibold capitalize text-white">
            Submit {assName} for {code}
          </h2>

          <InputGroup label={"Matric Number"}>
            <input
              className=" rounded-sm px-2 py-2.5
             outline outline-1 outline-stone-400  disabled:bg-transparent"
              type="text"
              id="matricNo"
              placeholder="Your Matric Number"
              value={matric_no}
              disabled
            />
          </InputGroup>

          <InputGroup label={"College"}>
            <input
              className=" rounded-sm px-2 py-2.5 outline outline-1 outline-stone-400  disabled:bg-transparent"
              type="text"
              id="College"
              value={college}
              disabled
            />
          </InputGroup>

          <InputGroup label={"Department"}>
            <input
              className=" rounded-sm px-2 py-2.5
               outline outline-1 outline-stone-400  disabled:bg-transparent"
              type="text"
              id="Department"
              value={dept}
              disabled
            />
          </InputGroup>

          <InputGroup label={"Assignment"}>
            <input
              type="file"
              className="lg:hidden"
              accept=".pdf"
              ref={fileRef}
              onChange={storeSelectedFile}
            />

            <div
              onDragEnter={handleDragEnter}
              onDragLeave={handleDrageLeave}
              onDrop={handleDrop}
              className={`relative hidden cursor-pointer rounded-sm transition-all duration-300 ease-in-out lg:flex ${file ? "" : "hover:bg-hoverYellow"} ${dragging ? "bg-hoverYellow " : " border border-dashed border-stone-400"} flex  flex-col items-center space-y-1 py-2 text-center text-black lg:py-4`}
              onClick={triggerFile}
            >
              {file ? (
                <IoMdCloseCircle
                  className="absolute right-2.5 top-2.5 text-lg hover:text-hoverYellow"
                  onClick={removeFile}
                />
              ) : null}

              <FaFilePdf className="text-xl lg:text-3xl" />

              <span className="text-sm ">
                {file
                  ? file.name.length > 25
                    ? file.name.slice(0, 25).trim() + "..."
                    : file.name
                  : "Click or Drag & Drop File"}
              </span>

              <span className="text-xs font-semibold lowercase">pdf files</span>
            </div>
          </InputGroup>

          <Button
            disabled={submitting || submitStatus}
            label={`Submit ${assName}`}
            type="full"
          />
        </form>
      </main>
    </>
  );
}

function Status({ status, studentsData, handleDownload }) {
  const { assName } = useParams();
  const [{ matric_no, college, dept }] = studentsData;

  const filePath = `${assName}/${matric_no.replaceAll("/", "-")}-${college}-${dept}`;

  return (
    <p
      onClick={status ? () => handleDownload(filePath, true) : null}
      className={`flex cursor-default items-center gap-2 rounded-sm p-1 text-sm font-semibold text-white transition-colors duration-300 ease-in-out ${status ? "cursor-pointer bg-green-700  hover:text-hoverYellow " : "bg-red-700"}`}
    >
      {status ? "Submitted " : "Pending"}{" "}
      {status ? (
        <MdCloudUpload className="text-lg" />
      ) : (
        <MdOutlinePendingActions className="text-lg" />
      )}
    </p>
  );
}

function DownloadAssignment({ handleDownload }) {
  const { assName } = useParams();

  return (
    <p
      className="flex cursor-pointer items-center gap-0.5 self-start text-sm font-semibold underline transition-colors duration-300 ease-in-out hover:text-hoverYellow"
      onClick={() => handleDownload(assName)}
    >
      Download {assName} <FaFilePdf />
    </p>
  );
}

export default SubmissionsPage;

export async function SubmissionsLoader({ params }) {
  const { code, assName } = params;

  const studentsData = await GetStudentsData();

  const [{ college, matric_no, dept }] = studentsData;

  const fileName = `${matric_no.replaceAll("/", "-")}-${college}-${dept}`;

  const filePath = `${code}/assignments/submissions/${assName}`;

  const hasSubmitted = await FileExists({
    fileName,
    filePath,
  });

  return { studentsData, hasSubmitted };
}

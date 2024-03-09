import { useRef, useState } from "react";

import { useLoaderData, useNavigate, useParams } from "react-router";

import toast from "react-hot-toast";

import { Navbar } from "../Components/Navbar";
import { CourseNavLink } from "../Components/Navlink";
import { InputGroup } from "../Components/InputGroup";
import { Button } from "../Components/Button";
import LoadingScreen from "../Components/LoadingScreen";

import { FaFilePdf } from "react-icons/fa";

import {
  DownloadFile,
  FileExists,
  GetStudentsData,
  UploadAssignment,
} from "../Actions/SupabaseActions";

import { DragDrop } from "../Components/DragDrop";

function SubmissionsPage() {
  const [submitting, setSubmitting] = useState(false);
  const [file, setFile] = useState("");

  const fileRef = useRef(null);

  //data fetched from loader
  const { studentsData, hasSubmitted: foundSubmitted } = useLoaderData();
  const [{ college, matric_no, dept }] = studentsData;

  //checks if the student has submitted, if there is a file, then student has submitted
  const hasSubmitted = foundSubmitted.length ? true : false;

  const { code, assFileName } = useParams();

  //extract the assignment name from the params
  const assignmentName = assFileName.split("-")[0];

  //extract the due date from the params & check if student can still submit
  const dueDate = assFileName.split("-")[1];
  const isOpen = new Date(dueDate) > new Date();

  const navigate = useNavigate();

  function storeSelectedFile(e) {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    //if it is still submitting, prevent another submission
    if (submitting) return;

    if (!file) {
      toast.error("Please select a file to submit");
      fileRef.current.focus();
      return;
    }

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
      assName: assignmentName,
    };

    try {
      await UploadAssignment(details);

      setSubmitting(false);

      toast.success(`${assignmentName} Submitted`);

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

  async function handleDownload(filename, studSubmission = false) {
    try {
      //if we want the assignment itself, download the assignment, if not download what student submitted

      const pdfBlob = studSubmission
        ? await DownloadFile(`${code}/assignments/submissions/${filename}`)
        : await DownloadFile(`${code}/assignments/uploads/${filename}`);

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

  return (
    <>
      <Navbar>
        <li className="active text-hoverBellsBlue">
          <CourseNavLink path={`/${code}`} label={code} />
        </li>

        <li className="active text-hoverBellsBlue">
          <CourseNavLink
            path={`/submissions/${code}/${assFileName}`}
            label={"Submissions"}
          />
        </li>
      </Navbar>

      {submitting ? <LoadingScreen /> : null}

      <main className="row-span-2 flex h-full flex-col  space-y-4 bg-primaryBgColor p-4 lg:px-6 lg:py-4">
        <div className="flex items-center justify-between">
          <DownloadAssignment handleDownload={handleDownload} />

          <Status hasSubmitted={hasSubmitted} handleDownload={handleDownload} />
        </div>

        <form
          onSubmit={handleSubmit}
          className="h-full space-y-6 overflow-y-auto rounded-sm  p-0.5"
        >
          <h2 className=" cursor-default rounded-t bg-bellsBlue p-2 text-base font-semibold capitalize text-white">
            Submit {assignmentName} for {code}
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

            <DragDrop setFile={setFile} fileRef={fileRef} file={file} />
          </InputGroup>

          <Button
            disabled={submitting || hasSubmitted || !isOpen}
            label={hasSubmitted ? "Submitted" : `Submit ${assignmentName}`}
            type="full"
          />
        </form>
      </main>
    </>
  );
}

function Status({ hasSubmitted, handleDownload }) {
  const { assFileName } = useParams();
  const { studentsData } = useLoaderData();

  const assignmentName = assFileName.split("-")[0];
  const dueDate = assFileName.split("-")[1];

  const assignmentStatus = new Date(dueDate) > new Date() ? "Open" : "Closed";

  const [{ matric_no, college, dept }] = studentsData;

  const filePath = `${assignmentName}/${matric_no.replaceAll("/", "-")}-${college}-${dept}`;

  return (
    <p
      onClick={hasSubmitted ? () => handleDownload(filePath, true) : null}
      className={`flex cursor-default items-center gap-2 rounded-sm p-1 text-sm font-semibold text-white transition-colors duration-300 ease-in-out ${hasSubmitted ? "cursor-pointer bg-green-700  hover:text-hoverYellow " : "bg-red-700"}`}
    >
      {/*if the user has submitted and the assignment is opened show status Open: Submitted */}

      {/*if the user has not submitted and the assignment is open, show Open: Pending else show Closed: Failed */}
      {hasSubmitted
        ? `${assignmentStatus}: Submitted `
        : `${assignmentStatus}: ${assignmentStatus === "Open" ? "Pending" : "Failed"}`}
    </p>
  );
}

function DownloadAssignment({ handleDownload }) {
  const { assFileName } = useParams();
  const assignmentName = assFileName.split("-")[0];

  return (
    <p
      className="flex cursor-pointer items-center gap-0.5 self-start text-sm font-semibold underline transition-colors duration-300 ease-in-out hover:text-hoverYellow"
      onClick={() => handleDownload(assFileName)}
    >
      Download {assignmentName} <FaFilePdf />
    </p>
  );
}

export default SubmissionsPage;

export async function SubmissionsLoader({ params }) {
  const { code, assFileName } = params;

  const assignmentName = assFileName.split("-")[0];
  const studentsData = await GetStudentsData();

  const [{ college, matric_no, dept }] = studentsData;

  const fileName = `${matric_no.replaceAll("/", "-")}-${college}-${dept}`;

  const filePath = `${code}/assignments/submissions/${assignmentName}`;

  const hasSubmitted = await FileExists({
    fileName,
    filePath,
  });

  return { studentsData, hasSubmitted };
}

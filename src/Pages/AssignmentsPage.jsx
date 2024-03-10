import { useNavigate, useParams, useRouteLoaderData } from "react-router";

import { FaEye } from "react-icons/fa";

import { FormatTime } from "../Actions/HelperActions";
import NoNotesOrAss from "../Components/NoNotesOrAss";
import Table from "../Components/Table";

function AssignmentsPage() {
  const { assignments } = useRouteLoaderData("courseData");

  //removes supabase placeholder file from array
  const allAssignments = assignments.filter(
    (c) => c.name !== ".emptyFolderPlaceholder",
  );

  const navigate = useNavigate();
  const { code } = useParams();

  function handleNavigate({ courseCode, assName }) {
    navigate(`/submissions/${courseCode}/${assName}`);
  }

  return (
    <>
      {allAssignments.length ? (
        <Table
          tableLabel={`All Assignments (${allAssignments.length})`}
          headLabels={["S/N", "Title", "Uploaded", "Due Date"]}
        >
          {allAssignments.map((assignment, index) => {
            const assignmentName = assignment.name.split("-")[0];

            const dueDate = assignment.name.split("-")[1];

            return (
              <tr
                className={`table-row ${index % 2 ? "bg-tableEven" : "bg-tableOdd"}`}
                key={index}
                onClick={() =>
                  handleNavigate({
                    courseCode: code,
                    assName: assignment.name,
                  })
                }
              >
                <td className="py-3">{index + 1}</td>

                <td className="hidden py-3 lg:block">
                  {assignmentName} &nbsp;
                  <span className="text-xs">[click to view]</span>
                </td>

                <td className="flex items-center justify-center py-3 lg:hidden">
                  {assignmentName} &nbsp;
                  <span className="text-base">
                    <FaEye />
                  </span>
                </td>

                <td className="py-3 text-xs">
                  {FormatTime(assignment.created_at)}
                </td>

                <td className="py-3 text-xs">{FormatTime(dueDate)}</td>
              </tr>
            );
          })}
        </Table>
      ) : (
        <NoNotesOrAss label={"Assignments"} />
      )}
    </>
  );
}

export default AssignmentsPage;

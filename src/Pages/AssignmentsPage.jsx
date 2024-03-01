import { useRouteLoaderData } from "react-router";
import { FormatTime } from "../Actions/HelperActions";

function AssignmentsPage() {
  const { assignments } = useRouteLoaderData("courseData");
  console.log(assignments);

  return (
    <table
      className={`w-full divide-y  divide-stone-400 overflow-hidden border border-stone-400 p-4 text-center `}
    >
      <thead className=" bg-bellsBlue text-white">
        <tr className="divide-x divide-stone-400">
          <th className="py-3.5 text-sm lg:text-base">S/N</th>

          <th className="py-3.5 text-sm lg:text-base">Title</th>

          <th className="py-3.5 text-sm lg:text-base">Status</th>

          <th className="py-3.5 text-sm lg:text-base">Grade</th>

          <th className="py-3.5 text-sm lg:text-base">Due Date</th>
        </tr>
      </thead>

      <tbody className="divide-y divide-stone-400">
        {assignments.map((assignment, index) => {
          return (
            <tr
              className={`cursor-pointer divide-x divide-stone-400   transition-all duration-300 ease-in-out hover:bg-bellsBlue hover:text-white ${index % 2 ? "bg-tableEven" : "bg-tableOdd"}`}
              key={index}
            >
              <td className="py-3">{index + 1}</td>

              <td className="py-3">
                {assignment.name.split(".")[0]} &nbsp;
                <span className="text-xs">[click to view]</span>
              </td>

              <td className="py-3 text-sm">Submitted(Graded)</td>

              <td className="py-3 text-sm">0/30</td>

              <td className="py-3 text-sm">
                {FormatTime(assignment.created_at)}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default AssignmentsPage;

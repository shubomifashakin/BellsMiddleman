import { useRouteLoaderData } from "react-router";

function AssignmentsPage() {
  const { assignments } = useRouteLoaderData("courseData");
  console.log(assignments);
  return <div>Ass</div>;
}

export default AssignmentsPage;

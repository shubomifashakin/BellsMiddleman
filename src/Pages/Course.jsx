import { Outlet } from "react-router";

function Course() {
  return (
    <div>
      <p>courses</p>
      <Outlet />
    </div>
  );
}

export default Course;

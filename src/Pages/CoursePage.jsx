import { Outlet } from "react-router";

function CoursePage() {
  return (
    <div>
      <p>Courses</p>
      <Outlet />
    </div>
  );
}

export default CoursePage;

import { NavLink } from "react-router-dom";

export function CourseNavLink({ path }) {
  return (
    <NavLink
      to={`${path}`}
      className="text-white transition-all duration-300 hover:text-hoverText"
    >
      {path.replace("/", "")}
    </NavLink>
  );
}

import { NavLink } from "react-router-dom";

export function CourseNavLink({ path }) {
  return (
    <NavLink
      to={`${path}`}
      className="hover:text-hoverText text-white transition-all duration-300"
    >
      {path.replace("/", "")}
    </NavLink>
  );
}

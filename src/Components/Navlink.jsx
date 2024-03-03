import { NavLink } from "react-router-dom";

export function CourseNavLink({ path, label }) {
  return (
    <NavLink
      to={`${path}`}
      className="text-white transition-all duration-300 hover:text-hoverText"
    >
      {label}
    </NavLink>
  );
}

import { useNavigate } from "react-router";
import { LogOutFn } from "../Actions/SupabaseActions";

import { Button } from "./Button";
import { CourseNavLink } from "./Navlink";

export function Navbar({ children }) {
  const navigate = useNavigate();

  async function handleSignOut() {
    try {
      await LogOutFn();
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <nav className="row-span-1 bg-bellsBlue p-4 lg:col-span-1">
      <ul className="flex h-full items-center justify-between text-center text-sm lg:flex-col">
        <div className="flex basis-1/2  items-center justify-between  lg:flex-col lg:justify-normal lg:gap-10">
          <li>
            <CourseNavLink path={"/Home"} />
          </li>

          {children}
        </div>

        <div className="flex basis-1/2 items-end justify-end">
          <li>
            <Button
              label={"Log Out"}
              action={handleSignOut}
              fontSize="sm"
              bg={false}
              type="text"
            ></Button>
          </li>
        </div>
      </ul>
    </nav>
  );
}

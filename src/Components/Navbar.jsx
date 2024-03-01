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
    <nav className="row-span-1 bg-bellsBlue px-6 py-4 lg:col-span-1 lg:px-4">
      {/*navbar for small displays */}
      <ul className="flex items-center justify-between lg:hidden">
        <li>
          <CourseNavLink path={"/Home"} />
        </li>

        {children}

        <li>
          <Button
            label={"Log Out"}
            action={handleSignOut}
            fontSize="sm"
            bg={false}
            type="text"
          ></Button>
        </li>
      </ul>

      {/**only for large displays */}
      <ul className="hidden h-full flex-col items-center justify-between text-center text-sm lg:flex">
        <div className="flex basis-1/2  flex-col items-center gap-10">
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

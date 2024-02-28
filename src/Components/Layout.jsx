import { Outlet } from "react-router";

function Layout() {
  return (
    <div className="grid h-auto w-full grid-cols-1 grid-rows-[0.05fr_1fr] lg:grid-cols-[0.2fr_1fr] lg:grid-rows-1 ">
      <Outlet />
    </div>
  );
}

export default Layout;

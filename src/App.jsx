import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Components/Layout";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Course from "./Pages/Course";
import Assignments from "./Pages/Assignments";
import Notes from "./Pages/Notes";

const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { element: <Layout />, children: [{ path: "home", element: <Home /> }] },
  {
    path: "/:code",
    element: <Course />,
    children: [
      { path: "assignments", element: <Assignments /> },
      { path: "notes", element: <Notes /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Components/Layout";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Course from "./Pages/Course";
import Assignments from "./Pages/Assignments";
import Notes from "./Pages/Notes";
import { Toaster } from "react-hot-toast";

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
  return (
    <>
      <RouterProvider router={router} />
      <Toaster
        toastOptions={{
          success: {
            duration: 5 * 1000,
            style: {
              background: "#abf7b1",
            },
          },
          error: {
            duration: 10 * 1000,
            style: {
              background: "#ff6865",
            },
          },
        }}
      />
    </>
  );
}

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { Toaster } from "react-hot-toast";

import LoginPage from "./Pages/LoginPage";
import HomePage from "./Pages/HomePage";
import CoursePage from "./Pages/CoursePage";
import AssignmentsPage from "./Pages/AssignmentsPage";
import NotesPage from "./Pages/NotesPage";
import ForgotPassswordPage from "./Pages/ForgotPassswordPage";

import Layout from "./Components/Layout";

const router = createBrowserRouter([
  { path: "/", element: <LoginPage /> },
  { path: "forgotPassword", element: <ForgotPassswordPage /> },
  { element: <Layout />, children: [{ path: "home", element: <HomePage /> }] },
  {
    path: "/:code",
    element: <CoursePage />,
    children: [
      { path: "assignments", element: <AssignmentsPage /> },
      { path: "notes", element: <NotesPage /> },
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

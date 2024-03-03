import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

import { Toaster } from "react-hot-toast";

import LoginPage from "./Pages/LoginPage";
import HomePage, { HomeLoader } from "./Pages/HomePage";
import CoursePage, { CourseLoader } from "./Pages/CoursePage";
import AssignmentsPage from "./Pages/AssignmentsPage";
import NotesPage from "./Pages/NotesPage";
import ForgotPassswordPage from "./Pages/ForgotPassswordPage";

import Layout from "./Components/Layout";
import ProtectedRoute from "./Components/ProtectedRoute";
import SubmissionsPage from "./Pages/SubmissionsPage";
import { GetStudentsData } from "./Actions/SupabaseActions";

const router = createBrowserRouter([
  { path: "/", element: <LoginPage /> },
  { path: "forgotPassword", element: <ForgotPassswordPage /> },
  {
    element: <Layout />,
    children: [
      {
        path: "home",
        loader: HomeLoader,
        element: (
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/:code",
        loader: CourseLoader,
        id: "courseData",
        element: (
          <ProtectedRoute>
            <CoursePage />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <Navigate replace to={"notes"} /> },
          { path: "assignments", element: <AssignmentsPage /> },
          { path: "notes", element: <NotesPage /> },
        ],
      },
      {
        path: "submissions/:code/:assName",
        loader: GetStudentsData,
        element: <SubmissionsPage />,
      },
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
            duration: 1000 * 5,
            style: {
              background: "#ff6865",
            },
          },
        }}
      />
    </>
  );
}

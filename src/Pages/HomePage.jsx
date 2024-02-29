import { GetStudentsData } from "../Actions/SupabaseActions";
import { useLoaderData, useNavigate } from "react-router";
import { sortArrayBasedOnLetters } from "../Actions/HelperActions";
import { Navbar } from "../Components/Navbar";

function HomePage() {
  const { courses, matric_no, college, dept } = useLoaderData();

  const navigate = useNavigate();

  const courses2 = sortArrayBasedOnLetters(JSON.parse(courses));

  return (
    <>
      <Navbar />

      <main className="row-span-2  space-y-2 overflow-y-auto bg-primaryBgColor  p-4 ">
        <div className="flex flex-col space-y-2 text-sm underline lg:flex-row lg:items-center lg:justify-between">
          <span>Matric No: {matric_no}</span>
          <span>College: {college}</span>
          <span>Department: {dept}</span>
        </div>

        <h2 className="text-sm font-semibold underline lg:text-left">
          Courses Offered:
        </h2>

        <table className=" w-full  divide-y divide-stone-400 border border-stone-400 p-4 text-center ">
          <thead className="bg-bellsBlue text-white">
            <tr className="divide-x divide-stone-400">
              <th className="py-3.5">S/N</th>
              <th className="py-3.5">Course</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-stone-400">
            {courses2.map((course, index) => {
              return (
                <tr
                  className="cursor-pointer divide-x divide-stone-400   transition-all duration-300 ease-in-out hover:bg-bellsBlue hover:text-white"
                  onClick={() => navigate(`/${course}`)}
                  key={index}
                >
                  <td className="py-3">{index + 1}</td>
                  <td className="py-3">{course}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </main>
    </>
  );
}

export async function HomeLoader() {
  const studData = await GetStudentsData();
  return studData[0];
}

export default HomePage;

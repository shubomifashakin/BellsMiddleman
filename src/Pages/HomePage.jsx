import { useEffect, useState } from "react";
import { GetStudentsData } from "../Actions/SupabaseActions";

function HomePage() {
  const [studentsInfo, setStudentsInfo] = useState({});

  console.log(studentsInfo);
  useEffect(function () {
    async function getStudentsInfo() {
      try {
        const studData = await GetStudentsData();
        setStudentsInfo(studData[0]);
      } catch (err) {
        console.log(err);
      }
    }

    getStudentsInfo();
  }, []);
  return <div>Home</div>;
}

export default HomePage;

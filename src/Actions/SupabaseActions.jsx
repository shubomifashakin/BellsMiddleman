import { supabase } from "../supabase";

export async function SignUpUser(details) {
  const { email, password, college, dept, matricNo, courses } = details;

  let { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        courses: JSON.stringify(courses),
        college,
        matricNo,
        dept,
      },
    },
  });

  if (error?.message) throw error;
}

export async function LogInUser(email, password) {
  let { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error?.message) throw error;
}

export async function FindCourse(course, abortSignal) {
  let { data: Courses, error } = await supabase
    .from("Courses")
    .select("course_code")
    .ilike("course_code", `%${course}%`)
    .order("course_code", { ascending: true })
    .abortSignal(abortSignal.signal);

  if (error?.message) throw new Error(error.message);

  return Courses;
}

export async function GetColleges() {
  let { data: Colleges, error } = await supabase
    .from("Colleges")
    .select("*")
    .order("college", { ascending: true });

  if (error) throw error;

  return Colleges;
}

export async function ResetPassword(email) {
  let { data, error } = await supabase.auth.resetPasswordForEmail(email);
}

export async function GetStudentsData() {
  let { data: Students, error } = await supabase
    .from("Students")
    .select("college,matric_no,dept,courses,created_at");
  if (error?.message) throw error;

  return Students;
}

export async function LogOutFn() {
  let { error } = await supabase.auth.signOut();

  if (error?.message) throw error;
}

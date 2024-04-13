import { supabase } from "../supabase";

export async function SignUpUser(details) {
  const { email, password, college, dept, matricNo, courses } = details;

  let { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        courses,
        college,
        matricNo,
        dept,
        role: "student",
      },
      emailRedirectTo: "https://student-bellscommsportal.netlify.app/",
    },
  });

  if (error?.message) throw error;
}

export async function LogInUser(email, password) {
  let { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error?.message) throw error;

  return data;
}

export async function CheckRole() {
  let { data: user_roles, error } = await supabase
    .from("user_roles")
    .select("role");

  if (error?.message) throw error;

  return user_roles;
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
  let { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: "https://student-bellscommsportal.netlify.app/updatePassword",
  });

  if (error?.message) throw error;
}

export async function UpdatePassword(password) {
  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error?.message) throw error;
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

export async function UpdateCourses(courses) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("Students")
    .update({ courses })
    .eq("user_id", user.id);

  if (error?.message) {
    throw error;
  }
}

export async function UploadAssignment(details) {
  const { courseCode, matric_no, dept, file, assName, college } = details;

  const { error } = await supabase.storage
    .from("Courses")
    .upload(
      `${courseCode}/assignments/submissions/${assName}/${matric_no.replaceAll("/", "-")}-${college}-${dept}`,
      file,
      {
        cacheControl: "3600",
        upsert: false,
      },
    );

  if (error?.message) throw error;
}

export async function GetListOfAllFilesInFolder(path) {
  const { data, error } = await supabase.storage.from("Courses").list(path, {
    offset: 0,
    sortBy: { column: "name", order: "asc" },
  });

  if (error?.message) throw error;

  return data;
}

export async function FileExists({ filePath, fileName }) {
  const { data, error } = await supabase.storage
    .from("Courses")
    .list(filePath, {
      offset: 0,
      sortBy: { column: "name", order: "asc" },
      search: fileName,
    });

  if (error?.message) throw error;

  return data;
}

export async function DownloadFile(filePath) {
  const { data, error } = await supabase.storage
    .from("Courses")
    .download(filePath);

  if (error?.message) throw error;

  return data;
}

import { supabase } from "../supabase";

export async function SignUpUser(email, password) {
  let { _, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error?.message) throw error;
}

export async function LogInUser(email, password) {
  let { _, error } = await supabase.auth.signInWithPassword({
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

import { supabase } from "../supabase";

export async function SignUpUser(email, password) {
  let { _, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;
}

export async function LogInUser(email, password) {
  let { _, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
}

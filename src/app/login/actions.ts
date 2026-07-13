"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export type LoginState = {
  error?: string;
  success?: boolean;
} | null;

export async function login(prevState: LoginState, formData: FormData): Promise<LoginState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "이메일과 비밀번호를 모두 입력해 주세요." };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    let message = error.message;
    if (message === "Invalid login credentials") {
      message = "이메일 또는 비밀번호가 올바르지 않습니다.";
    }
    return { error: message };
  }

  redirect("/diaries");
}

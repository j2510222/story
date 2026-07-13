"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export type SignupState = {
  error?: string;
  success?: boolean;
} | null;

export async function signup(prevState: SignupState, formData: FormData): Promise<SignupState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const displayName = formData.get("displayName") as string;

  if (!email || !password || !displayName) {
    return { error: "모든 필드를 입력해 주세요." };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/diaries");
}

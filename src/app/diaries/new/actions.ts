"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type CreateDiaryState = {
  error?: string;
} | null;

export async function createDiary(prevState: CreateDiaryState, formData: FormData): Promise<CreateDiaryState> {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  if (!title || title.trim() === "") {
    return { error: "제목을 입력해 주세요." };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "로그인이 필요합니다." };
  }

  const entryDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  const { error } = await supabase.from("diaries").insert({
    user_id: user.id,
    title,
    content,
    entry_date: entryDate,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/diaries");
  redirect("/diaries");
}

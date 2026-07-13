"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type UpdateDiaryState = {
  error?: string;
} | null;

export async function updateDiary(
  id: string,
  prevState: UpdateDiaryState,
  formData: FormData
): Promise<UpdateDiaryState> {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  if (!title || title.trim() === "") {
    return { error: "제목을 입력해 주세요." };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("diaries")
    .update({
      title,
      content,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/diaries");
  revalidatePath(`/diaries/${id}`);
  redirect(`/diaries/${id}`);
}

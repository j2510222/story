"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteDiary(id: string) {
  if (!id) {
    throw new Error("올바르지 않은 일기 ID입니다.");
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("diaries")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/diaries");
  redirect("/diaries");
}

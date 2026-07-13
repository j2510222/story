"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { DIARY_TEMPLATES } from "@/utils/diaryTemplates";

export type CreateDiaryState = {
  error?: string;
} | null;

export async function createDiary(prevState: CreateDiaryState, formData: FormData): Promise<CreateDiaryState> {
  const title = formData.get("title") as string;
  const mood = formData.get("mood") as string || null;
  const weather = formData.get("weather") as string || null;
  const rawTags = formData.get("tags") as string || "";
  const isFavorite = formData.get("isFavorite") === "true";
  const templateType = formData.get("templateType") as string || "free";

  if (!title || title.trim() === "") {
    return { error: "제목을 입력해 주세요." };
  }

  const tags = rawTags
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);

  let templateData: Record<string, string> = {};
  let content = "";

  if (templateType !== "free") {
    const template = DIARY_TEMPLATES.find((t) => t.type === templateType);
    if (template) {
      const parts: string[] = [];
      template.questions.forEach((q) => {
        const val = (formData.get(q.key) as string) || "";
        templateData[q.key] = val;
        if (val.trim()) {
          parts.push(`Q. ${q.label}\nA. ${val}`);
        }
      });
      content = parts.join("\n\n");
    }
  } else {
    content = formData.get("content") as string || "";
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "로그인이 필요합니다." };
  }

  const entryDate = new Date().toISOString().split("T")[0];

  const { data: newDiary, error } = await supabase
    .from("diaries")
    .insert({
      user_id: user.id,
      title,
      content,
      entry_date: entryDate,
      mood,
      weather,
      tags,
      template_type: templateType,
      template_data: templateData,
      is_favorite: isFavorite,
    })
    .select("id")
    .single();

  if (error || !newDiary) {
    return { error: error?.message || "일기 저장에 실패했습니다." };
  }

  const rawImagePaths = formData.get("imagePaths") as string || "[]";
  const rawImageUrls = formData.get("imageUrls") as string || "[]";
  
  try {
    const imagePaths = JSON.parse(rawImagePaths) as string[];
    const imageUrls = JSON.parse(rawImageUrls) as string[];

    if (imagePaths.length > 0) {
      const imageInserts = imagePaths.map((path, idx) => ({
        diary_id: newDiary.id,
        user_id: user.id,
        storage_path: path,
        public_url: imageUrls[idx] || null,
        sort_order: idx,
      }));

      const { error: imgError } = await supabase
        .from("diary_images")
        .insert(imageInserts);

      if (imgError) {
        return { error: `이미지 정보 매핑 오류: ${imgError.message}` };
      }
    }
  } catch (err: any) {
    return { error: `이미지 처리 오류: ${err.message || err}` };
  }

  revalidatePath("/diaries");
  redirect("/diaries");
}

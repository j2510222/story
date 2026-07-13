"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { DIARY_TEMPLATES } from "@/utils/diaryTemplates";

export type UpdateDiaryState = {
  error?: string;
} | null;

export async function updateDiary(
  id: string,
  prevState: UpdateDiaryState,
  formData: FormData
): Promise<UpdateDiaryState> {
  const title = formData.get("title") as string;
  const mood = formData.get("mood") as string || null;
  const weather = formData.get("weather") as string || null;
  const rawTags = formData.get("tags") as string || "";
  const isFavorite = formData.get("isFavorite") === "true";
  const templateType = formData.get("templateType") as string || "free";

  if (!title || title.trim() === "") {
    return { error: "제목을 입력해 주세요." };
  }

  const tags = Array.from(
    new Set(
      rawTags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)
    )
  );

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

  const { error } = await supabase
    .from("diaries")
    .update({
      title,
      content,
      mood,
      weather,
      tags,
      template_type: templateType,
      template_data: templateData,
      is_favorite: isFavorite,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  const rawImagePaths = formData.get("imagePaths") as string || "[]";
  const rawImageUrls = formData.get("imageUrls") as string || "[]";

  try {
    const imagePaths = JSON.parse(rawImagePaths) as string[];
    const imageUrls = JSON.parse(rawImageUrls) as string[];

    await supabase
      .from("diary_images")
      .delete()
      .eq("diary_id", id);

    if (imagePaths.length > 0) {
      const imageInserts = imagePaths.map((path, idx) => ({
        diary_id: id,
        user_id: user.id,
        storage_path: path,
        public_url: imageUrls[idx] || null,
        sort_order: idx,
      }));

      const { error: imgError } = await supabase
        .from("diary_images")
        .insert(imageInserts);

      if (imgError) {
        return { error: `이미지 수정 매핑 오류: ${imgError.message}` };
      }
    }
  } catch (err: any) {
    return { error: `이미지 수정 처리 오류: ${err.message || err}` };
  }

  revalidatePath("/diaries");
  revalidatePath(`/diaries/${id}`);
  redirect(`/diaries/${id}`);
}

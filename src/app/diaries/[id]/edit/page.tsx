import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import EditForm from "./EditForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditDiaryPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: diary, error } = await supabase
    .from("diaries")
    .select("id, title, content, mood, weather, tags, is_favorite, template_type, template_data, diary_images(storage_path, public_url)")
    .eq("id", id)
    .single();

  if (error || !diary) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#fbfcf8] text-stone-900 flex flex-col">
      <EditForm diary={diary} />
    </main>
  );
}

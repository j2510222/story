import { createClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit2, Trash2, Calendar } from "lucide-react";
import { deleteDiary } from "./actions";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DiaryDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch the specific diary entry
  const { data: diary, error } = await supabase
    .from("diaries")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !diary) {
    notFound();
  }

  const formattedDate = new Date(diary.entry_date).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  // Bind the diary ID to the delete server action
  const deleteDiaryWithId = deleteDiary.bind(null, id);

  return (
    <main className="min-h-screen bg-[#fbfcf8] text-stone-900 flex flex-col">
      {/* Top Bar */}
      <header className="border-b border-stone-200 bg-white sticky top-0 z-10">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-4 py-4 sm:px-6">
          <Link
            href="/diaries"
            className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-955 transition text-sm font-medium"
          >
            <ArrowLeft className="size-4" />
            목록으로
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href={`/diaries/${id}/edit`}
              className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-stone-250 bg-white px-3.5 text-sm font-semibold text-stone-700 shadow-sm hover:bg-stone-50 transition"
            >
              <Edit2 className="size-4" />
              수정
            </Link>

            <form action={deleteDiaryWithId} onSubmit={
              // Add a basic confirmation prompt
              `return confirm("이 일기를 정말 삭제하시겠습니까? 삭제된 일기는 복구할 수 없습니다.");` as any
            }>
              <button
                type="submit"
                className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-rose-50 border border-rose-200 px-3.5 text-sm font-semibold text-rose-700 shadow-sm hover:bg-rose-100 transition"
              >
                <Trash2 className="size-4" />
                삭제
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Content Area */}
      <article className="flex-1 mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
        <div className="flex items-center gap-2 text-sm text-stone-500 font-medium mb-6">
          <Calendar className="size-4 text-emerald-800" />
          <span>{formattedDate}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-stone-950 tracking-tight leading-tight mb-8 pb-4 border-b border-stone-200">
          {diary.title}
        </h1>

        <div className="text-stone-850 text-base sm:text-lg leading-9 whitespace-pre-wrap break-words">
          {diary.content || (
            <span className="text-stone-400 italic">내용이 비어 있는 일기입니다.</span>
          )}
        </div>
      </article>
    </main>
  );
}

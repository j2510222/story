import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit2, Trash2, Calendar, Heart } from "lucide-react";
import { deleteDiary } from "./actions";
import { MOODS, WEATHERS, DIARY_TEMPLATES } from "@/utils/diaryTemplates";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DiaryDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: diary, error } = await supabase
    .from("diaries")
    .select("id, title, content, mood, weather, tags, is_favorite, template_type, template_data, entry_date, diary_images(storage_path, public_url)")
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

  const deleteDiaryWithId = deleteDiary.bind(null, id);

  const moodObj = MOODS.find((m) => m.value === diary.mood);
  const weatherObj = WEATHERS.find((w) => w.value === diary.weather);
  const currentTemplate = DIARY_TEMPLATES.find((t) => t.type === diary.template_type);

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
        {/* Date & Favorite Heart */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 text-sm text-stone-500 font-medium">
            <Calendar className="size-4 text-emerald-800" />
            <span>{formattedDate}</span>
          </div>

          {diary.is_favorite && (
            <div className="flex items-center gap-1 text-xs font-semibold text-rose-600 bg-rose-50 px-2.5 py-1.5 rounded-lg border border-rose-150 shadow-sm">
              <Heart className="size-3.5 fill-current" />
              <span>즐겨찾기</span>
            </div>
          )}
        </div>

        {/* Mood and Weather Badges */}
        {(moodObj || weatherObj) && (
          <div className="flex flex-wrap gap-2 mb-6">
            {moodObj && (
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium ${moodObj.color}`}>
                <span>{moodObj.emoji}</span>
                <span>오늘 {moodObj.label}</span>
              </span>
            )}
            {weatherObj && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-sky-150 bg-sky-50 text-sky-850 text-xs font-medium">
                <span>{weatherObj.emoji}</span>
                <span>날씨 {weatherObj.label}</span>
              </span>
            )}
          </div>
        )}

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-stone-955 tracking-tight leading-tight mb-8 pb-4 border-b border-stone-200">
          {diary.title}
        </h1>

        {/* Attachment Images Gallery */}
        {diary.diary_images && diary.diary_images.length > 0 && (
          <div className="grid gap-4 mb-8 sm:grid-cols-2 lg:grid-cols-3">
            {diary.diary_images.map((img: any) => (
              <a
                key={img.storage_path}
                href={img.public_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-video sm:aspect-square rounded-xl overflow-hidden border border-stone-200 shadow-sm bg-stone-50"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.public_url}
                  alt="첨부 이미지"
                  className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                />
              </a>
            ))}
          </div>
        )}

        {/* Body Content */}
        {diary.template_type !== "free" && currentTemplate && diary.template_data ? (
          <div className="space-y-6">
            {currentTemplate.questions.map((q) => {
              const answer = diary.template_data[q.key] || "";
              if (!answer.trim()) return null;

              return (
                <div key={q.key} className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
                  <h2 className="text-sm font-semibold text-emerald-800 mb-2">
                    Q. {q.label}
                  </h2>
                  <p className="text-stone-850 text-base leading-8 whitespace-pre-wrap break-words">
                    {answer}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-stone-850 text-base sm:text-lg leading-9 whitespace-pre-wrap break-words">
            {diary.content || (
              <span className="text-stone-400 italic">내용이 비어 있는 일기입니다.</span>
            )}
          </div>
        )}

        {/* Tags footer */}
        {diary.tags && diary.tags.length > 0 && (
          <div className="mt-12 pt-6 border-t border-stone-200">
            <div className="flex flex-wrap gap-1.5">
              {diary.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-lg bg-stone-100 border border-stone-200 px-2.5 py-1 text-xs font-medium text-stone-600"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>
    </main>
  );
}

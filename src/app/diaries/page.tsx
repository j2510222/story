import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { signout } from "./actions";
import Link from "next/link";
import { LogOut, PenLine, Plus, Calendar, BookOpen, Heart } from "lucide-react";
import { MOODS, WEATHERS } from "@/utils/diaryTemplates";

export default async function DiariesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const displayName = user.user_metadata?.display_name || user.email;

  const { data: diaries, error } = await supabase
    .from("diaries")
    .select("*, diary_images(public_url, sort_order)")
    .order("entry_date", { ascending: false })
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-[#fbfcf8] text-stone-900 flex flex-col">
      {/* Header */}
      <header className="border-b border-stone-200 bg-white sticky top-0 z-10">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-lg bg-emerald-800 text-white shadow">
              <PenLine className="size-4" />
            </span>
            <span className="text-base font-semibold text-emerald-900">오늘의 방</span>
          </div>

          <div className="flex items-center gap-5">
            <span className="hidden sm:inline text-sm font-medium text-stone-600">
              {displayName}님
            </span>
            <form action={signout}>
              <button
                type="submit"
                className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-stone-200 bg-white px-3 text-sm font-medium text-stone-600 transition hover:bg-stone-50 hover:text-stone-900"
              >
                <LogOut className="size-4" />
                로그아웃
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="flex-1 mx-auto w-full max-w-5xl px-5 py-8 sm:py-12 sm:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-stone-955">
              나의 일기장
            </h1>
            <p className="mt-1 text-sm text-stone-600">
              차분히 기록해 온 지나간 하루들의 문장들입니다.
            </p>
          </div>

          <Link
            href="/diaries/new"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-emerald-800 px-4 text-sm font-semibold text-white shadow hover:bg-emerald-700 transition"
          >
            <Plus className="size-4" />
            새 일기 쓰기
          </Link>
        </div>

        {error && (
          <div className="rounded-lg bg-rose-50 p-4 border border-rose-200 mb-6">
            <p className="text-sm text-rose-800 font-medium">
              일기를 불러오는 도중 오류가 발생했습니다: {error.message}
            </p>
          </div>
        )}

        {!diaries || diaries.length === 0 ? (
          <div className="rounded-xl border border-dashed border-stone-300 p-16 text-center bg-white shadow-sm flex flex-col items-center justify-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-800 mb-4">
              <BookOpen className="size-6" />
            </div>
            <h2 className="text-lg font-semibold text-stone-955">일기장이 비어 있습니다</h2>
            <p className="mt-2 text-sm text-stone-600 max-w-sm">
              오늘 있었던 작은 생각이나 기억하고 싶은 순간을 일기장에 처음으로 담아 보세요.
            </p>
            <Link
              href="/diaries/new"
              className="mt-6 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-emerald-800 px-5 text-sm font-semibold text-white shadow hover:bg-emerald-700 transition"
            >
              <Plus className="size-4" />
              첫 일기 작성하기
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {diaries.map((diary) => {
              const formattedDate = new Date(diary.entry_date).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              });

              const moodObj = MOODS.find((m) => m.value === diary.mood);
              const weatherObj = WEATHERS.find((w) => w.value === diary.weather);

              const mainImage = diary.diary_images && diary.diary_images.length > 0
                ? [...diary.diary_images].sort((a: any, b: any) => a.sort_order - b.sort_order)[0]
                : null;

              return (
                <Link
                  key={diary.id}
                  href={`/diaries/${diary.id}`}
                  className="group relative flex flex-col justify-between rounded-xl border border-stone-200 bg-white p-5 shadow-sm transition hover:border-emerald-600 hover:shadow-md"
                >
                  <div className="flex gap-4 items-start justify-between w-full">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-3.5">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-1 text-[11px] text-stone-500 font-medium">
                            <Calendar className="size-3.5" />
                            <span>{formattedDate}</span>
                          </div>
                          {(moodObj || weatherObj) && (
                            <div className="flex gap-1.5">
                              {moodObj && (
                                <span className="inline-block text-xs" title={`오늘의 감정: ${moodObj.label}`}>
                                  {moodObj.emoji}
                                </span>
                              )}
                              {weatherObj && (
                                <span className="inline-block text-xs" title={`오늘의 날씨: ${weatherObj.label}`}>
                                  {weatherObj.emoji}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {diary.is_favorite && (
                          <span className="text-rose-500" title="즐겨찾기">
                            <Heart className="size-4 fill-current" />
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-semibold text-stone-955 group-hover:text-emerald-900 transition line-clamp-1">
                        {diary.title}
                      </h3>
                      <p className="mt-2 text-sm text-stone-600 leading-6 line-clamp-3">
                        {diary.content || "본문 내용이 없습니다."}
                      </p>
                    </div>

                    {mainImage && (
                      <div className="size-20 rounded-lg overflow-hidden border border-stone-150 bg-stone-50 shrink-0 self-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={mainImage.public_url}
                          alt="대표 이미지"
                          className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                        />
                      </div>
                    )}
                  </div>

                  {diary.tags && diary.tags.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-stone-100 flex flex-wrap gap-1">
                      {diary.tags.slice(0, 3).map((tag: string) => (
                        <span key={tag} className="text-[10px] font-semibold text-stone-500">
                          #{tag}
                        </span>
                      ))}
                      {diary.tags.length > 3 && (
                        <span className="text-[10px] text-stone-400 font-medium">...</span>
                      )}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

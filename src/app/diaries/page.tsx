import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { signout } from "./actions";
import Link from "next/link";
import { LogOut, PenLine, Plus, Calendar, BookOpen } from "lucide-react";

export default async function DiariesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const displayName = user.user_metadata?.display_name || user.email;

  // Fetch user diaries
  const { data: diaries, error } = await supabase
    .from("diaries")
    .select("*")
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
            <h1 className="text-2xl font-bold tracking-tight text-stone-950">
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
          /* Empty State */
          <div className="rounded-xl border border-dashed border-stone-300 p-16 text-center bg-white shadow-sm flex flex-col items-center justify-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-800 mb-4">
              <BookOpen className="size-6" />
            </div>
            <h2 className="text-lg font-semibold text-stone-950">일기장이 비어 있습니다</h2>
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
          /* Diary List */
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {diaries.map((diary) => {
              const formattedDate = new Date(diary.entry_date).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              });

              return (
                <Link
                  key={diary.id}
                  href={`/diaries/${diary.id}`}
                  className="group block rounded-xl border border-stone-200 bg-white p-5 shadow-sm transition hover:border-emerald-600 hover:shadow-md"
                >
                  <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium mb-3">
                    <Calendar className="size-3.5" />
                    <span>{formattedDate}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-stone-950 group-hover:text-emerald-900 transition line-clamp-1">
                    {diary.title}
                  </h3>
                  <p className="mt-2 text-sm text-stone-600 leading-6 line-clamp-3">
                    {diary.content || "본문 내용이 없습니다."}
                  </p>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

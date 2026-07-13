import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { signout } from "./actions";
import { LogOut, PenLine } from "lucide-react";

export default async function DiariesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const displayName = user.user_metadata?.display_name || user.email;

  return (
    <main className="min-h-screen bg-[#fbfcf8] text-stone-900">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8 border-b border-stone-200">
        <div className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-lg bg-emerald-800 text-white shadow">
            <PenLine className="size-4" />
          </span>
          <span className="text-base font-semibold text-emerald-900">오늘의 방</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-stone-600">
            {displayName}님 환영합니다
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
      </header>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <div className="rounded-xl border border-dashed border-stone-300 p-12 text-center bg-white">
          <h2 className="text-xl font-semibold text-stone-950">일기 목록 준비 중</h2>
          <p className="mt-2 text-sm text-stone-600">
            인증 연동 및 미들웨어 세션 보호가 활성화되었습니다. 이제 안전하게 본인의 일기를 작성하고 관리할 수 있습니다.
          </p>
        </div>
      </section>
    </main>
  );
}

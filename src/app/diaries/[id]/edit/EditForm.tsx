"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { updateDiary, type UpdateDiaryState } from "./actions";

interface EditFormProps {
  diary: {
    id: string;
    title: string;
    content: string | null;
  };
}

export default function EditForm({ diary }: EditFormProps) {
  const updateDiaryWithId = updateDiary.bind(null, diary.id);

  const [state, formAction, isPending] = useActionState<UpdateDiaryState, FormData>(
    updateDiaryWithId,
    null
  );

  return (
    <form action={formAction} className="flex-1 flex flex-col">
      {/* Top bar */}
      <header className="border-b border-stone-200 bg-white sticky top-0 z-10">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-4 py-4 sm:px-6">
          <Link
            href={`/diaries/${diary.id}`}
            className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-955 transition text-sm font-medium"
          >
            <ArrowLeft className="size-4" />
            돌아가기
          </Link>

          <button
            type="submit"
            disabled={isPending}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-emerald-800 px-4 text-sm font-semibold text-white shadow hover:bg-emerald-700 disabled:opacity-50 transition"
          >
            <Check className="size-4" />
            {isPending ? "수정 중..." : "수정 완료"}
          </button>
        </div>
      </header>

      {/* Content area */}
      <section className="flex-1 mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 flex flex-col gap-6">
        {state?.error && (
          <div className="rounded-lg bg-rose-50 p-3 border border-rose-200">
            <p className="text-xs text-rose-800 font-medium">
              {state.error}
            </p>
          </div>
        )}

        <div className="space-y-4 flex-1 flex flex-col">
          <input
            type="text"
            name="title"
            defaultValue={diary.title}
            placeholder="제목을 입력하세요"
            required
            className="w-full text-3xl font-bold bg-transparent border-0 border-b border-transparent focus:border-stone-200 focus:outline-none placeholder-stone-400 pb-2 text-stone-955 transition"
          />
          <textarea
            name="content"
            defaultValue={diary.content || ""}
            placeholder="오늘 하루는 어떠셨나요? 마음의 한 줄을 남겨보세요..."
            className="w-full flex-1 min-h-[400px] bg-transparent border-0 focus:outline-none placeholder-stone-400 resize-none text-base leading-8 text-stone-850"
          />
        </div>
      </section>
    </form>
  );
}

"use client";

import { useActionState } from "react";
import Link from "next/link";
import { PenLine, ArrowLeft } from "lucide-react";
import { signup, type SignupState } from "./actions";

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState<SignupState, FormData>(
    signup,
    null
  );

  return (
    <main className="min-h-screen bg-[#fbfcf8] flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-stone-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        <Link href="/" className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-900 transition text-sm mb-6">
          <ArrowLeft className="size-4" />
          처음으로 돌아가기
        </Link>
        <div className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-lg bg-emerald-800 text-white shadow">
            <PenLine className="size-4" />
          </span>
          <span className="text-lg font-semibold text-emerald-900">오늘의 방</span>
        </div>
        <h2 className="mt-6 text-3xl font-bold tracking-tight text-stone-950">
          새로운 일기장 만들기
        </h2>
        <p className="mt-2 text-sm text-stone-600">
          나만의 조용한 기록 공간을 시작해 보세요.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-4 border border-stone-200 shadow-sm rounded-xl sm:px-10">
          <form action={formAction} className="space-y-6">
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-stone-700">
                이름 (닉네임)
              </label>
              <div className="mt-1">
                <input
                  id="displayName"
                  name="displayName"
                  type="text"
                  required
                  placeholder="홍길동"
                  className="block w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-900 placeholder-stone-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-stone-700">
                이메일 주소
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="your@email.com"
                  className="block w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-900 placeholder-stone-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-stone-700">
                비밀번호
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  placeholder="••••••••"
                  className="block w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-900 placeholder-stone-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 sm:text-sm"
                />
              </div>
            </div>

            {state?.error && (
              <div className="rounded-lg bg-rose-50 p-3 border border-rose-200">
                <p className="text-xs text-rose-800 font-medium">
                  {state.error}
                </p>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isPending}
                className="flex w-full justify-center rounded-lg bg-emerald-800 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {isPending ? "일기장 생성 중..." : "가입하고 시작하기"}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-stone-600">
              이미 계정이 있으신가요?{" "}
              <Link href="/login" className="font-semibold text-emerald-800 hover:text-emerald-700 underline">
                로그인하기
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

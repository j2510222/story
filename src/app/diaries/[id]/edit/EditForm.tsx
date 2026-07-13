"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Heart, HelpCircle } from "lucide-react";
import { updateDiary, type UpdateDiaryState } from "./actions";
import { MOODS, WEATHERS, DIARY_TEMPLATES } from "@/utils/diaryTemplates";
import ImageUploader from "@/components/ImageUploader";

interface EditFormProps {
  diary: {
    id: string;
    title: string;
    content: string | null;
    mood: string | null;
    weather: string | null;
    tags: string[];
    is_favorite: boolean;
    template_type: string;
    template_data: any;
    diary_images: any;
  };
}

export default function EditForm({ diary }: EditFormProps) {
  const updateDiaryWithId = updateDiary.bind(null, diary.id);

  const [state, formAction, isPending] = useActionState<UpdateDiaryState, FormData>(
    updateDiaryWithId,
    null
  );

  const [selectedMood, setSelectedMood] = useState<string | null>(diary.mood);
  const [selectedWeather, setSelectedWeather] = useState<string | null>(diary.weather);
  const [isFavorite, setIsFavorite] = useState<boolean>(diary.is_favorite);
  const [templateType, setTemplateType] = useState<string>(diary.template_type || "free");

  const currentTemplate = DIARY_TEMPLATES.find((t) => t.type === templateType);
  const initialTagsStr = diary.tags ? diary.tags.join(", ") : "";

  return (
    <form action={formAction} className="flex-1 flex flex-col">
      <input type="hidden" name="mood" value={selectedMood || ""} />
      <input type="hidden" name="weather" value={selectedWeather || ""} />
      <input type="hidden" name="isFavorite" value={isFavorite ? "true" : "false"} />
      <input type="hidden" name="templateType" value={templateType} />

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

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsFavorite(!isFavorite)}
              className={`flex size-9 items-center justify-center rounded-lg border transition ${
                isFavorite
                  ? "bg-rose-50 border-rose-250 text-rose-600"
                  : "bg-white border-stone-200 text-stone-400 hover:text-stone-600"
              }`}
              title="즐겨찾기"
            >
              <Heart className="size-4 fill-current" />
            </button>

            <button
              type="submit"
              disabled={isPending}
              className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-emerald-800 px-4 text-sm font-semibold text-white shadow hover:bg-emerald-700 disabled:opacity-50 transition"
            >
              <Check className="size-4" />
              {isPending ? "수정 중..." : "수정 완료"}
            </button>
          </div>
        </div>
      </header>

      {/* Content area */}
      <section className="flex-1 mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 flex flex-col gap-8">
        {state?.error && (
          <div className="rounded-lg bg-rose-50 p-3 border border-rose-200">
            <p className="text-xs text-rose-800 font-medium">{state.error}</p>
          </div>
        )}

        {/* Metadata Controls Card */}
        <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm space-y-6">
          {/* Template Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase text-stone-500 tracking-wider mb-2.5">
              글쓰기 템플릿
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {DIARY_TEMPLATES.map((t) => (
                <button
                  key={t.type}
                  type="button"
                  onClick={() => setTemplateType(t.type)}
                  className={`px-3 py-2.5 rounded-lg border text-sm font-medium transition text-left ${
                    templateType === t.type
                      ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                      : "bg-white border-stone-250 text-stone-600 hover:bg-stone-50"
                  }`}
                >
                  <div className="font-semibold">{t.title}</div>
                  <div className="text-[10px] text-stone-400 mt-1 line-clamp-1">{t.description}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {/* Mood Picker */}
            <div>
              <label className="block text-xs font-semibold uppercase text-stone-500 tracking-wider mb-2.5">
                오늘의 감정
              </label>
              <div className="flex flex-wrap gap-1.5">
                {MOODS.map((m) => (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() => setSelectedMood(selectedMood === m.value ? null : m.value)}
                    className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium transition ${
                      selectedMood === m.value
                        ? `${m.color} ring-1 ring-offset-1`
                        : "bg-white border-stone-200 text-stone-600 hover:bg-stone-50"
                    }`}
                  >
                    <span className="mr-1">{m.emoji}</span>
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Weather Picker */}
            <div>
              <label className="block text-xs font-semibold uppercase text-stone-500 tracking-wider mb-2.5">
                오늘의 날씨
              </label>
              <div className="flex flex-wrap gap-1.5">
                {WEATHERS.map((w) => (
                  <button
                    key={w.value}
                    type="button"
                    onClick={() => setSelectedWeather(selectedWeather === w.value ? null : w.value)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition ${
                      selectedWeather === w.value
                        ? "bg-sky-50 border-sky-300 text-sky-850 ring-1 ring-offset-1"
                        : "bg-white border-stone-200 text-stone-600 hover:bg-stone-50"
                    }`}
                  >
                    <span className="mr-1.5">{w.emoji}</span>
                    {w.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tags Input */}
          <div className="border-t border-stone-150 pt-5">
            <label htmlFor="tags" className="block text-xs font-semibold uppercase text-stone-500 tracking-wider mb-2.5">
              태그 (쉼표로 구분)
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              defaultValue={initialTagsStr}
              placeholder="예: 회고, 감사, 산책"
              className="block w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-900 placeholder-stone-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 text-sm"
            />
          </div>
        </div>

        {/* Image Uploader */}
        <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm">
          <ImageUploader initialImages={diary.diary_images || []} diaryId={diary.id} />
        </div>

        {/* Text Editor area */}
        <div className="space-y-6 flex-1 flex flex-col">
          <input
            type="text"
            name="title"
            defaultValue={diary.title}
            placeholder="제목을 입력하세요"
            required
            className="w-full text-3xl font-bold bg-transparent border-0 border-b border-transparent focus:border-stone-200 focus:outline-none placeholder-stone-400 pb-2 text-stone-955 transition"
          />

          {templateType !== "free" && currentTemplate ? (
            <div className="space-y-6 bg-white border border-stone-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-semibold mb-2">
                <HelpCircle className="size-4" />
                <span>템플릿 질문에 답하며 차분히 오늘을 기록해 보세요.</span>
              </div>
              {currentTemplate.questions.map((q) => {
                const existingVal =
                  diary.template_type === templateType && diary.template_data
                    ? diary.template_data[q.key] || ""
                    : "";

                return (
                  <div key={q.key} className="space-y-2">
                    <label htmlFor={q.key} className="block text-sm font-semibold text-stone-700">
                      {q.label}
                    </label>
                    <textarea
                      id={q.key}
                      name={q.key}
                      defaultValue={existingVal}
                      placeholder={q.placeholder}
                      className="w-full min-h-[90px] rounded-lg border border-stone-250 bg-stone-50/30 px-3 py-2.5 text-sm placeholder-stone-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-250/50 resize-none leading-7 text-stone-850 transition"
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <textarea
              name="content"
              defaultValue={diary.content || ""}
              placeholder="오늘 하루는 어떠셨나요? 마음의 한 줄을 남겨보세요..."
              className="w-full flex-1 min-h-[350px] bg-transparent border-0 focus:outline-none placeholder-stone-400 resize-none text-base leading-8 text-stone-850"
            />
          )}
        </div>
      </section>
    </form>
  );
}

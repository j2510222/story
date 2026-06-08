import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CloudSun,
  Heart,
  Image as ImageIcon,
  LockKeyhole,
  PenLine,
  Share2,
  Sparkles,
} from "lucide-react";

const diaryEntries = [
  {
    date: "06.08",
    title: "퇴근길에 남긴 문장",
    mood: "차분함",
    accent: "border-l-emerald-500",
  },
  {
    date: "06.07",
    title: "고마웠던 세 가지",
    mood: "감사",
    accent: "border-l-rose-500",
  },
  {
    date: "06.05",
    title: "비 오는 날의 생각",
    mood: "느림",
    accent: "border-l-sky-500",
  },
];

const features = [
  {
    icon: PenLine,
    title: "흐름을 막지 않는 작성",
    description: "자유 일기, 하루 회고, 감정 기록, 감사 일기를 상황에 맞게 고릅니다.",
  },
  {
    icon: CalendarDays,
    title: "날짜별 기록 정리",
    description: "오늘의 글부터 지난 계절의 문장까지 빠르게 다시 찾을 수 있습니다.",
  },
  {
    icon: ImageIcon,
    title: "사진과 함께 보관",
    description: "하루의 장면을 글 옆에 남겨 기억의 온도를 더 선명하게 붙잡습니다.",
  },
  {
    icon: Share2,
    title: "읽기 전용 공유",
    description: "보여주고 싶은 일기만 링크로 공유하고, 수정 권한은 나에게만 둡니다.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fbfcf8] text-stone-950">
      <section className="relative isolate overflow-hidden">
        <div
          className="absolute inset-0 -z-20 bg-cover"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=2400&q=85')",
            backgroundPosition: "center 42%",
          }}
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(12,16,14,0.88),rgba(24,29,24,0.66)_50%,rgba(30,28,22,0.32))]" />

        <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <Link href="/" className="flex items-center gap-2 text-white">
            <span className="flex size-9 items-center justify-center rounded-lg bg-white/14 ring-1 ring-white/25 backdrop-blur">
              <PenLine className="size-4" />
            </span>
            <span className="text-base font-semibold">오늘의 방</span>
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-medium text-white/78 md:flex">
            <a className="transition hover:text-white" href="#features">
              기능
            </a>
            <a className="transition hover:text-white" href="#templates">
              템플릿
            </a>
            <a className="transition hover:text-white" href="#privacy">
              공유
            </a>
          </nav>

          <Link
            href="/login"
            className="inline-flex h-9 items-center justify-center rounded-lg border border-white/25 bg-white/10 px-4 text-sm font-medium text-white backdrop-blur transition hover:bg-white/18"
          >
            로그인
          </Link>
        </header>

        <div className="mx-auto grid min-h-[calc(100svh-80px)] w-full max-w-7xl content-center gap-10 px-5 pb-10 pt-8 sm:px-8 lg:grid-cols-[minmax(0,0.96fr)_minmax(360px,0.72fr)] lg:items-center">
          <div className="max-w-3xl pb-4 pt-6 text-white">
            <p className="mb-5 inline-flex items-center gap-2 rounded-lg border border-white/18 bg-white/12 px-3 py-2 text-sm font-medium text-white/86 backdrop-blur">
              <Sparkles className="size-4 text-amber-200" />
              매일의 마음을 조용히 정리하는 일기장
            </p>
            <div className="mt-5 border-l border-emerald-200/70 pl-5 sm:pl-6">
              <h1 className="w-fit max-w-xl text-5xl font-medium leading-none tracking-normal text-white drop-shadow-sm sm:text-6xl lg:text-7xl">
                오늘의 방
              </h1>
              <p className="mt-4 text-base font-medium leading-7 text-emerald-50/90 sm:text-lg">
                오늘을 놓치지 않는 조용한 일기장
              </p>
            </div>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/82 sm:text-lg">
              복잡한 하루를 몇 줄의 문장과 사진, 감정 태그로 남겨보세요. 나만
              보는 기록부터 읽기 전용 공유까지 차분하게 이어지는 개인 일기장입니다.
            </p>

            <div className="mt-8 flex flex-col gap-3 min-[520px]:flex-row">
              <Link
                href="/signup"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-white px-5 text-sm font-semibold text-stone-950 shadow-sm transition hover:bg-emerald-50 min-[520px]:w-auto"
              >
                일기 시작하기
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/diaries"
                className="inline-flex h-12 items-center justify-center rounded-lg border border-white/24 bg-white/10 px-5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/18 min-[520px]:w-auto"
              >
                데모 둘러보기
              </Link>
            </div>
          </div>

          <div className="mb-4 w-full rounded-lg border border-white/18 bg-white/88 p-4 shadow-2xl shadow-black/25 backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <div>
                <p className="text-xs font-semibold uppercase text-emerald-700">
                  Today
                </p>
                <h2 className="mt-1 text-xl font-semibold text-stone-950">
                  오늘의 일기
                </h2>
              </div>
              <button
                type="button"
                aria-label="즐겨찾기"
                className="flex size-9 items-center justify-center rounded-lg bg-rose-50 text-rose-600"
              >
                <Heart className="size-4" />
              </button>
            </div>

            <div className="py-5">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-lg bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800">
                  차분함
                </span>
                <span className="rounded-lg bg-sky-100 px-3 py-1 text-xs font-medium text-sky-800">
                  흐림
                </span>
                <span className="rounded-lg bg-amber-100 px-3 py-1 text-xs font-medium text-amber-900">
                  회고
                </span>
              </div>
              <h3 className="mt-5 text-2xl font-semibold leading-tight text-stone-950">
                조금 늦게 걸어도 괜찮았던 날
              </h3>
              <p className="mt-4 text-sm leading-7 text-stone-600">
                퇴근길 공기가 선선했다. 해야 할 일은 아직 남아 있지만, 오늘은
                서두르지 않고 한 문장씩 정리하기로 했다.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="h-20 rounded-lg bg-emerald-100" />
              <div className="h-20 rounded-lg bg-stone-200" />
              <div className="h-20 rounded-lg bg-rose-100" />
            </div>

            <div className="mt-5 space-y-3">
              {diaryEntries.map((entry) => (
                <article
                  className={`border-l-4 ${entry.accent} rounded-r-lg bg-white px-4 py-3 shadow-sm`}
                  key={entry.title}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium text-stone-500">
                        {entry.date}
                      </p>
                      <h4 className="mt-1 text-sm font-semibold text-stone-900">
                        {entry.title}
                      </h4>
                    </div>
                    <span className="rounded-lg bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-600">
                      {entry.mood}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="px-5 py-16 sm:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-emerald-700">
              기록을 계속하게 만드는 기본기
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal text-stone-950 sm:text-4xl">
              쓰기, 찾기, 공유하기가 자연스럽게 이어집니다
            </h2>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm"
              >
                <feature.icon className="size-5 text-emerald-700" />
                <h3 className="mt-5 text-base font-semibold text-stone-950">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-stone-600">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="templates"
        className="border-y border-stone-200 bg-white px-5 py-16 sm:px-8 lg:py-20"
      >
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold text-rose-700">
              빈 페이지가 부담스럽지 않게
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal text-stone-950 sm:text-4xl">
              오늘의 상태에 맞는 질문으로 시작하세요
            </h2>
            <p className="mt-4 text-base leading-7 text-stone-600">
              자유롭게 쓰고 싶은 날도, 감정을 짚고 싶은 날도 있습니다. 오늘의 방은
              일기를 시작하는 첫 질문만 가볍게 건넵니다.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              "오늘 좋았던 순간은?",
              "지금 가장 필요한 것은?",
              "감사한 일 세 가지는?",
              "내일의 나에게 남길 말은?",
            ].map((question) => (
              <div
                key={question}
                className="rounded-lg border border-stone-200 bg-[#fbfcf8] p-5"
              >
                <CloudSun className="size-5 text-sky-700" />
                <p className="mt-5 text-lg font-semibold text-stone-950">
                  {question}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="privacy" className="px-5 py-16 sm:px-8 lg:py-20">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 rounded-lg bg-stone-950 p-6 text-white sm:p-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-400 text-stone-950">
              <LockKeyhole className="size-5" />
            </div>
            <h2 className="mt-5 text-3xl font-semibold tracking-normal">
              내 일기는 나에게만, 공유는 필요한 만큼만
            </h2>
            <p className="mt-4 text-base leading-7 text-white/70">
              계정별로 기록을 분리하고, 공유 링크는 읽기 전용으로 동작합니다.
              보여주고 싶은 글만 골라 조용히 전달하세요.
            </p>
          </div>
          <Link
            href="/signup"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-emerald-300 px-5 text-sm font-semibold text-stone-950 transition hover:bg-emerald-200 lg:self-end"
          >
            지금 시작하기
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}

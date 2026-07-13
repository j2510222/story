export interface TemplateQuestion {
  key: string;
  label: string;
  placeholder: string;
}

export interface DiaryTemplate {
  type: string;
  title: string;
  description: string;
  questions: TemplateQuestion[];
}

export const MOODS = [
  { value: "calm", label: "차분함", emoji: "😌", color: "bg-emerald-50 text-emerald-800 border-emerald-200" },
  { value: "happy", label: "기쁨", emoji: "😊", color: "bg-amber-50 text-amber-900 border-amber-250" },
  { value: "grateful", label: "감사", emoji: "🙏", color: "bg-rose-50 text-rose-800 border-rose-200" },
  { value: "tired", label: "피곤", emoji: "🥱", color: "bg-stone-100 text-stone-700 border-stone-300" },
  { value: "sad", label: "슬픔", emoji: "😢", color: "bg-blue-50 text-blue-800 border-blue-200" },
  { value: "angry", label: "화남", emoji: "😡", color: "bg-red-50 text-red-800 border-red-200" },
];

export const WEATHERS = [
  { value: "sunny", label: "맑음", emoji: "☀️" },
  { value: "cloudy", label: "흐림", emoji: "☁️" },
  { value: "rainy", label: "비", emoji: "🌧️" },
  { value: "snowy", label: "눈", emoji: "❄️" },
];

export const DIARY_TEMPLATES: DiaryTemplate[] = [
  {
    type: "free",
    title: "자유 일기",
    description: "오늘 하루 있었던 일들을 자유롭게 서술합니다.",
    questions: [],
  },
  {
    type: "review",
    title: "하루 회고",
    description: "오늘을 돌아보며 네 가지 질문에 답해봅니다.",
    questions: [
      { key: "whatHappened", label: "오늘 있었던 일", placeholder: "오늘 어떤 일들이 있었나요?" },
      { key: "goodThing", label: "좋았던 일", placeholder: "가장 보람차거나 즐거웠던 순간은 언제인가요?" },
      { key: "badThing", label: "아쉬웠던 일", placeholder: "아쉽거나 아쉬움이 남는 일은 무엇인가요?" },
      { key: "nextGoal", label: "내일 하고 싶은 일", placeholder: "내일은 어떤 일을 시도해보고 싶나요?" },
    ],
  },
  {
    type: "emotion",
    title: "감정 기록",
    description: "오늘 느낀 핵심적인 감정과 그 마음을 짚어봅니다.",
    questions: [
      { key: "todayEmotion", label: "오늘의 핵심 감정", placeholder: "어떤 감정이 마음을 채웠나요?" },
      { key: "emotionReason", label: "감정의 이유", placeholder: "그 감정이 일어난 특별한 배경이나 원인이 있을까요?" },
      { key: "helper", label: "나를 도와준 것", placeholder: "마음을 달래거나 나에게 힘이 되어준 것이 있나요?" },
      { key: "needNow", label: "지금 나에게 필요한 것", placeholder: "내 마음을 더 평온하게 만들기 위해 무엇이 필요할까요?" },
    ],
  },
  {
    type: "thanks",
    title: "감사 일기",
    description: "사소한 감사 세 가지를 찾아 차분히 기록해 봅니다.",
    questions: [
      { key: "thank1", label: "감사한 일 하나", placeholder: "첫 번째 감사한 순간을 남겨보세요." },
      { key: "thank2", label: "감사한 일 둘", placeholder: "두 번째 감사한 순간을 남겨보세요." },
      { key: "thank3", label: "감사한 일 셋", placeholder: "세 번째 감사한 순간을 남겨보세요." },
      { key: "todayLine", label: "오늘의 한 줄", placeholder: "오늘 하루를 한 문장으로 요약해 본다면?" },
    ],
  },
];

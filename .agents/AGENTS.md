# 프로젝트 에이전트 규칙 (Project Agent Rules)

이 파일은 이 프로젝트에서 AI 에이전트가 작업을 수행할 때 반드시 준수해야 하는 규칙과 가이드라인을 정의합니다.

---

## 1. 코딩 표준 및 네이밍 컨벤션 (Coding Standards & Naming Conventions)
- **TypeScript 사용 및 Strict 모드 준수**:
  - 모든 변수, 함수 매개변수, 반환 값에 명시적인 타입을 정의합니다. `any` 타입의 사용은 절대 금지하며, 불가피한 경우 `unknown`을 사용하고 타입 가드를 구성합니다.
  - 인터페이스는 `interface` 키워드를 주로 사용하고, 단순한 연합 타입이나 유틸리티 타입은 `type`을 사용합니다.
- **폴더 및 파일 네이밍 규칙**:
  - React 컴포넌트 파일 및 폴더: **PascalCase** (예: `DiaryCard.tsx`, `Navbar/`)
  - 일반 유틸리티, 헬퍼 함수, 훅(Hooks) 파일: **camelCase** (예: `formatDate.ts`, `useLocalStorage.ts`)
  - Next.js App Router 특수 파일: Next.js 컨벤션에 따라 소문자로 작성 (예: `page.tsx`, `layout.tsx`, `route.ts`, `loading.tsx`)
- **코드 스타일**:
  - React 컴포넌트는 Arrow Function을 사용한 함수형 컴포넌트 형태로 작성합니다.
  - 구조 분해 할당(Destructuring assignment)을 적극 활용하여 가독성을 높입니다.
  - 상수는 **UPPER_SNAKE_CASE**로 네이밍하며, 파일 상단 또는 별도의 상수 파일에 관리합니다.

---

## 2. 프레임워크 및 라이브러리 사용 가이드라인 (Framework & Library Guidelines)
- **Next.js 16 (App Router)**:
  - `src/app` 폴더 구조를 기반으로 라우팅을 수행합니다.
  - 기본적으로 모든 컴포넌트는 **서버 컴포넌트(Server Components)**로 작성합니다.
  - 상태 관리, Event Listener(`onClick` 등), 브라우저 전용 API(window, document)를 사용하는 경우에만 파일 최상단에 `"use client"` 지시어를 붙여 **클라이언트 컴포넌트(Client Components)**로 선언합니다.
- **Tailwind CSS v4 & 디자인 시스템**:
  - 스타일링 시 별도의 인라인 CSS를 지양하고 Tailwind CSS 유틸리티 클래스를 사용합니다.
  - 여러 클래스를 동적으로 합성할 때는 반드시 `src/lib/utils.ts`의 `cn` 헬퍼 함수 (`clsx`와 `tailwind-merge` 기반)를 사용합니다.
- **Supabase**:
  - 데이터베이스 통신은 `src/lib/supabase.ts`에 정의된 클라이언트를 활용합니다.
  - 클라이언트 사이드와 서버 사이드(API Routes, Server Components)의 실행 환경에 맞춰 Supabase 클라이언트 호출 방식을 준수합니다.

---

## 3. 답변 시 사용해야 하는 언어 및 태도 제약 (Language & Attitude Constraints)
- **언어 원칙**:
  - 모든 사용자 답변, 코드 주석, 생성하는 문서(Walkthrough, Implementation Plan 등)는 반드시 **한국어**로 작성합니다.
  - 코드 내 로그 메시지나 에러 메시지도 한국어로 친절하게 작성합니다. (단, 코드 내 변수명이나 라이브러리 함수명 등 개발 필수 영문은 제외)
- **태도 원칙**:
  - 정중하고 친절한 존댓말(해요체)을 사용합니다.
  - 사용자의 질문이나 이슈 보고에 대해 적극적으로 공감하고 명확한 원인 분석을 먼저 제공합니다.
  - 요구사항이 모호하거나 누락된 정보가 있는 경우, 자의적으로 판단하여 진행하기보다 질문을 통해 명확한 요구사항을 확인한 후 진행합니다.

---

## 4. 코드 수정 시 주의사항 및 테스트 준수 여부 (Code Modification & Testing)
- **코드 무결성 및 영향도 분석**:
  - 기존에 정상 동작하는 모듈이나 컴포넌트를 수정할 때, 다른 파일에 미칠 사이드 이펙트를 항상 확인합니다.
  - 불필요한 의존성이나 중복 코드가 추가되지 않도록 기존 라이브러리(예: Lucide Icons, shadcn UI)를 최대한 재사용합니다.
- **빌드 및 린트 검증**:
  - 코드 수정을 완료한 후에는 반드시 `npm run lint` 및 `npm run build`를 실행하여 컴파일 에러나 경고(Warning), ESLint 위반이 없는지 확인합니다.
- **동작 검증 (Testing)**:
  - 작성/수정한 기능이 의도한 대로 동작하는지 테스트 스크립트 실행 또는 브라우저 수동 검증을 통해 확실히 점검하고 그 결과를 요약하여 공유합니다.

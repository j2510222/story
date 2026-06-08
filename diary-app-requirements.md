# 일기장 앱 요구사항

## 개요

이 문서는 일기장 앱을 만들기 위한 초기 요구사항과 설계 방향을 정리한 문서다.

앱은 Next.js와 React로 만들고, Supabase를 인증, 데이터베이스, 이미지 저장소로 사용한다. 여러 사용자가 가입할 수 있으며, 각 사용자는 자기 일기만 관리할 수 있다. 사진 첨부, 읽기 전용 공유 링크, 글쓰기 템플릿을 처음 버전부터 포함한다.

## 확정 기술 스택

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase Auth
- Supabase Database
- Supabase Storage
- React Hook Form
- Zod

## 제품 방향

일기장은 매일 들어와서 편하게 쓸 수 있는 차분하고 개인적인 느낌이 좋아야 한다. 디자인은 무거운 대시보드보다는 미니멀하고 모바일 친화적인 방향을 추천한다.

글쓰기 화면에서는 방해 요소를 줄이고, 목록과 달력, 공유 화면은 빠르게 훑어볼 수 있게 구성한다.

## 사용자와 데이터 소유권

- 여러 사용자가 회원가입하고 로그인할 수 있다.
- 각 사용자는 자신의 일기만 소유한다.
- 사용자는 자기 일기만 생성, 조회, 수정, 삭제할 수 있다.
- 일기는 읽기 전용 공개 링크로 공유할 수 있다.
- 공유 링크를 가진 사람은 로그인하지 않아도 해당 일기를 볼 수 있다.
- 공유 링크 방문자는 일기를 수정하거나 삭제할 수 없다.

## MVP 기능

- 회원가입
- 로그인
- 로그아웃
- 일기 작성
- 내 일기 목록 보기
- 일기 상세 보기
- 일기 수정
- 일기 삭제
- 사진 첨부
- 감정, 날씨, 태그, 작성 날짜 저장
- 글쓰기 템플릿
- 날짜별 일기 보기
- 읽기 전용 공유 링크 생성
- 공유 링크 비활성화

## 추천 페이지 구조

```txt
/
- 로그인 전: 로그인 / 회원가입
- 로그인 후: 오늘의 일기 또는 일기 목록

/diaries
- 내 일기 목록

/diaries/new
- 새 일기 작성

/diaries/[id]
- 일기 상세
- 사진 갤러리
- 공유 링크 관리

/diaries/[id]/edit
- 일기 수정

/calendar
- 날짜별 일기 보기

/share/[token]
- 공개 읽기 전용 공유 페이지

/settings
- 프로필 및 계정 설정
```

## 일기 데이터 필드

일기 하나에는 아래 정보를 저장한다.

- 제목
- 본문
- 작성 날짜
- 감정
- 날씨
- 태그
- 템플릿 종류
- 템플릿별 입력 데이터
- 즐겨찾기 여부
- 생성 시간
- 수정 시간

## 글쓰기 템플릿

### 자유 일기

- 제목
- 본문

### 하루 회고

- 오늘 있었던 일
- 좋았던 일
- 아쉬웠던 일
- 내일 하고 싶은 일

### 감정 기록

- 오늘의 감정
- 감정의 이유
- 나를 도와준 것
- 지금 필요한 것

### 감사 일기

- 감사한 일 1
- 감사한 일 2
- 감사한 일 3
- 오늘의 한 줄

## 데이터베이스 설계

### profiles

인증된 사용자의 공개 프로필 정보를 저장한다.

```sql
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);
```

### diaries

일기 본문과 메타데이터를 저장한다.

```sql
create table diaries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  content text,
  entry_date date not null,
  mood text,
  weather text,
  tags text[] not null default '{}',
  template_type text not null default 'free',
  template_data jsonb not null default '{}'::jsonb,
  is_favorite boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

### diary_images

일기에 연결된 이미지 정보를 저장한다. 실제 이미지 파일은 Supabase Storage에 저장한다.

```sql
create table diary_images (
  id uuid primary key default gen_random_uuid(),
  diary_id uuid not null references diaries(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  storage_path text not null,
  public_url text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
```

### diary_share_links

일기 공유를 위한 읽기 전용 공개 링크를 저장한다.

```sql
create table diary_share_links (
  id uuid primary key default gen_random_uuid(),
  diary_id uuid not null references diaries(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  token text not null unique,
  is_active boolean not null default true,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);
```

## Supabase Storage

추천 버킷 이름:

```txt
diary-images
```

추천 저장 경로:

```txt
{user_id}/{diary_id}/{image_id}.{extension}
```

사용자와 일기별로 이미지가 묶이기 때문에 관리하기 쉽다.

## 보안과 RLS

Supabase Row Level Security는 처음 버전부터 활성화한다.

추천 접근 규칙:

- 사용자는 자기 프로필만 조회할 수 있다.
- 사용자는 자기 프로필만 수정할 수 있다.
- 사용자는 `user_id = auth.uid()`인 일기만 생성할 수 있다.
- 사용자는 자기 일기만 조회할 수 있다.
- 사용자는 자기 일기만 수정할 수 있다.
- 사용자는 자기 일기만 삭제할 수 있다.
- 사용자는 자기 일기에 연결된 이미지만 관리할 수 있다.
- 사용자는 자기 일기의 공유 링크만 생성하거나 비활성화할 수 있다.
- 공개 공유 페이지는 활성화된 공유 링크와 연결된 일기만 읽을 수 있어야 한다.

## 공유 링크 동작

- 사용자는 일기 상세 화면에서 공유 링크를 만들 수 있다.
- 생성된 링크는 아래 형태를 사용한다.

```txt
/share/{token}
```

- 링크를 가진 사람은 해당 일기를 읽을 수 있다.
- 공개 방문자는 수정, 삭제, 작성자 전용 기능을 사용할 수 없다.
- 작성자는 공유 링크를 비활성화할 수 있다.
- 만료일은 나중에 추가할 수 있다. 기본값은 만료 없음으로 두고, 7일 또는 30일 같은 옵션을 추가하는 방식이 좋다.

## 추천 구현 순서

1. Next.js 프로젝트를 만들고 UI 의존성을 설치한다.
2. Supabase 클라이언트 헬퍼와 환경변수를 설정한다.
3. Supabase 테이블, Storage 버킷, RLS 정책을 만든다.
4. 인증 페이지와 세션 처리를 구현한다.
5. 일기 작성, 목록, 상세, 수정, 삭제 흐름을 만든다.
6. 이미지 업로드와 일기 이미지 표시를 추가한다.
7. 템플릿 기반 일기 작성 폼을 추가한다.
8. 달력 또는 날짜 필터 화면을 추가한다.
9. 공유 링크 생성과 공개 공유 페이지를 추가한다.
10. 반응형 UI와 빈 상태, 로딩 상태, 에러 상태를 다듬는다.

## 남은 결정 사항

- 공유 링크에 기본 만료일을 둘지 여부
- 공개 공유 페이지에서 모든 이미지를 보여줄지, 선택한 이미지만 보여줄지 여부
- MVP에서 달력 화면을 월간 달력으로 만들지, 간단한 날짜 필터 목록으로 시작할지 여부
- AI 회고 질문, 주간 요약 같은 기능을 추후에 추가할지 여부

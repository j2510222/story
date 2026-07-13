import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set({ name, value, ...options }));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake can write to cookies after the
  // headers have been sent.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isDiariesPath = request.nextUrl.pathname.startsWith("/diaries");
  const isAuthPath = request.nextUrl.pathname.startsWith("/login") || request.nextUrl.pathname.startsWith("/signup");

  if (!user && isDiariesPath) {
    // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (user && isAuthPath) {
    // 이미 로그인한 경우 다이어리 목록으로 리다이렉트
    const url = request.nextUrl.clone();
    url.pathname = "/diaries";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

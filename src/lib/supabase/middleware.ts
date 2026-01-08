import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest, initialResponse?: NextResponse) {
    let response = initialResponse ?? NextResponse.next({
        request: {
            headers: request.headers,
        },
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
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    );

                    // Only create a new response if we don't have an initial one.
                    // If we have an initialResponse (e.g. from next-intl), we should rely on it
                    // (whether it's a redirect or a rewrite) and just append cookies to it.
                    if (!initialResponse) {
                        response = NextResponse.next({
                            request,
                        });
                    }

                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Check for admin path, ignoring locale prefix (e.g. /pt/admin -> /admin)
    // Regex matches optional locale code at start (e.g. /en, /pt) followed by /admin
    const isAdminPath = /^\/([a-z]{2}\/)?admin/.test(request.nextUrl.pathname);
    const isLoginPage = /^\/([a-z]{2}\/)?admin\/login/.test(request.nextUrl.pathname);

    if (isAdminPath && !user && !isLoginPage) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    if (isLoginPage && user) {
        return NextResponse.redirect(new URL("/admin", request.url));
    }

    return response;
}

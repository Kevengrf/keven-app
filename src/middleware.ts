import createMiddleware from 'next-intl/middleware';
import { type NextRequest } from "next/server";
import { updateSession } from "./lib/supabase/middleware";
import { routing } from "./i18n/routing";

const handleI18nRouting = createMiddleware(routing);

export async function middleware(request: NextRequest) {
    const response = handleI18nRouting(request);
    const finalResponse = await updateSession(request, response);
    return finalResponse;
}

export const config = {
    matcher: [
        "/",
        "/(pt|en)/:path*",
        "/((?!_next/static|_next/image|favicon.ico|manifest.json|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"
    ],
};

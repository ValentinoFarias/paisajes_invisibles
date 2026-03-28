import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Exclude /studio from next-intl so Sanity Studio loads without locale prefix
  matcher: ["/((?!api|trpc|_next|_vercel|studio|.*\\..*).*)"],
};

import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const selected = cookieStore.get("locale")?.value;
  const locale = selected === "en" ? "en" : "pt-PT";
  return {
    locale,
    timeZone: "Europe/Lisbon",
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});

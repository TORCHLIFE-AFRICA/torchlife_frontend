import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LandingPageExperience } from "@/src/components/landingPage/LandingPageExperience";

export default async function Home() {
  const cookieStore = await cookies();
  const hasSession =
    Boolean(cookieStore.get("accessToken")?.value) ||
    Boolean(cookieStore.get("refreshToken")?.value);

  if (hasSession) {
    redirect("/dashboard");
  }

  return <LandingPageExperience />;
}

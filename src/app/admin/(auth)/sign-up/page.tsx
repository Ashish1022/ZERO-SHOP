import { SignupView } from "@/modules/auth/ui/views/signup-view";
import { caller } from "@/trpc/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic"

const SignupPage = async () => {
  const session = await caller.auth.session();

  if (session.user) redirect("/admin/dashboard");

  return <SignupView />;
};

export default SignupPage;

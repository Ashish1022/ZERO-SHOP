import { SigninView } from "@/modules/auth/ui/views/signin-view";
import { caller } from "@/trpc/server";
import { redirect } from "next/navigation";

const SigninPage = async () => {
  const session = await caller.auth.session();

  if (session.user) redirect("/admin/dashboard");

  return <SigninView />;
};

export default SigninPage;

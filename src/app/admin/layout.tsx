import { caller } from "@/trpc/server";
import { redirect } from "next/navigation";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await caller.auth.session();
  // if (!session.user) redirect("/");
  // if (session.user.role === "customer") redirect("/");

  return <>{children}</>;
};

export default AdminLayout;

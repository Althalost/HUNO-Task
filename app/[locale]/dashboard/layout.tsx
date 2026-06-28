import { PlanProvider } from "@/lib/contexts/PlanContext";
import { auth } from "@clerk/nextjs/server";

export default async function DashboardLayour({
  children,
}: {
  children: React.ReactNode;
}) {
  const { has } = await auth();
  const hasProPlan = has({ plan: "pro_user" });
  return <PlanProvider hasProPlan={hasProPlan}>{children}</PlanProvider>;
}

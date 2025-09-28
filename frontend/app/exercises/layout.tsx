import DashboardLayout from '../dashboard/layout';

export default function ExercisesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
import DashboardLayout from '../dashboard/layout';

export default function WorkoutsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
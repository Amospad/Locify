import Navbar from '@/components/layout/Navbar';

export default function OperadorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="operador-shell min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
    </div>
  );
}

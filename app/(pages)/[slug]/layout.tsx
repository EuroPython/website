export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="max-w-[80ch] mx-auto">{children}</div>;
}

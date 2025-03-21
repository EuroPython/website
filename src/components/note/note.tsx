export const Note = ({ children }: { children: React.ReactNode }) => {
  return (
    <p className="note text-xl p-4 border-l-4 border-primary bg-primary-light my-6">
      {children}
    </p>
  );
};

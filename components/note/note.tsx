export const Note = ({ children }: { children: string }) => {
  return <p className="note text-xl p-4 border-l-4 border-primary">{children}</p>;
};

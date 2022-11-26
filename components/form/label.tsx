export const Label = ({
  children,
  htmlFor,
}: {
  children: React.ReactNode;
  htmlFor: string;
}) => {
  return (
    <label htmlFor={htmlFor} className="block font-bold mb-4 pl-3 text-lg">
      {children}
    </label>
  );
};

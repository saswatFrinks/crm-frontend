export default function Heading({ children, subcontent }) {
  return (
    <div className="flex items-center bg-white gap-4 px-10 py-7  shadow-sm">
      <div className="text-3xl font-semibold">{children}</div>
      <div className="flex items-center gap-4">{subcontent}</div>
    </div>
  );
}

export default function InputFile({ value, ...props }) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="file"
        className="inline-block text-sm text-slate-500 file:mr-4 file:rounded-full file:border-0 file:bg-violet-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-violet-700
      hover:file:bg-violet-100"
        {...props}
      />
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11 1L1 11M1 1L11 11"
          stroke="#0E0F0F"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

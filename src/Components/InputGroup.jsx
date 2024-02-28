export function InputGroup({ label, children }) {
  return (
    <div className="flex flex-col space-y-1.5">
      <label htmlFor={label} className="text-base font-normal">
        {label}
      </label>

      {children}
    </div>
  );
}

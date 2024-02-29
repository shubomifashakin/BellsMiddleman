export function Button({
  action,
  label,
  type = "small",
  fontSize = "md",
  bg = true,
}) {
  return action ? (
    <button
      onClick={action}
      type="button"
      className={`font-base block self-end ${type === "full" ? "w-full p-2" : ""} rounded-sm ${fontSize === "sm" ? "text-sm" : ""} ${fontSize === "md" ? "text-base" : ""} ${fontSize === "lg" ? "text-lg" : ""} ${bg ? "bg-bellsBlue hover:bg-hoverBellsBlue" : "hover:text-hoverText"} ${type === "small" ? "px-5  py-1.5" : ""} text-center text-base text-white transition-all duration-300 ease-in-out `}
    >
      {label}
    </button>
  ) : (
    <button
      type="submit"
      className={`font-base block self-end ${type === "full" ? "w-full p-2" : ""} rounded-sm ${fontSize === "sm" ? "text-sm" : ""} ${fontSize === "md" ? "text-base" : ""} ${fontSize === "lg" ? "text-lg" : ""} ${bg ? "bg-bellsBlue hover:bg-hoverBellsBlue" : "hover:text-hoverText"} ${type === "small" ? "px-5  py-1.5" : ""} ${type === "text" ? "p-0" : ""} text-center text-base text-white transition-all duration-300 ease-in-out `}
    >
      {label}
    </button>
  );
}

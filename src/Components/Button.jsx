export function Button({ action, label, type = "small" }) {
  return action ? (
    <button
      onClick={action}
      type="button"
      className="font-base  block rounded-sm bg-bellsBlue p-1.5 text-center text-base text-white duration-300 hover:bg-hoverBellsBlue"
    >
      {label}
    </button>
  ) : (
    <button
      type="submit"
      className={`font-base block self-end ${type === "full" ? "w-full p-2" : ""} rounded-sm bg-bellsBlue ${type === "small" ? "px-5  py-1.5" : ""} text-center text-base text-white duration-300 hover:bg-hoverBellsBlue`}
    >
      {label}
    </button>
  );
}

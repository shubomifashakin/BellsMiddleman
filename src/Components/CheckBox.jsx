export function CheckBox({ setChecked, checked }) {
  return (
    <span
      onClick={() => setChecked((c) => !c)}
      className={`group relative flex w-14 cursor-pointer rounded-full border border-stone-500 bg-white px-1.5 py-1 transition-all duration-300 ease-in-out `}
    >
      <span
        className={`hover:bg-sideColor group-hover:bg-sideColor bg-bellsBlue group-hover:bg-hoverBellsBlue block  h-5 w-5 cursor-pointer rounded-full transition-all duration-300 ease-in-out  ${
          checked ? "translate-x-full" : "translate-x-0"
        }`}
      ></span>
    </span>
  );
}

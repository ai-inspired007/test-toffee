type SecondaryButtonWrapperProps = {
  children?: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function SecondaryButtonWrapper({
  children,
  ...buttonProps
}: SecondaryButtonWrapperProps) {
  return (
    <button
      {...buttonProps}
      className={`bg-bg-3 w-full rounded-3xl px-3 py-1 ${buttonProps.className ?? ""}`}
    >
      {children}
    </button>
  );
}

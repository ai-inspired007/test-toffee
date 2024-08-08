type RightSidebarSubtitleProps = {
  label: string;
  value: string;
};

export function RightSidebarSubtitle({
  label,
  value,
}: RightSidebarSubtitleProps) {
  return (
    <div className="flex flex-row justify-center space-x-1">
      <span className="text-sm font-normal leading-snug text-neutral-500">
        {label}
      </span>
      <span className="text-sm font-normal leading-snug text-zinc-400">
        {value}
      </span>
    </div>
  );
}

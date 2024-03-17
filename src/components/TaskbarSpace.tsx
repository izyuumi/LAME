import { twMerge as tm } from "tailwind-merge";

function TitlebarSpace({
  className,
  children,
}: Readonly<{
  className?: string;
  children?: React.ReactNode;
}>) {
  return (
    <div data-tauri-drag-region className={tm("h-8 w-full", className)}>
      {children}
    </div>
  );
}

export default TitlebarSpace;

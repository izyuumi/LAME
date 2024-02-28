import { useEffect, useRef } from "react";
import { twMerge as tm } from "tailwind-merge";

const ContextMenuWrapper = ({
  children,
  position,
  show,
  setShow,
}: {
  children: React.ReactNode;
  position: {
    x: number;
    y: number;
  };
  show: boolean;
  setShow: (show: boolean) => void;
}) => {
  const contextMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        contextMenuRef.current &&
        !contextMenuRef.current.contains(e.target as Node)
      ) {
        setShow(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <div
      ref={contextMenuRef}
      className="flex flex-col items-start rounded-md bg-gray-500 p-3"
      style={{
        position: "fixed",
        left: position.x,
        top: position.y,
        display: show ? "flex" : "none",
      }}
    >
      {children}
    </div>
  );
};

const ContextMenuItem = ({
  children,
  onClick,
  disabled,
  className,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}) => {
  return (
    <button
      className={tm("", className)}
      onClick={disabled ? undefined : onClick}
    >
      {children}
    </button>
  );
};

export { ContextMenuWrapper, ContextMenuItem };

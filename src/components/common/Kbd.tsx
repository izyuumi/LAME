import { CommandIcon } from "lucide-react";

const Kbd = ({
  k,
}: {
  /**
   * The key to display
   *
   * @example "k"
   * @example "ctrl"
   */
  k: string;
}) => {
  k = k.toLowerCase();
  if (k.length === 1) {
    return <kbd className="kbd">{k}</kbd>;
  }

  let icon: React.ReactNode;

  switch (k) {
    case "ctrl":
      k = "⌃";
      break;
    case "shift":
      k = "⇧";
      break;
    case "alt":
      k = "⌥";
      break;
    case "mod":
      icon = <CommandIcon size={12} />;
      break;
    case "meta":
      icon = <CommandIcon size={12} />;
      break;
    case "comma":
      k = ",";
      break;
  }

  return <kbd className="kbd text-md">{icon ?? k}</kbd>;
};

export default Kbd;

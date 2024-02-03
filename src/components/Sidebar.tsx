import { useSidebar } from "@/hooks";
import { Settings, Vault } from "lucide-react";

function Sidebar() {
  const { sidebarIsOpen } = useSidebar();

  return (
    <>
      {sidebarIsOpen !== "closed" && (
        <div className="h-screen bg-base-200 flex flex-col">
          <div className="h-full" />
          <ul className="menu text-base-content p-1">
            <SidebarItem icon={<Vault size={16} />} text="Vault" />
            <SidebarItem icon={<Settings size={16} />} text="Settings" />
          </ul>
        </div>
      )}
    </>
  );
}

function SidebarItem({
  icon,
  text,
  onClick,
}: {
  icon: React.ReactNode;
  text: string;
  onClick?: () => void;
}) {
  return (
    <li onClick={onClick} className="tooltip tooltip-right" data-tip={text}>
      <span className="p-2">{icon}</span>
    </li>
  );
}

export default Sidebar;

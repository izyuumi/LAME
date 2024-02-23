import { useSidebar } from "@/hooks";
import { useSettings } from "@/hooks/useSettings";
import { Settings, Vault } from "lucide-react";
import TitlebarSpace from "@/components/TaskbarSpace";
import { useRef } from "react";
import VaultPrompt from "./VaultPrompt";

function Sidebar() {
  const { sidebarIsOpen } = useSidebar();
  const { openSettings } = useSettings();

  const vaultPromptRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      {sidebarIsOpen !== "closed" && (
        <div className="bg-base-200 flex flex-col">
          <TitlebarSpace />
          <div className="flex-1" />
          <ul className="menu text-base-content p-1">
            <SidebarItem
              icon={<Vault size={16} />}
              text="Vault"
              onClick={() => {
                vaultPromptRef.current?.showModal();
              }}
            />
            <SidebarItem
              icon={<Settings size={16} />}
              text="Settings"
              onClick={openSettings}
            />
          </ul>
        </div>
      )}
      <VaultPrompt dialogRef={vaultPromptRef} />
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

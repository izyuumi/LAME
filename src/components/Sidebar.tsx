import { useCmdk, useSettings } from "@/hooks";
import { Settings, Vault } from "lucide-react";
import TitlebarSpace from "@/components/TaskbarSpace";
import { useRef } from "react";
import VaultPrompt from "./VaultPrompt";
import { shortcutKeysToString } from "./common/Kbd";

function Sidebar() {
  const { openSettings } = useSettings();
  const { setInterfaceContext, findCmdkCommand } = useCmdk();

  const vaultPromptRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <div className="bg-base-200 flex flex-col">
        <TitlebarSpace />
        <div className="flex-1" />
        <ul className="menu text-base-content p-1">
          <SidebarItem
            icon={<Vault size={16} />}
            text="Vault"
            onClick={() => {
              vaultPromptRef.current?.showModal();
              setInterfaceContext("vault-prompt");
              const firstFocusable = vaultPromptRef.current?.querySelector(
                "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
              ) as HTMLElement;
              firstFocusable?.blur();
            }}
          />
          <SidebarItem
            icon={<Settings size={16} />}
            text={`Settings ${shortcutKeysToString(
              findCmdkCommand("openSettings")?.key ?? ""
            )}`}
            onClick={openSettings}
          />
        </ul>
      </div>
      <VaultPrompt dialogRef={vaultPromptRef} />
    </>
  );
}

function SidebarItem({
  icon,
  text,
  onClick,
}: Readonly<{
  icon: React.ReactNode;
  text: string;
  onClick?: () => void;
}>) {
  return (
    <li>
      <button
        onClick={onClick}
        className="tooltip tooltip-right"
        data-tip={text}
      >
        <span className="p-2">{icon}</span>
      </button>
    </li>
  );
}

export default Sidebar;

import { type Command, useCmdk } from "@/hooks";
import { useRecordHotkeys } from "react-hotkeys-hook";
import Kbd from "../common/Kbd";
import { useEffect } from "react";

function SettingsShortcuts() {
  const { cmdkCommands } = useCmdk();

  return (
    <>
      <ul>
        <h2 className="text-lg py-2 font-semibold">Shortcuts</h2>
        {Object.entries(cmdkCommands).map(([id, command]) => (
          <SettingsShortcutsItem key={id} id={id} command={command} />
        ))}
      </ul>
    </>
  );
}

const modifiers = ["ctrl", "shift", "alt", "meta"];

const SettingsShortcutsItem = ({
  id,
  command,
}: {
  id: string;
  command: Command;
}) => {
  const [keys, { start, stop, isRecording }] = useRecordHotkeys();
  const { addCmdkCommand } = useCmdk();

  useEffect(() => {
    if (
      keys.size > 0 &&
      !Array.from(keys).every((key) => modifiers.includes(key))
    ) {
      stop();
      addCmdkCommand(id, { ...command, key: Array.from(keys).join("+") });
    }
  }, [keys]);

  return (
    <li className="flex justify-between h-12 items-center">
      <p>{command.label}</p>
      <button
        onClick={() => {
          if (isRecording) {
            stop();
          } else {
            start();
          }
        }}
      >
        {isRecording
          ? Array.from(keys).map((key) => <Kbd key={key} k={key} />)
          : command.key.split("+").map((key) => <Kbd key={key} k={key} />)}
      </button>
    </li>
  );
};

export default SettingsShortcuts;

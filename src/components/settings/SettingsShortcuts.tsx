import { type Command, useCmdk, useConfig } from "@/hooks";
import { useRecordHotkeys } from "react-hotkeys-hook";
import Kbd from "@/components/common/Kbd";
import { useEffect } from "react";
import { Disc } from "lucide-react";
import { KeymapIdentifier } from "@/hooks";

function SettingsShortcuts() {
  const { cmdkCommands } = useCmdk();

  return (
    <ul>
      <h2 className="text-lg py-2 font-semibold">Shortcuts</h2>
      {Object.entries(cmdkCommands).map(([id, command]) => (
        <SettingsShortcutsItem
          key={id}
          id={id as KeymapIdentifier}
          command={command}
        />
      ))}
    </ul>
  );
}

const modifiers = ["ctrl", "shift", "alt", "meta"];

const SettingsShortcutsItem = ({
  id,
  command,
}: {
  id: KeymapIdentifier;
  command: Command;
}) => {
  const [keys, { start, stop, isRecording, resetKeys }] = useRecordHotkeys();
  const { addCmdkCommand } = useCmdk();
  const { updateConfig } = useConfig();

  const update = async () => {
    await updateConfig(`keymaps.${id}`, Array.from(keys).join("+"));
    addCmdkCommand(id, { ...command, key: Array.from(keys).join("+") });
  };

  useEffect(() => {
    if (keys.has("escape")) {
      resetKeys();
      stop();
      return;
    }
    if (
      !(
        keys.size > 0 &&
        !Array.from(keys).every((key) => modifiers.includes(key))
      )
    ) {
      return;
    }
    stop();
    update();
  }, [keys]);

  return (
    <li className="flex justify-between h-12 items-center">
      <div className="flex gap-4 items-center">
        <p>{command.label}</p>
        {isRecording && (
          <div className="tooltip" data-tip="Click to stop recording">
            <button onClick={stop}>
              <Disc size={16} color="red" />
            </button>
          </div>
        )}
      </div>
      <div
        className="tooltip tooltip-left"
        data-tip="Click to customize shortcut"
      >
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
            ? Array.from(keys).map(
                (key) => key !== "escape" && <Kbd key={key} k={key} />
              )
            : command.key.split("+").map((key) => <Kbd key={key} k={key} />)}
        </button>
      </div>
    </li>
  );
};

export default SettingsShortcuts;

import { useVault } from "@/hooks";
import { RefObject } from "react";

function VaultPrompt({
  dialogRef,
}: {
  dialogRef: RefObject<HTMLDialogElement>;
}) {
  const { closeVault } = useVault();

  return (
    <dialog ref={dialogRef} className="modal">
      <div className="modal-box border-primary flex flex-col gap-4 border border-solid">
        <h2>Are you sure you want to close this vault?</h2>
        <p>You will always be able to reopen it later.</p>
        <div className="flex justify-between">
          <button
            className="btn bg-red-800"
            onClick={() => {
              dialogRef.current?.close();
              closeVault();
            }}
          >
            Close Vault
          </button>
          <button
            className="btn bg-blue-700"
            onClick={() => dialogRef.current?.close()}
          >
            Cancel
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close settings modal</button>
      </form>
    </dialog>
  );
}

export default VaultPrompt;

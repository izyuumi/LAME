import { getVersion } from "@tauri-apps/api/app";
import { useQuery } from "@tanstack/react-query";
import { Github } from "lucide-react";
import { open } from "@tauri-apps/api/shell";

function SettingsGeneral() {
  const { data: appVersion } = useQuery({
    queryKey: ["appVersion"],
    queryFn: async () => await getVersion(),
  });

  return (
    <>
      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text">Pick a theme</span>
        </div>
        <select
          className="select select-bordered w-full max-w-xs"
          data-choose-theme
          data-key="user-theme"
          id="user-theme"
        >
          <option value="black">Black</option>
          <option value="wireframe">Wireframe</option>
        </select>
      </label>
      <div className="divider" />
      <div className="flex items-center justify-center gap-4">
        <button
          className="btn btn-ghost btn-sm btn-circle"
          onClick={() =>
            open("https://github.com/izyuumi/LAME/releases/latest")
          }
          aria-label="Go to GitHub Repository for LAME"
        >
          <Github size={20} />
        </button>
        <p>Version: v{appVersion}</p>
      </div>
    </>
  );
}

export default SettingsGeneral;

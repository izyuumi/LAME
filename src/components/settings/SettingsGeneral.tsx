function SettingsGeneral() {
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
        >
          <option value="black">Black</option>
          <option value="wireframe">Wireframe</option>
        </select>
      </label>
    </>
  );
}

export default SettingsGeneral;

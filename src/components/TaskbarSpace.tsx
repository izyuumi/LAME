function TitlebarSpace({ children }: { children?: React.ReactNode }) {
  return (
    <div data-tauri-drag-region className="h-8">
      {children}
    </div>
  );
}

export default TitlebarSpace;

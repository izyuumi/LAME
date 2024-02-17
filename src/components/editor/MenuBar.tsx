import { type Editor } from "@tiptap/react";
import {
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Italic,
  Pilcrow,
  Strikethrough,
  Underline,
} from "lucide-react";
import { useState } from "react";
import { twMerge as tm } from "tailwind-merge";
import { Level } from "@tiptap/extension-heading";

const buttonClass = (active?: boolean) =>
  tm("hover:bg-primary p-1 rounded-md", active && "bg-base-300");

const MenuBar = ({ editor }: { editor: Editor }) => {
  const styles: {
    id: string;
    label: React.ReactNode;
    active: boolean;
    onClick: () => void;
  }[] = [
    {
      id: "bold",
      label: <Bold />,
      active: editor.isActive("bold"),
      onClick: () => editor.chain().focus().toggleBold().run(),
    },
    {
      id: "italic",
      label: <Italic />,
      active: editor.isActive("italic"),
      onClick: () => editor.chain().focus().toggleItalic().run(),
    },
    {
      id: "underline",
      label: <Underline />,
      active: editor.isActive("underline"),
      onClick: () => editor.chain().focus().toggleUnderline().run(),
    },
    {
      id: "strike",
      label: <Strikethrough />,
      active: editor.isActive("strike"),
      onClick: () => editor.chain().focus().toggleStrike().run(),
    },
  ];

  return (
    <div className="overflow-hidden rounded-md">
      <HeaderDropdown editor={editor} className={buttonClass()} />
      {styles.map((style) => (
        <button
          key={style.id}
          className={buttonClass(style.active)}
          onClick={style.onClick}
        >
          {style.label}
        </button>
      ))}
    </div>
  );
};

export default MenuBar;

const HeaderDropdown = ({
  editor,
  className,
}: {
  editor: Editor;
  className: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const DropdownButton = () => {
    if (editor.isActive("paragraph")) {
      return <Pilcrow />;
    } else if (editor.isActive("heading", { level: 1 })) {
      return <Heading1 />;
    } else if (editor.isActive("heading", { level: 2 })) {
      return <Heading2 />;
    } else if (editor.isActive("heading", { level: 3 })) {
      return <Heading3 />;
    } else if (editor.isActive("heading", { level: 4 })) {
      return <Heading4 />;
    } else if (editor.isActive("heading", { level: 5 })) {
      return <Heading5 />;
    } else if (editor.isActive("heading", { level: 6 })) {
      return <Heading6 />;
    } else {
      return <Pilcrow />;
    }
  };

  return (
    <>
      <button className={className} onClick={() => setIsOpen((prev) => !prev)}>
        <DropdownButton />
      </button>
      <div
        className={tm(
          "bg-base-300 absolute z-10 overflow-hidden rounded-md p-1",
          isOpen ? "block" : "hidden",
        )}
      >
        <button
          className={buttonClass()}
          onClick={() => editor.commands.setParagraph()}
          aria-label="Paragraph"
        >
          <Pilcrow />
        </button>
        {[Heading1, Heading2, Heading3, Heading4, Heading5, Heading6].map(
          (Icon, i) => (
            <button
              key={i}
              className={buttonClass()}
              aria-label={`Heading ${i + 1}`}
              onClick={() =>
                editor.commands.setHeading({
                  level: (i + 1) as Level,
                })
              }
            >
              <Icon />
            </button>
          ),
        )}
      </div>
    </>
  );
};

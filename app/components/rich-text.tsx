import { memo } from "react";

export type RichTextProps = {
  text?: string;
  className?: string;
  as?: React.ElementType;
};

export function RawRichText(props: RichTextProps) {
  const { text = "", className, as } = props;

  if (!text) {
    return null;
  }

  const Comp = as || "p";

  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  
  return (
    <Comp className={className}>
      {parts.map((part, index) => {
        if (part.match(urlRegex)) {
          return (
            <a
              className="hover:underline text-blue-600"
              key={index}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
            >
              {part}
            </a>
          );
        }
        return part;
      })}
    </Comp>
  );
}

export const RichText = memo(RawRichText);

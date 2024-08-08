import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Button } from "./ui/button";
import { toast } from "./ui/use-toast";
import { Copy } from "lucide-react";

import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

const onCopy = (text: string) => {
  if (!text) {
    return;
  }
  navigator.clipboard.writeText(text);
  toast({
    description: "Code copied to clipboard.",
  });
};

export const CodeRender = ({ text }: { text: string }) => {
  return (
    <>
      <Markdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        className="max-w-full text-wrap [&_p]:!whitespace-normal [&_p]:!text-wrap lg:[&_p]:max-w-full"
        components={{
          code(props) {
            const { children, className, node, ...rest } = props;
            const match = /language-(\w+)/.exec(className || "");
            return match ? (
              <div className="my-2 flex flex-col flex-nowrap">
                <div className="-mb-[0.5rem] flex items-center justify-between rounded-t-md bg-[#181818] px-2 py-0.5 pl-3">
                  <p className="text-xs text-white/80">{match[1]}</p>
                  <Button
                    onClick={() => onCopy(children?.toString() || "")}
                    className="p-0"
                    size="icon"
                    variant="ghost"
                  >
                    <Copy className="h-4 w-4 text-white/80" />
                  </Button>
                </div>
                <div className="max-w-full">
                  <SyntaxHighlighter
                    className="rounded-b-md [&_code]:!whitespace-pre"
                    PreTag="div"
                    language={match[1]}
                    style={vscDarkPlus}
                  >
                    {String(children)}
                  </SyntaxHighlighter>
                </div>
              </div>
            ) : (
              <code {...rest} className={className}>
                {children}
              </code>
            );
          },
        }}
      >
        {text}
      </Markdown>
    </>
  );
};

import type { MDXComponents } from "mdx/types";

const components: MDXComponents = {
  h1: (props) => <h1 className="text-3xl font-display font-bold mb-4 text-foreground" {...props} />,
  h2: (props) => <h2 className="text-2xl font-display font-bold mt-10 mb-3 text-foreground" {...props} />,
  h3: (props) => <h3 className="text-xl font-display font-semibold mt-8 mb-2 text-foreground" {...props} />,
  p: (props) => <p className="text-muted leading-relaxed mb-4" {...props} />,
  ul: (props) => <ul className="list-disc pl-6 mb-4 text-muted space-y-1" {...props} />,
  ol: (props) => <ol className="list-decimal pl-6 mb-4 text-muted space-y-1" {...props} />,
  li: (props) => <li className="leading-relaxed" {...props} />,
  strong: (props) => <strong className="text-foreground font-semibold" {...props} />,
  em: (props) => <em className="text-foreground" {...props} />,
  blockquote: (props) => <blockquote className="border-l-4 border-red pl-4 my-6 text-muted italic" {...props} />,
  a: (props) => <a className="text-red hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
  hr: () => <hr className="border-border my-8" />,
};

export function useMDXComponents(): MDXComponents {
  return components;
}

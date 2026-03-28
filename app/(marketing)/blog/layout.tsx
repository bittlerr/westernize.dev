import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "CV tips, ATS strategies, and career advice for Eastern European developers targeting Western tech companies.",
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

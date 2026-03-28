export interface Post {
  slug: string;
  title: string;
  description: string;
  date: string;
}

export const posts: Post[] = [
  {
    slug: "why-eastern-european-devs-dont-get-callbacks",
    title: "Why Eastern European Developers Don't Get Callbacks",
    description:
      "You have the skills. You have the experience. But your CV speaks a language Western recruiters don't understand. Here's what's going wrong — and how to fix it.",
    date: "2026-01-15",
  },
  {
    slug: "ats-keywords-developers-2026",
    title: "ATS Keywords Every Developer Needs in 2026",
    description: "The exact keywords Western tech companies filter for — and why your CV is probably missing them.",
    date: "2026-02-20",
  },
  {
    slug: "how-to-write-cv-for-remote-western-jobs",
    title: "How to Write a CV for Remote Jobs at Western Companies",
    description:
      "A step-by-step guide to restructuring your CV for the companies that are actually hiring remotely from Eastern Europe.",
    date: "2026-03-28",
  },
];

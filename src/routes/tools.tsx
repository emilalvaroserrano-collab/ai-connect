import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useState } from "react";
import { Shell, Splash } from "@/components/shell";
import { useConnect } from "@/lib/connect";

export const Route = createFileRoute("/tools")({ component: ToolsPage });

const groups = [
  {
    title: "Content Creation",
    items: [
      { name: "ChatGPT", detail: "Write, plan, and keep a project’s instructions in one place.", lesson: "projects" },
      { name: "ChatGPT images", detail: "Describe one object and reject warped or stray results.", lesson: "product" },
    ],
  },
  {
    title: "Productivity",
    items: [
      { name: "Cursor", detail: "Edit real code with one rule the editor can follow.", lesson: "cursor" },
      { name: "NotebookLM", detail: "Ask only what your source files can answer.", lesson: "rag" },
    ],
  },
  {
    title: "Automation",
    items: [
      { name: "n8n", detail: "Draft a reply, then wait for a person to send it.", lesson: "n8n" },
      { name: "Ollama", detail: "Run a small local model for a script you control.", lesson: "ollama" },
    ],
  },
];

function ToolsPage() {
  const { ready, session, profile } = useConnect();
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("All");
  if (!ready) return <Splash />;
  if (!session || !profile) return <Navigate to="/login" />;
  if (profile.membershipStatus !== "active") return <Navigate to="/checkout" />;
  const needle = query.trim().toLowerCase();
  return (
    <Shell>
      <div className="mx-auto max-w-3xl px-4 py-4 md:px-8">
        <h1 className="font-display text-3xl">Tools & Apps</h1>
        <p className="mt-1 text-sm text-muted">The best AI tools, organized by use case, with a lesson for each.</p>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tools and apps..." className="mt-4 h-12 w-full rounded-2xl border border-line bg-raise px-4" />
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {["All", ...groups.map((item) => item.title)].map((label) => (
            <button key={label} type="button" onClick={() => setGroup(label)} className={group === label ? "h-9 shrink-0 rounded-full bg-teal px-3 text-sm text-ink" : "h-9 shrink-0 rounded-full border border-line px-3 text-sm text-muted"}>
              {label === "Content Creation" ? "Content" : label}
            </button>
          ))}
        </div>
        {groups.filter((section) => group === "All" || section.title === group).map((section) => (
          <section key={section.title} className="mt-6">
            <h2 className="text-sm font-medium text-teal">{section.title}</h2>
            <ul className="mt-2 space-y-2">
              {section.items.filter((item) => `${item.name} ${item.detail}`.toLowerCase().includes(needle)).map((item) => (
                <li key={item.name}>
                  <Link to="/learn/$tutorialId" params={{ tutorialId: item.lesson }} className="block rounded-2xl border border-line bg-raise px-4 py-3">
                    <p className="font-medium">{item.name}</p>
                    <p className="mt-1 text-sm text-muted">{item.detail}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </Shell>
  );
}

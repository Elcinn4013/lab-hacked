"use client";

import { useState } from "react";
import { searchPosts } from "../lib/api";

// The search box that hits GET /api/posts/search. It renders whatever rows the
// backend hands back as plain result cards: a title and a body. Nothing more,
// nothing less.
export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSearch(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const rows = await searchPosts(query);
      setResults(rows);
    } catch (err) {
      console.error(err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mb-8">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search the feed..."
          className="flex-1 rounded-lg border border-zinc-300 px-4 py-2 dark:border-zinc-700 dark:bg-zinc-900"
        />
        <button
          type="submit"
          className="rounded-lg bg-zinc-900 px-5 py-2 font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900"
        >
          Search
        </button>
      </form>

      {results !== null && (
        <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-400">
            {loading ? "Searching..." : `${results.length} result(s)`}
          </p>
          <ul className="space-y-2">
            {results.map((r, i) => (
              <li
                key={`${r.id}-${i}`}
                className="rounded-lg bg-white p-3 text-sm shadow-sm dark:bg-zinc-950"
              >
                <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {r.title}
                </p>
                <p className="text-zinc-600 dark:text-zinc-400">{r.body}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

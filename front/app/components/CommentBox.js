"use client";

import { useState } from "react";
import { addComment } from "../lib/api";

// A comment form anyone can use, no login required. That is by design for this
// little community app.
export default function CommentBox({ postId, onAdded }) {
  const [authorName, setAuthorName] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!body.trim()) return;
    setSending(true);
    try {
      const saved = await addComment(postId, authorName, body);
      onAdded(saved);
      setBody("");
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-2 sm:flex-row">
      <input
        type="text"
        value={authorName}
        onChange={(e) => setAuthorName(e.target.value)}
        placeholder="Your name (optional)"
        className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm sm:w-40 dark:border-zinc-700 dark:bg-zinc-900"
      />
      <input
        type="text"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Add a comment..."
        className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
      />
      <button
        type="submit"
        disabled={sending}
        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500 disabled:opacity-50"
      >
        {sending ? "..." : "Post"}
      </button>
    </form>
  );
}

"use client";

import { useState } from "react";
import CommentBox from "./CommentBox";

// One post in the feed: author, body, and the comment thread under it.
export default function PostCard({ post }) {
  const [comments, setComments] = useState(post.comments || []);

  return (
    <article className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <header className="flex items-center gap-3">
        {/* plain <img> on purpose so the lab needs no next/image host config */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={post.authorAvatar}
          alt={post.authorName}
          className="h-10 w-10 rounded-full object-cover"
        />
        <div>
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {post.authorName}
          </p>
          <p className="text-xs text-zinc-500">posted in the feed</p>
        </div>
      </header>

      <h2 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        {post.title}
      </h2>
      <p className="mt-1 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
        {post.body}
      </p>

      <section className="mt-4 border-t border-zinc-100 pt-3 dark:border-zinc-800">
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
          {comments.length} comment{comments.length === 1 ? "" : "s"}
        </p>
        <ul className="mt-2 space-y-2">
          {comments.map((c) => (
            <li key={c.id} className="text-sm">
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                {c.authorName}
              </span>{" "}
              <span className="text-zinc-600 dark:text-zinc-400">{c.body}</span>
            </li>
          ))}
        </ul>

        <CommentBox
          postId={post.id}
          onAdded={(saved) => setComments((prev) => [...prev, saved])}
        />
      </section>
    </article>
  );
}

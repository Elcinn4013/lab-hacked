"use client";

import { useEffect, useState } from "react";
import { getPosts } from "./lib/api";
import SearchBar from "./components/SearchBar";
import PostCard from "./components/PostCard";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getPosts()
      .then(setPosts)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="min-h-full bg-zinc-50 dark:bg-black">
      <main className="mx-auto w-full max-w-2xl px-4 py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            InkFeed
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            A tiny community for people who like to draw. Read posts, search, and
            leave a comment.
          </p>
        </header>

        <SearchBar />

        {error && (
          <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700">
            Could not reach the API: {error}. Is the backend running on port 8080?
          </div>
        )}

        <div className="space-y-5">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </main>
    </div>
  );
}

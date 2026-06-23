// Where the Spring Boot backend lives. Start it with `mvn spring-boot:run`
// inside the `back/` folder before you load this page.
export const API_BASE = "http://localhost:8080";

export async function getPosts() {
  const res = await fetch(`${API_BASE}/api/posts`, { cache: "no-store" });
  if (!res.ok) throw new Error("Could not load the feed");
  return res.json();
}

export async function searchPosts(query) {
  const res = await fetch(
    `${API_BASE}/api/posts/search?q=${encodeURIComponent(query)}`,
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error("Search failed");
  return res.json();
}

export async function addComment(postId, authorName, body) {
  const res = await fetch(`${API_BASE}/api/posts/${postId}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ authorName, body }),
  });
  if (!res.ok) throw new Error("Could not post the comment");
  return res.json();
}

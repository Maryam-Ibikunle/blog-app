import { useEffect, useState } from "react";

export default function MyPosts() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);

  const token = localStorage.getItem("token");

  // ---------------- FETCH MY POSTS ----------------
  useEffect(() => {
    fetch("http://127.0.0.1:8000/users/me/posts", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(setPosts);
  }, [token]);

  // ---------------- CREATE POST ----------------
  const handleCreate = async () => {
    const res = await fetch("http://127.0.0.1:8000/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, content }),
    });

    const newPost = await res.json();

    setPosts((prev) => [newPost, ...prev]);
    setTitle("");
    setContent("");
  };

  // ---------------- DELETE POST ----------------
  const handleDelete = async (id) => {
    await fetch(`http://127.0.0.1:8000/posts/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  // ---------------- EDIT POST ----------------
  const handleEdit = (post: Post) => {
    console.log(post);
    console.log(post.id);
    setEditingId(post.id);
    setTitle(post.title);
    setContent(post.content);
  };

  const handleUpdate = async () => {
    const res = await fetch(`http://127.0.0.1:8000/posts/${editingId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, content }),
    });

    const updated = await res.json();

    setPosts((prev) => prev.map((p) => (p.id === editingId ? updated : p)));

    setEditingId(null);
    setTitle("");
    setContent("");
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* ---------------- CREATE / EDIT FORM ---------------- */}
      <h1 className="text-2xl font-bold mb-4">My Posts</h1>

      <div className="mb-6 space-y-2">
        <input
          className="w-full border p-2"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="w-full border p-2"
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {editingId ? (
          <button
            onClick={handleUpdate}
            className="bg-blue-500 text-white px-4 py-2"
          >
            Update Post
          </button>
        ) : (
          <button
            onClick={handleCreate}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Create Post
          </button>
        )}
      </div>

      {/* ---------------- POSTS LIST ---------------- */}
      {posts.map((post) => (
        <div key={post.id} className="border p-4 mb-3 rounded">
          <h2 className="font-bold">{post.title}</h2>
          <p>{post.content}</p>

          <div className="flex gap-3 mt-2">
            <button onClick={() => handleEdit(post)} className="text-blue-600">
              Edit
            </button>

            <button
              onClick={() => handleDelete(post.id)}
              className="text-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

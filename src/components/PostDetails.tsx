import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PlusIcon, Check } from "lucide-react";

export default function PostDetails() {
  const { id } = useParams();
  const postId = Number(id);
  const [post, setPost] = useState<Post | null>(null);
  const [isAddComment, setIsAddComment] = useState(false);
  const [newComment, setNewComment] = useState("");
  const token = localStorage.getItem("token");
  const getUserFromToken = (token: Token | null) => {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload;
    } catch {
      return null;
    }
  };
  const currentUser = getUserFromToken(token);
  const currentUserId = currentUser?.sub ? Number(currentUser.sub) : null;
  console.log("TOKEN PAYLOAD:", currentUser);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/posts/${postId}`)
      .then((res) => res.json())
      .then((data) => setPost(data))
      .catch((err) => console.error(err));
  }, [id]);

  const handleAddComment = () => {
    setIsAddComment((prev) => !prev);
  };

  const handleSubmitComment = async () => {
    try {
      if (!postId) return;
      const response = await fetch(
        `http://127.0.0.1:8000/posts/${postId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            content: newComment,
            post_id: postId,
          }),
        }
      );

      const data = await response.json();
      await fetch(`http://127.0.0.1:8000/posts/${postId}`)
        .then((res) => res.json())
        .then((data) => setPost(data));
      handleAddComment();
      setNewComment("");
    } catch (err) {
      console.error(err);
    }
  };
  const handleDeleteComment = async (comment_id: comment_id) => {
    try {
      if (!postId) return;
      console.log("comment_id:", comment_id, typeof comment_id);
      await fetch(
        `http://127.0.0.1:8000/posts/${postId}/comments/${comment_id}`,

        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPost((prev) =>
        prev
          ? {
              ...prev,
              comments: prev.comments.filter((c) => c.id !== comment_id),
            }
          : prev
      );
    } catch (err) {
      console.error(err);
    }
  };
  if (!post) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>

      <p className="text-gray-600 mb-6">
        By {post.author?.f_name} {post.author?.l_name}
      </p>

      <p className="text-lg leading-relaxed">{post.content}</p>

      <div className="mt-8">
        <div className="flex justify-between">
          <h2 className="text-xl font-semibold mb-4">Comments</h2>
          <button
            className="aspect-square rounded-[50%]"
            onClick={handleAddComment}
          >
            <PlusIcon color="blue" />
          </button>
        </div>

        {isAddComment ? (
          <div className="flex justify-between">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-[80vw] mr-7 border border-blue-600 rounded-2xl p-3 text-blue-900"
            />
            <button
              className="w-1.5xs rounded-2xl"
              onClick={handleSubmitComment}
            >
              <Check />
            </button>
          </div>
        ) : (
          ""
        )}

        <div className="space-y-3">
          {post.comments.length === 0 ? (
            <p className="text-gray-500">No comments yet</p>
          ) : (
            post.comments.map((c, index) => {
              console.log(c);
              return (
                <div className="bg-gray-100 p-3 rounded-lg flex justify-between">
                  <div key={index}>
                    <p className="text-gray-800">{c.content}</p>

                    <p className="text-sm text-gray-500 mt-1">
                      {c.user.f_name} {c.user.l_name}
                    </p>
                  </div>
                  {c.user?.id === currentUserId && (
                    <button
                      onClick={() => handleDeleteComment(c.id)}
                      className="text-red-500 text-sm mt-2"
                    >
                      Delete
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* {post.comments.length === 0 ? (
          <p className="text-gray-500">No comments yet</p>
        ) : (
            {post.comments.map((comment, index) => {
              console.log((comment as any).content);

              return (
                <div key={index} className="bg-gray-100 p-3 rounded-lg">
                  <p className="text-gray-800">{comment.content}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    User: {comment.user}
                  </p>
                </div>
              );
            })}
          </div>
        )} */}
      </div>
    </div>
  );
}

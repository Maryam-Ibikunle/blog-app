import { MoveRight } from "lucide-react"
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function PostsSection() {
    type User = {
        id: number;
        f_name: string;
        l_name: string;
      };
      
    type Comment = {
        id: number;
        content: string;
        user_id: number;
      };
    type Post = {
        id: number;
        title: string;
        content: string;
        author_id: number;
        author: User;
        comments: Comment[]; 
      };
    const [posts, setPosts] = useState<Post[]>([]);

useEffect(() => {
    fetch("http://localhost:8000/posts")
      .then(res => res.json())
      .then((data: Post[]) => setPosts(data))
      .catch(err => console.error(err));
  }, []);
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      
      <h2 className="text-2xl font-bold mb-6">Latest Posts</h2>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white shadow-md rounded-xl p-5 hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold mb-2">
              {post.title}
            </h3>

            <p className="text-gray-600 mb-4">
              {post.content.slice(0, 100)}...
            </p>

            <div className="text-sm text-gray-500 mb-4">
              By {post.author?.f_name} {post.author?.l_name}
            </div>

            <Link
            to={`/posts/${post.id}`}
            className="text-blue-600 font-medium hover:underline"
            >
                Read more <MoveRight/>
            </Link>
          </div>
        ))}
      </div>

    </section>
  );
}
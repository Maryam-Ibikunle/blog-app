interface User {
  id: number;
  f_name: string;
  l_name: string;
}

interface Comment {
  id: number;
  content: string;
  user: User;
}

interface Post {
  id: number;
  title: string;
  content: string;
  author_id: number;
  author: User;
  comments: Comment[];
}
type Token = string;
type comment_id = number;

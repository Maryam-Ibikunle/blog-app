import "./input.css";
import Home from "./components/Home";
import Signup from "./components/Signup";
import Login from "./components/Login";
import PostDetails from "./components/PostDetails";
import MyPosts from "./components/MyPosts";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/posts/:id" element={<PostDetails />} />
        <Route path="/my-posts" element={<MyPosts />} />
      </Routes>
    </>
  );
}

export default App;

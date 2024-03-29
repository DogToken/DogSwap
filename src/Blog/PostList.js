import React from 'react';
import { Link } from 'react-router-dom';
import posts from './Posts'; // Assuming you have a data file with your blog posts

function PostList() {
  return (
    <div>
      <h1>All Blog Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <Link to={`/posts/${post.id}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PostList;
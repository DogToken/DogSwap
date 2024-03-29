import React from 'react';
import { Link } from 'react-router-dom';
import posts from './Posts';
import './PostList.css';

function PostList() {
  return (
    <div className="post-list-container">
      <h1>All Blog Posts</h1>
      <ul className="post-list">
        {posts.map((post) => (
          <li key={post.id} className="post-item">
            <div className="post-card">
              <h2>
                <Link to={`/posts/${post.id}`}>{post.title}</Link>
              </h2>
              <p>{post.excerpt}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PostList;
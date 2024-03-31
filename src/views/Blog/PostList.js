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
              <Link to={`/posts/${post.id}`} className="post-link">
                <div className="post-card">
                  <h2>{post.title}</h2>
                  <p>{post.excerpt}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  
  export default PostList;
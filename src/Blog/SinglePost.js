import React from 'react';
import { useParams, Link } from 'react-router-dom';
import posts from './Posts';
import './SinglePost.css';

function SinglePost() {
    const { id } = useParams();
    const post = posts.find((p) => p.id === parseInt(id));
  
    if (!post) {
      return <div>Post not found</div>;
    }
  
    return (
      <div className="single-post-container">
        <div className="post-card">
          <h1>{post.title}</h1>
          <p className="post-meta">
            Published on {post.publishedDate} by {post.author}
          </p>
          <p className="post-excerpt">{post.excerpt}</p>
          <div className="post-content">{post.content}</div>
          <div className="post-actions">
            <Link to="/posts" className="back-link">
              Back to Posts
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  export default SinglePost;
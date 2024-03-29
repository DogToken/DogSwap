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
          <div className="post-meta">
            <div className="author-info">
              <img src={post.author.profilePicture} alt={post.author.name} className="author-picture" />
              <span className="author-name">{post.author.name}</span>
            </div>
            <span className="publish-date">Published on {post.publishedDate}</span>
          </div>
          <p className="post-excerpt">{post.excerpt}</p>
          <div className="post-content" dangerouslySetInnerHTML={{ __html: post.content }} />
          <div className="post-actions">
            <Link to="/blog" className="back-link">
              Back to Posts
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  export default SinglePost;
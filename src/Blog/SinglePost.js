import React from 'react';
import { useParams } from 'react-router-dom';
import posts from './Posts';

function SinglePost() {
  const { id } = useParams();
  const post = posts.find((p) => p.id === parseInt(id));

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      {/* Add additional post details here */}
    </div>
  );
}

export default SinglePost;
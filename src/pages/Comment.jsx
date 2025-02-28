import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Comment({ recipeId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get(`http://localhost:5000/api/comments/${recipeId}`)
      .then(res => setComments(res.data))
      .catch(err => console.error(err));
  }, [recipeId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/comments', {
        recipeId,
        content: newComment,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments([...comments, res.data]);
      setNewComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold">คอมเมนต์</h3>
      <ul>
        {comments.map(comment => (
          <li key={comment.id} className="border p-2 my-2">{comment.content} - {comment.user.name}</li>
        ))}
      </ul>
      <form onSubmit={handleCommentSubmit} className="mt-2">
        <input 
          type="text" 
          className="border p-2 w-full" 
          placeholder="แสดงความคิดเห็น..." 
          value={newComment} 
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button type="submit" className="bg-blue-500 text-white p-2 mt-2">โพสต์</button>
      </form>
    </div>
  );
}

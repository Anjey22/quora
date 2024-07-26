import { FC, useState } from 'react';
import Avatar from 'react-avatar';
import commentsIcon from '../assets/comments.png';
import { doc, updateDoc } from 'firebase/firestore';
import { DataStorage } from '../firebase/setup';
import '../styles/Midbar.css';

interface QuestionProps {
  id: string;
  question: string;
  userDisplayName: string;
  comments: any[];
  onVote: (id: string, type: 'upvote' | 'downvote') => void;
  onComment: (id: string, text: string) => void;
}

const Question: FC<QuestionProps> = ({ id, question, userDisplayName, comments, onVote, onComment }) => {
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentInput, setCommentInput] = useState('');

  const handleComment = () => {
    if (commentInput.trim()) {
      onComment(id, commentInput);
      setCommentInput('');
      setShowCommentInput(false);
    }
  };

  return (
    <div className="midbar">
      <div className="content">
        <Avatar round size="35" name={userDisplayName || 'A'} />
        <span className='userName'>{userDisplayName}</span>
      </div>
      <h1 className="captions">
        {question}
      </h1>
      <hr />
      <div className="post-actions">
        <div>
          <img
            src={commentsIcon}
            alt="Comments"
            className="post-action-icon"
            onClick={() => setShowCommentInput(prev => !prev)}
          />
          <span>{comments.length}</span>
        </div>
      </div>
      {showCommentInput && (
        <div className="comment-input">
          <input
            type="text"
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            placeholder="Write a comment..."
          />
          <button onClick={handleComment}>Add Comment</button>
        </div>
      )}
      <div className="comment-section">
        {comments.map((comment, index) => (
          <div key={index} className="comment">
            <Avatar round size="35" name={userDisplayName || 'A'} />
            <span className="comment-user">{comment.user}</span>: {comment.text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Question;

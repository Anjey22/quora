import { FC, useState } from 'react';
import Avatar from 'react-avatar';
import arrowUp from '../assets/arrowUp.png';
import arrowDown from '../assets/arrowDown.png';
import commentsIcon from '../assets/comments.png';
import { doc, updateDoc } from 'firebase/firestore';
import { DataStorage } from '../firebase/setup';
import '../styles/Midbar.css';

interface PostProps {
  id: string;
  content: string;
  userDisplayName: string;
  upvotes: number;
  downvotes: number;
  comments: any[];
  fileURL?: string;
  onVote: (id: string, type: 'upvote' | 'downvote') => void;
  onComment: (id: string, text: string) => void;
}

const Post: FC<PostProps> = ({ id, content, userDisplayName, upvotes, downvotes, comments, fileURL, onVote, onComment }) => {
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
        {content}
      </h1>
      {fileURL && (
        <div className="file-content">
          {fileURL.match(/\.(jpeg|jpg|gif|png)$/) ? (
            <img src={fileURL} alt="Uploaded content" style={{ maxWidth: '100%' }} />
          ) : (
            <video controls style={{ maxWidth: '100%' }}>
              <source src={fileURL} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      )}
      <hr />
      <div className="post-actions">
        <div>
          <img
            src={arrowUp}
            alt="Upvote"
            className="post-action-icon"
            onClick={() => onVote(id, 'upvote')}
          />
          <span>{upvotes}</span>
        </div>
        <div>
          <img
            src={arrowDown}
            alt="Downvote"
            className="post-action-icon"
            onClick={() => onVote(id, 'downvote')}
          />
          <span>{downvotes}</span>
        </div>
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
            placeholder="Add comment..."
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

export default Post;

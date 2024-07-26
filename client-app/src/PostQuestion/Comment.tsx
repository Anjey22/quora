import { FC } from 'react';
import Avatar from 'react-avatar';
import '../styles/Midbar.css';

interface CommentProps {
  user: string;
  text: string;
}

const Comment: FC<CommentProps> = ({ user, text }) => {
  return (
    <div className="comment">
      <Avatar round size="35" name={user || 'A'} />
      <span className="comment-user">{user}</span>: {text}
    </div>
  );
};

export default Comment;


import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, DataStorage } from "../firebase/setup";
import Avatar from "react-avatar";
import { collection, addDoc, serverTimestamp, updateDoc, doc, onSnapshot, getDocs } from 'firebase/firestore';
import comments from "../assets/comments.png";
import arrowUp from "../assets/arrowUp.png";
import arrowDown from "../assets/arrowDown.png";
import AI from "../assets/AI.png";
import '../styles/Midbar.css';

const Midbar = () => {
  const [userDisplayName, setUserDisplayName] = useState<string>('');
 const [upvotes, setUpvotes] = useState<number>(0);
  const [downvotes, setDownvotes] = useState<number>(0);
  const [fixcommentInputs, setCommentfixInputs] = useState<string>('');
  const [fixcommentsData, setCommentsfixData] = useState<any[]>([]);
  const [fixvisibleComments, setVisiblefixComments] = useState<boolean>(false);


  const navigate = useNavigate();
  const postsRef = collection(DataStorage, "posts");


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setUserDisplayName(user.displayName || '');
      } else {
        setUserDisplayName('');
      }
    });

    return () => unsubscribe();
  }, []);

  const fixVote = async (type: 'upvote' | 'downvote') => {
    if (type === 'upvote') {
      setUpvotes(upvotes + 1);
    } else {
      setDownvotes(downvotes + 1);
    }

    // Update the Firestore document for votes if needed
    // const postRef = doc(DataStorage, 'posts', postId);
    // await updateDoc(postRef, {
    //   upvotes: type === 'upvote' ? upvotes + 1 : upvotes,
    //   downvotes: type === 'downvote' ? downvotes + 1 : downvotes,
    // });
  };

  const fixComment = async () => {
    if (fixcommentInputs.trim()) {
      const newComment = {
        user: userDisplayName,
        text: fixcommentInputs,
        timestamp: new Date(),
      };
      setCommentsfixData([...fixcommentsData, newComment]);
      setCommentfixInputs('');

      // Update the Firestore document for comments if needed
      // const postRef = doc(DataStorage, 'posts', postId);
      // await updateDoc(postRef, {
      //   comments: [...commentsData, newComment],
      // });
    }
  };

  const fixCommentVisibility = () => {
    setVisibleComments(!fixvisibleComments);
  };

  return (
    
      <div className="midbar">
      <div className="content">
        <Avatar round size="35" name={userDisplayName || 'A'} />
        <span className='userName'>{userDisplayName}</span>
      </div>
      <h1 className='fix-Caption'>Captions</h1>
      <img src={AI} alt="Post image" />
      <div className="post-actions">
        <div>
          <img src={arrowUp} alt="Upvote" className="post-action-icon" onClick={() => fixVote('upvote')} />
          <span>{upvotes}</span>
        </div>
        <div>
          <img src={arrowDown} alt="Downvote" className="post-action-icon" onClick={() => fixVote('downvote')} />
          <span>{downvotes}</span>
        </div>
        <div>
          <img src={comments} alt="Comments" className="post-action-icon" onClick={fixCommentVisibility} />
          <span>{fixcommentsData.length}</span>
        </div>
      </div>
      {fixvisibleComments && (
        <>
          <div className="comment-input">
            <input
              type="text"
              value={fixcommentInputs}
              onChange={(e) => setCommentfixInputs(e.target.value)}
              placeholder="Add comment..."
            />
            <button onClick={fixComment}>Add Comment</button>
          </div>
          <div className="comment-section">
            {fixcommentsData.map((comment, index) => (
              <div key={index} className="comment">
                <Avatar round size="35" name={comment.user || 'A'} />
                <div className="comment-content">
                  <span className="comment-user">{comment.user}</span>
                  <p>{comment.text}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Midbar;

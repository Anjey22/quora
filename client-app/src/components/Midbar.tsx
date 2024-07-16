import { useEffect, useState } from 'react';
import { auth, DataStorage } from "../firebase/setup";
import Avatar from "react-avatar";
import { collection, getDocs, addDoc, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import comments from "../assets/comments.png";
import arrowUp from "../assets/arrowUp.png";
import arrowDown from "../assets/arrowDown.png";
import '../styles/Midbar.css'; // Import the CSS file

const Midbar = () => {
  const [newQuestion, setNewQuestion] = useState('');
  const [questionData, setQuestionData] = useState<any[]>([]);
  const [postData, setPostData] = useState<any[]>([]);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());
  const [userDisplayName, setUserDisplayName] = useState<string>('');
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({});
  const [showCommentInputs, setShowCommentInputs] = useState<{ [key: string]: boolean }>({});

  const questionsRef = collection(DataStorage, "questions");
  const postsRef = collection(DataStorage, "posts");

  const getQuestion = async () => {
    try {
      const data = await getDocs(questionsRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        timestamp: doc.data().timestamp?.toDate(),
      }));
      filteredData.sort((a, b) => b.timestamp - a.timestamp);
      setQuestionData(filteredData);
    } catch (error) {
      console.error(error);
    }
  };

  const getPosts = async () => {
    try {
      const data = await getDocs(postsRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        timestamp: doc.data().timestamp?.toDate(),
      }));
      filteredData.sort((a, b) => b.timestamp - a.timestamp);
      setPostData(filteredData);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePostClick = async () => {
    if (newQuestion.trim() !== '') {
      try {
        await addDoc(questionsRef, { 
          question: newQuestion, 
          timestamp: serverTimestamp(),
          upvotes: 0,
          downvotes: 0,
          comments: []
        });
        setNewQuestion('');
        getQuestion();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleVote = async (id: string, type: 'upvote' | 'downvote') => {
    const postRef = doc(DataStorage, 'questions', id);
    const post = questionData.find(q => q.id === id);

    if (post) {
      const updatedPost = { ...post };
      if (type === 'upvote') {
        updatedPost.upvotes = (updatedPost.upvotes || 0) + 1;
      } else {
        updatedPost.downvotes = (updatedPost.downvotes || 0) + 1;
      }
      await updateDoc(postRef, {
        upvotes: updatedPost.upvotes,
        downvotes: updatedPost.downvotes
      });
      setQuestionData(prev => prev.map(q => q.id === id ? updatedPost : q));
    }
  };

  const handleComment = async (id: string) => {
    if (commentInputs[id]?.trim() !== '') {
      const postRef = doc(DataStorage, 'questions', id);
      const post = questionData.find(q => q.id === id);

      if (post) {
        const updatedPost = { ...post };
        updatedPost.comments = [...(updatedPost.comments || []), { user: userDisplayName, text: commentInputs[id], timestamp: new Date() }];
        await updateDoc(postRef, { comments: updatedPost.comments });
        setQuestionData(prev => prev.map(q => q.id === id ? updatedPost : q));
        setCommentInputs(prev => ({ ...prev, [id]: '' }));
      }
    }
  };

  const toggleExpandQuestion = (id: string) => {
    setExpandedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleCommentInput = (id: string) => {
    setShowCommentInputs(prev => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setUserDisplayName(user.displayName || '');
      } else {
        setUserDisplayName('');
      }
    });

    getQuestion();
    getPosts();

    return () => unsubscribe();
  }, []);

  // One-time script to initialize existing documents
  useEffect(() => {
    const initializeDocuments = async () => {
      const querySnapshot = await getDocs(questionsRef);
      querySnapshot.forEach(async (doc) => {
        const data = doc.data();
        if (!data.upvotes || !data.downvotes || !data.comments) {
          await updateDoc(doc.ref, {
            upvotes: data.upvotes || 0,
            downvotes: data.downvotes || 0,
            comments: data.comments || []
          });
        }
      });
    };

    initializeDocuments();
  }, []);

  const truncateText = (text: string, limit: number) => {
    const words = text.split(' ');
    if (words.length > limit) {
      return `${words.slice(0, limit).join(' ')}...`;
    }
    return text;
  };

  return (
    <div>
      <div className="midbar">
        <div className="midbar-top">
          <div className="midbar-avatar-input">
            <Avatar
              round
              size="35"
              name={userDisplayName || 'A'}
            />
            <input
              type="text"
              className="postmid"
              placeholder="What do you want to ask or share?"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
            />
          </div>
        </div>
        <div className="midbar-actions">
          <h1><i className="fas fa-question-circle"></i> Ask</h1>
          <h1><i className="fas fa-pen-square"></i> Answer</h1>
          <h1 onClick={handlePostClick}><i className="fas fa-pen"></i> Post</h1>
        </div>
      </div>

      {questionData.map((data: any) => (
        <div key={data.id} className="midbar">
          <div className="content">
            <Avatar
              round
              size="35"
              name={userDisplayName || 'A'}
            />
            <span className='userName'>{userDisplayName}</span>
          </div>
          <h1 className="captions">
            {expandedQuestions.has(data.id) ? data.question : truncateText(data.question, 50)}
            {data.question.split(' ').length > 50 && (
              <span className="toggle-caption" onClick={() => toggleExpandQuestion(data.id)}>
                {expandedQuestions.has(data.id) ? " Show less" : " See more"}
              </span>
            )}
          </h1>
          <hr></hr>
          <div className="post-actions">
            <img
              src={arrowUp}
              alt="Upvote"
              className="post-action-icon"
              onClick={() => handleVote(data.id, 'upvote')}
            />
            <span>{data.upvotes}</span>
            <img
              src={arrowDown}
              alt="Downvote"
              className="post-action-icon"
              onClick={() => handleVote(data.id, 'downvote')}
            />
            <span>{data.downvotes}</span>
            <img
              src={comments}
              alt="Comments"
              className="post-action-icon"
              onClick={() => toggleCommentInput(data.id)}
            />
            <span>{data.comments?.length || 0}</span>
          </div>
          {showCommentInputs[data.id] && (
            <div className="comment-input">
              <input
                type="text"
                value={commentInputs[data.id] || ''}
                onChange={(e) => setCommentInputs({ ...commentInputs, [data.id]: e.target.value })}
                placeholder="Write a comment..."
              />
              <button onClick={() => handleComment(data.id)}>Comment</button>
            </div>
          )}
          <div className="comment-section">
            {data.comments?.map((comment: any, index: number) => (
              <div key={index} className="comment">
                <span className="comment-user">{comment.user}</span>: {comment.text}
              </div>
            ))}
          </div>
        </div>
      ))}

      {postData.map((data: any) => (
        <div key={data.id} className="midbar">
          <div className="content">
            <Avatar
              round
              size="35"
              name={userDisplayName || 'A'}
            />
            <span className='userName'>{userDisplayName}</span>
          </div>
          <h1 className="captions">
            {data.content}
          </h1>
          {data.fileURL && (
            <div className="file-content">
              {data.fileURL.match(/\.(jpeg|jpg|gif|png)$/) ? (
                <img src={data.fileURL} alt="Uploaded content" style={{ maxWidth: '100%' }} />
              ) : (
                <video controls style={{ maxWidth: '100%' }}>
                  <source src={data.fileURL} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Midbar;

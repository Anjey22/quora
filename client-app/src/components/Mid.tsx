import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, DataStorage } from "../firebase/setup";
import Avatar from "react-avatar";
import { collection, addDoc, serverTimestamp, updateDoc, doc, onSnapshot, getDocs } from 'firebase/firestore';
import comments from "../assets/comments.png";
import arrowUp from "../assets/arrowUp.png";
import arrowDown from "../assets/arrowDown.png";
import '../styles/Midbar.css';

type searchProp = {
  search: string;
}

const Midbar = (props: searchProp) => {
  const [newQuestion, setNewQuestion] = useState('');
  const [newPost, setNewPost] = useState('');
  const [questionData, setQuestionData] = useState<any[]>([]);
  const [postData, setPostData] = useState<any[]>([]);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set());
  const [userDisplayName, setUserDisplayName] = useState<string>('');
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({});
  const [visibleComments, setVisibleComments] = useState<{ [key: string]: boolean }>({});
  const [answerInputVisible, setAnswerInputVisible] = useState<{ [key: string]: boolean }>({});
  const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(null);

  const navigate = useNavigate();

  const questionsRef = collection(DataStorage, "questions");
  const postsRef = collection(DataStorage, "posts");

  useEffect(() => {
    const unsubscribeQuestions = onSnapshot(questionsRef, snapshot => {
      const updatedQuestions = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        timestamp: doc.data().timestamp?.toDate(),
      }));
      updatedQuestions.sort((a, b) => b.timestamp - a.timestamp);
      setQuestionData(updatedQuestions);
    });

    const unsubscribePosts = onSnapshot(postsRef, snapshot => {
      const updatedPosts = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        timestamp: doc.data().timestamp?.toDate(),
      }));
      updatedPosts.sort((a, b) => b.timestamp - a.timestamp);
      setPostData(updatedPosts);
    });

    return () => {
      unsubscribeQuestions();
      unsubscribePosts();
    };
  }, []);

  useEffect(() => {
    const initializePosts = async () => {
      const querySnapshot = await getDocs(postsRef);
      querySnapshot.forEach(async (doc) => {
        const data = doc.data();
        if (data.upvotes === undefined || data.downvotes === undefined) {
          await updateDoc(doc.ref, {
            upvotes: 0,
            downvotes: 0
          });
        }
      });
    };

    initializePosts();
  }, []);

  const handleQuestionClick = async () => {
    if (newQuestion.trim()) {
      try {
        await addDoc(questionsRef, { 
          question: newQuestion, 
          timestamp: serverTimestamp(),
          comments: [],
          upvotes: 0,
          downvotes: 0
        });
        setNewQuestion('');
      } catch (error) {
        console.error('Error adding question:', error);
      }
    }
  };

  const handlePostClick = async () => {
    if (newPost.trim()) {
      try {
        await addDoc(postsRef, {
          content: newPost,
          timestamp: serverTimestamp(),
          upvotes: 0,
          downvotes: 0,
          comments: []
        });
        setNewPost('');
      } catch (error) {
        console.error('Error adding post:', error);
      }
    }
  };

  const handleComment = async (id: string, collection: 'questions' | 'posts') => {
    if (commentInputs[id]?.trim()) {
      const postRef = doc(DataStorage, collection, id);
      const data = collection === 'questions' ? questionData.find(q => q.id === id) : postData.find(p => p.id === id);

      if (data) {
        const updatedData = { ...data };
        updatedData.comments = [...(updatedData.comments || []), { user: userDisplayName, text: commentInputs[id], timestamp: new Date() }];
        await updateDoc(postRef, { comments: updatedData.comments });
        setCommentInputs(prev => ({ ...prev, [id]: '' }));
      }
    }
  };

  const handleAnswer = async (id: string) => {
    if (commentInputs[id]?.trim()) {
      const postRef = doc(DataStorage, "questions", id);
      const data = questionData.find(q => q.id === id);

      if (data) {
        const updatedData = { ...data };
        updatedData.comments = [...(updatedData.comments || []), { user: userDisplayName, text: commentInputs[id], timestamp: new Date() }];
        await updateDoc(postRef, { comments: updatedData.comments });
        setCommentInputs(prev => ({ ...prev, [id]: '' }));
        setAnswerInputVisible(prev => ({ ...prev, [id]: false }));
        navigate(`/answers/${id}`); // Navigate to the answers section
      }
    }
  };


  const handleVote = async (id: string, type: 'upvote' | 'downvote', collection: 'questions' | 'posts') => {
    try {
      const postRef = doc(DataStorage, collection, id);
      const data = collection === 'questions' ? questionData.find(q => q.id === id) : postData.find(p => p.id === id);

      if (data) {
        const updatedData = { ...data };
        if (type === 'upvote') {
          updatedData.upvotes = (updatedData.upvotes || 0) + 1;
        } else {
          updatedData.downvotes = (updatedData.downvotes || 0) + 1;
        }
        await updateDoc(postRef, {
          upvotes: updatedData.upvotes,
          downvotes: updatedData.downvotes
        });

        if (collection === 'questions') {
          setQuestionData(prev => prev.map(q => q.id === id ? updatedData : q));
        } else {
          setPostData(prev => prev.map(p => p.id === id ? updatedData : p));
        }
      }
    } catch (error) {
      console.error('Error updating votes:', error);
    }
  };

  const toggleAnswerInput = (id: string) => {
    setAnswerInputVisible(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
    setCurrentQuestionId(id); // Set the current question ID for redirection
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

  const toggleExpandPost = (id: string) => {
    setExpandedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleCommentVisibility = (id: string) => {
    setVisibleComments(prev => {
      const newVisibleComments = { ...prev };
      if (newVisibleComments[id]) {
        delete newVisibleComments[id];
      } else {
        newVisibleComments[id] = true;
      }
      return newVisibleComments;
    });
  };

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

  const truncateText = (text: string, limit: number) => {
    const words = text.split(' ');
    return words.length > limit ? `${words.slice(0, limit).join(' ')}...` : text;
  };

  return (
    <div>
      <div className="midbar">
        <div className="midbar-top">
          <div className="midbar-avatar-input">
            <Avatar round size="35" name={userDisplayName || 'A'} />
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
          <h1><i className="fas fa-question-circle" onClick={handleQuestionClick}></i> Ask</h1>
          <h1><i className="fas fa-pen-square"></i> Answer</h1>
          <h1><i className="fas fa-pen"  onClick={handleQuestionClick}></i> Post</h1>

        </div>
      </div>

      {questionData
        .filter((data) => data?.question.toLowerCase().includes(props?.search.toLowerCase()))
        .map((data: any) => (
          <div key={data.id} className="midbar">
            <div className="content">
              <Avatar round size="35" name={userDisplayName || 'A'} />
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
            <hr />
            <div className="post-actions">
              <div>
                <h1><i className="fas fa-pen-square post-action-icon" onClick={() => toggleAnswerInput(data.id)}></i> Answer</h1>
                <span>{data.comments?.length || 0}</span>
              </div>
            </div>
            {answerInputVisible[data.id] && (
              <div className="comment-input">
                <input
                  type="text"
                  value={commentInputs[data.id] || ''}
                  onChange={(e) => setCommentInputs({ ...commentInputs, [data.id]: e.target.value })}
                  placeholder="Write your Answer..."
                />
                <button onClick={() => handleAnswer(data.id)}>Add Answer</button>
              </div>
            )}
          </div>
        ))}
      {postData
        .filter((data) => data?.content.toLowerCase().includes(props?.search.toLowerCase()))
        .map((data: any) => (
          <div key={data.id} className="midbar">
            <div className="content">
              <Avatar round size="35" name={userDisplayName || 'A'} />
              <span className='userName'>{userDisplayName}</span>
            </div>
            <h1 className="captions">
              {expandedPosts.has(data.id) ? data.content : truncateText(data.content, 50)}
              {data.content.split(' ').length > 50 && (
                <span className="toggle-caption" onClick={() => toggleExpandPost(data.id)}>
                  {expandedPosts.has(data.id) ? " Show less" : " See more"}
                </span>
              )}
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
            <hr />
            <div className="post-actions">
              <div>
                <img src={arrowUp} alt="Upvote" className="post-action-icon" onClick={() => handleVote(data.id, 'upvote', 'posts')} />
                <span>{data.upvotes || 0}</span>
              </div>
              <div>
                <img src={arrowDown} alt="Downvote" className="post-action-icon" onClick={() => handleVote(data.id, 'downvote', 'posts')} />
                <span>{data.downvotes || 0}</span>
              </div>
              <div>
                <img src={comments} alt="Comments" className="post-action-icon" onClick={() => toggleCommentVisibility(data.id)} />
                <span>{data.comments?.length || 0}</span>
              </div>
            </div>
            {visibleComments[data.id] && (
              <>
                <div className="comment-input">
                  <input
                    type="text"
                    value={commentInputs[data.id] || ''}
                    onChange={(e) => setCommentInputs({ ...commentInputs, [data.id]: e.target.value })}
                    placeholder="Add comment..."
                  />
                  <button onClick={() => handleComment(data.id, 'posts')}>Add Comment</button>
                </div>
                <div className="comment-section">
                  {data.comments?.map((comment: any, index: number) => (
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
        ))}
    </div>
  );
};

export default Midbar;

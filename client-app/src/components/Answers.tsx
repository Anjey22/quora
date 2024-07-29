import { useEffect, useState } from 'react';
import { DataStorage } from "../firebase/setup";
import Avatar from "react-avatar";
import { collection, updateDoc, doc, onSnapshot } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import '../styles/AnswerSection.css';

const AnswerSection = () => {
  const [questionData, setQuestionData] = useState<any[]>([]);
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({});
  const [currentUser, setCurrentUser] = useState<{ displayName: string | null }>({ displayName: null });
  const questionsRef = collection(DataStorage, "questions");

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser({ displayName: user.displayName });
      }
    });

    const unsubscribeQuestions = onSnapshot(questionsRef, snapshot => {
      const updatedQuestions = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        timestamp: doc.data().timestamp?.toDate(),
      }));
      updatedQuestions.sort((a, b) => b.timestamp - a.timestamp);
      setQuestionData(updatedQuestions);
    });

    return () => {
      unsubscribeQuestions();
    };
  }, []);

  const handleAnswer = async (id: string) => {
    if (commentInputs[id]?.trim()) {
      const postRef = doc(DataStorage, "questions", id);
      const data = questionData.find(q => q.id === id);

      if (data && currentUser.displayName) {
        const updatedData = { ...data };
        updatedData.comments = [
          ...(updatedData.comments || []),
          { user: currentUser.displayName, text: commentInputs[id], timestamp: new Date() }
        ];
        await updateDoc(postRef, { comments: updatedData.comments });
        setCommentInputs(prev => ({ ...prev, [id]: '' }));
      }
    }
  };

  return (
    <div className="answer-section">
      {questionData.map((data: any) => (
        <div key={data.id} className="answer-item">
          <div className="question-header">
            <Avatar round size="45" name={data.user || 'U'} />
            <span className="question-user">{data.user}</span>
          </div>
          <h2>{data.question}</h2>
          <div className="answers">
            {data.comments?.map((comment: any, index: number) => (
              <div key={index} className="answer">
                <Avatar round size="35" name={comment.user || 'A'} />
                <span className="answer-user">{comment.user}</span>: {comment.text}
              </div>
            ))}
            <div className="comment-input">
              <input
                type="text"
                value={commentInputs[data.id] || ''}
                onChange={(e) => setCommentInputs({ ...commentInputs, [data.id]: e.target.value })}
                placeholder="Write your Answer..."
              />
              <button onClick={() => handleAnswer(data.id)}>Add Answer</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnswerSection;
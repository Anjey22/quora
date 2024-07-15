import { useEffect, useState } from 'react';
import { auth, DataStorage } from "../firebase/setup";
import Avatar from "react-avatar";
import ai from "../assets/ai.png";
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';

const Midbar = () => {
  const [newQuestion, setNewQuestion] = useState('');
  const [questionData, setQuestionData] = useState<any>([]);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());

  const questionsRef = collection(DataStorage, "questions");

  const getQuestion = async () => {
    try {
      const data = await getDocs(questionsRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        timestamp: doc.data().timestamp?.toDate(), // Convert Firestore timestamp to JavaScript Date object
      }));
      filteredData.sort((a, b) => b.timestamp - a.timestamp); // Sort by timestamp in descending order
      setQuestionData(filteredData);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePostClick = async () => {
    if (newQuestion.trim() !== '') {
      try {
        await addDoc(questionsRef, { 
          question: newQuestion, 
          timestamp: serverTimestamp() // Add timestamp
        });
        setNewQuestion('');
        getQuestion(); // Refresh the questions after adding a new one
      } catch (error) {
        console.error(error);
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

  useEffect(() => {
    getQuestion();
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
              name={auth?.currentUser?.emailVerified ? (auth.currentUser.displayName || 'A') : 'A'}
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
              name={auth?.currentUser?.emailVerified ? (auth.currentUser.displayName || 'A') : 'A'}
            />
            <a>User Name</a>
          </div>
          <h1 className="captions">
            {expandedQuestions.has(data.id) ? data.question : truncateText(data.question, 50)}
            {data.question.split(' ').length > 50 && (
              <span className="toggle-caption" onClick={() => toggleExpandQuestion(data.id)}>
                {expandedQuestions.has(data.id) ? " Show less" : " See more"}
              </span>
            )}
          </h1>
          <img src={ai} alt="" />
        </div>
      ))}
    </div>
  );
};

export default Midbar;

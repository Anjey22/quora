import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { collection, getDocs, doc } from 'firebase/firestore';
import { DataStorage } from "../firebase/setup";
import Avatar from 'react-avatar';

const Answer = () => {
  const location = useLocation();
  const [answerData, setAnswerData] = useState<any[]>([]);
  const questionId = location.state?.id;

  useEffect(() => {
    const getAnswers = async () => {
      if (questionId) {
        try {
          const answerDoc = doc(DataStorage, "questions", questionId);
          const answerRef = collection(answerDoc, "answers");
          const data = await getDocs(answerRef);
          const filteredData = data.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          setAnswerData(filteredData);
        } catch (error) {
          console.error(error);
        }
      }
    };

    getAnswers();
  }, [questionId]);

  return (
    <div>
      <h1>Answers</h1>
      {answerData.map((data: any) => (
        <div key={data.id} className="answer">
          <Avatar
            round
            size="35"
            name={data.user || 'A'}
          />
          <p>{data.ans}</p>
        </div>
      ))}
    </div>
  );
};

export default Answer;

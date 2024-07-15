import { addDoc, collection } from 'firebase/firestore';
import React, { useState } from 'react';
import { Modal, Button, Nav, Tab, Form } from 'react-bootstrap';
import { DataStorage } from '../firebase/setup';

interface PostpopUpModalProps {
  show: boolean;
  onClose: () => void;
}

const PostpopUp: React.FC<PostpopUpModalProps> = ({ show, onClose }) => {
  const questionsRef = collection(DataStorage, "questions");
  const postsRef = collection(DataStorage, "posts");

  const [quest, setQuest] = useState("");
  const [postContent, setPostContent] = useState("");
  const [activeTab, setActiveTab] = useState("addQuestion");

  const addQuestion = async () => {
    await addDoc(questionsRef, {
      question: quest
    });
    onClose(); // Close the modal after adding a question
  };

  const createPost = async () => {
    await addDoc(postsRef, {
      content: postContent
    });
    onClose(); // Close the modal after creating a post
  };

  const handlePost = () => {
    if (activeTab === "addQuestion") {
      addQuestion();
    } else if (activeTab === "createPost") {
      createPost();
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k!)}>
        <Modal.Header closeButton>
          <Nav variant="tabs">
            <Nav.Item>
              <Nav.Link eventKey="addQuestion">Add Question</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="createPost">Create Post</Nav.Link>
            </Nav.Item>
          </Nav>
        </Modal.Header>
        <Modal.Body>
          <Tab.Content>
            <Tab.Pane eventKey="addQuestion">
              <div>
                <p><strong>Tips on getting good answers quickly</strong></p>
                <ul>
                  <li>Make sure your question has not been asked already</li>
                  <li>Keep your question short and to the point</li>
                  <li>Double-check grammar and spelling</li>
                </ul>
                <Form>
                  <Form.Group controlId="formQuestion">
                    <Form.Control 
                      type="text" 
                      onChange={(e) => setQuest(e.target.value)} 
                      placeholder="Start your question with 'What', 'How', 'Why', etc." 
                    />
                  </Form.Group>
                </Form>
              </div>
            </Tab.Pane>
            <Tab.Pane eventKey="createPost">
              <Form>
                <Form.Group controlId="formPostContent">
                  <Form.Control 
                    as="textarea" 
                    rows={3} 
                    placeholder="Write something..." 
                    onChange={(e) => setPostContent(e.target.value)} 
                  />
                </Form.Group>
              </Form>
            </Tab.Pane>
          </Tab.Content>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handlePost}>Post</Button>
        </Modal.Footer>
      </Tab.Container>
    </Modal>
  );
};

export default PostpopUp;

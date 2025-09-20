import React, { useState } from 'react';
import './Videos.css';

const Videos = () => {
  const [activeTab, setActiveTab] = useState('lectures');
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResults, setQuizResults] = useState({});

  // Your subjects data - UPDATED WITH NEW VIDEOS
  const subjects = [
    { 
      id: 'biology', 
      name: 'Biology', 
      icon: '🧬',
      lectures: [
        { file: 'dna_replication.mp4', title: 'DNA Replication', desc: 'Learn how DNA replicates itself' },
        { file: 'photosynthesis.mp4', title: 'Photosynthesis', desc: 'How plants make their food' },
        { file: 'Cells.mp4', title: 'Plant & Animal Cells', desc: 'Explore the differences between plant and animal cells' }
      ]
    },
    { 
      id: 'chemistry', 
      name: 'Chemistry', 
      icon: '⚗️',
      lectures: [
        { file: 'inorganic.mp4', title: 'Inorganic Chemistry', desc: 'Study of inorganic compounds' },
        { file: 'pH.mp4', title: 'pH and Acids/Bases', desc: 'Understanding pH scale and acid-base reactions' }
      ]
    },
    { 
      id: 'math', 
      name: 'Mathematics', 
      icon: '📐',
      lectures: [
        { file: 'Probability.mp4', title: 'Probability Basics', desc: 'Introduction to probability concepts and calculations' }
      ]
    },
    { 
      id: 'physics', 
      name: 'Physics', 
      icon: '⚡',
      lectures: [
        { file: 'Gravity_Experiment.mp4', title: 'Gravity Experiment', desc: 'Understanding gravitational force' },
        { file: 'magnetism.mp4', title: 'Magnetism', desc: 'Magnetic fields and forces' }
      ]
    }
  ];

  // Quiz questions for each subject - UPDATED TO MATCH YOUR QUIZ VIDEOS
  const quizQuestions = {
    biology: [
      {
        video: 'biology1.mp4',
        question: "Riya goes for a run, after five minutes she is breathing fast and her heart is racing. She asks herself \"Why is my body making me breathe faster?\".",
        options: ["To cool the body", "To supply more oxygen to muscles", "To remove sweat", "To reduce heart beat"],
        correct: "To supply more oxygen to muscles"
      },
      {
        video: 'biology2.mp4', 
        question: 'During class, Rohan heard his stomach growls loudly like a lion. He asked, "what part of my body is now working overtime to digest the samosa army?"',
        options: ["Brains", "Stomach", "Lungs", "Heart"],
        correct: "Stomach"
      }
    ],
    chemistry: [
      {
        video: 'chemistry1.mp4',
        question: "Priya pours soda into a glass and it starts fizzing. She shouts \"help, it's exploding!\". Her brother says relax it's just a gas coming out.",
        options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Laughing gas"],
        correct: "Carbon Dioxide"
      },
      {
        video: 'chemistry2.mp4',
        question: "Ana rubs a balloon on her hair. Suddenly her hair stands up like porcupine spikes! She screams: \"Help! Am I turning into a hedgehog?\"",
        options: ["Static Electricity", "Magnetism", "Wind Energy", "Hair gel effects"],
        correct: "Static Electricity"
      }
    ],
    math: [
      {
        video: 'maths1.mp4',
        question: "The Shopkeeper tells Peter \"12 pencils cost 60 Rupees, can you quickly tell me the price of 1 pencil?\". Peter looks confused, help him answer.",
        options: ["12 rupees", "6 rupees", "5 rupees", "7 rupees"],
        correct: "5 rupees"
      },
      {
        video: 'maths2.mp4',
        question: "A girl has 12 candies. She shares them equally with 3 friends. Everyone gets the same number. How many candies does each get?",
        options: ["3", "4", "6", "12"],
        correct: "4"
      }
    ],
    physics: [
      {
        video: 'physics1.mp4',
        question: "Riya is playing cricket. She hits the ball high into the sky when it comes back down quickly. She wonders what made the ball flow back instead of floating. What do you think?",
        options: ["Magnetism", "Gravity", "Friction", "Air Pressure"],
        correct: "Gravity"
      },
      {
        video: 'physics2.mp4',
        question: "A boy throws a ball straight up, it goes high, slows down, then comes back to his hand. What force pulled the ball down?",
        options: ["Magnetism", "Gravity", "Friction", "Air Pressure"],
        correct: "Gravity"
      }
    ]
  };

  const handleQuizAnswer = (quizId, answer) => {
    setQuizAnswers({ ...quizAnswers, [quizId]: answer });
  };

  const checkQuizAnswer = (quizId, correctAnswer) => {
    const userAnswer = quizAnswers[quizId];
    const isCorrect = userAnswer === correctAnswer;
    
    setQuizResults({ 
      ...quizResults, 
      [quizId]: { 
        isCorrect, 
        userAnswer, 
        correctAnswer 
      } 
    });
  };

  return (
    <div className="videos-container">
      <div className="videos-header">
        <h1>📺 Educational Videos</h1>
        <p>Learn through interactive lectures and quizzes</p>
      </div>

      {/* Tab Navigation */}
      <div className="tab-container">
        <button 
          className={`tab ${activeTab === 'lectures' ? 'active' : ''}`}
          onClick={() => setActiveTab('lectures')}
        >
          📚 Lectures
        </button>
        <button 
          className={`tab ${activeTab === 'quizzes' ? 'active' : ''}`}
          onClick={() => setActiveTab('quizzes')}
        >
          🧠 Video Quizzes
        </button>
      </div>

      {/* Lectures Tab */}
      {activeTab === 'lectures' && (
        <div className="content">
          <h2>Subject Lectures</h2>
          <div className="subject-grid">
            {subjects.map(subject => (
              <div key={subject.id} className="subject-card">
                <div className="subject-header">
                  <h3>{subject.icon} {subject.name}</h3>
                </div>
                <div className="video-content">
                  {subject.lectures.map((lecture, index) => (
                    <div key={index} className="lecture-item">
                      {lecture.placeholder ? (
                        <div className="placeholder-video">
                          <div className="placeholder-content">
                            <h4>📹 {lecture.title}</h4>
                            <p>{lecture.desc}</p>
                          </div>
                        </div>
                      ) : (
                        <>
                          <video className="video-player" controls>
                            <source src={`/videos/lectures/${lecture.file}`} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                          <h4>{lecture.title}</h4>
                          <p>{lecture.desc}</p>
                        </>
                      )}
                      {index < subject.lectures.length - 1 && <div className="lecture-divider"></div>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quizzes Tab */}
      {activeTab === 'quizzes' && (
        <div className="content">
          <h2>Interactive Video Quizzes</h2>
          {subjects.map(subject => 
            quizQuestions[subject.id]?.map((quiz, quizIndex) => (
              <div key={`${subject.id}-${quizIndex}`} className="quiz-card">
                <div className="subject-header">
                  <h3>{subject.icon} {subject.name} Quiz {quizIndex + 1}</h3>
                </div>
                <div className="quiz-container">
                  <div className="quiz-video">
                    <video className="video-player" controls>
                      <source src={`/videos/quizzes/${quiz.video}`} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                  <div className="quiz-options">
                    <div className="quiz-question">
                      {quiz.question}
                    </div>
                    {quiz.options.map((option, index) => (
                      <label 
                        key={index} 
                        className={`option ${
                          quizAnswers[`${subject.id}-${quizIndex}`] === option ? 'selected' : ''
                        } ${
                          quizResults[`${subject.id}-${quizIndex}`] && option === quiz.correct ? 'correct' : ''
                        } ${
                          quizResults[`${subject.id}-${quizIndex}`] && quizAnswers[`${subject.id}-${quizIndex}`] === option && option !== quiz.correct ? 'incorrect' : ''
                        }`}
                      >
                        <input 
                          type="radio" 
                          name={`${subject.id}-${quizIndex}`}
                          value={option}
                          onChange={() => handleQuizAnswer(`${subject.id}-${quizIndex}`, option)}
                          disabled={quizResults[`${subject.id}-${quizIndex}`]}
                        />
                        {option}
                      </label>
                    ))}
                    <button 
                      className="submit-btn"
                      onClick={() => checkQuizAnswer(`${subject.id}-${quizIndex}`, quiz.correct)}
                      disabled={!quizAnswers[`${subject.id}-${quizIndex}`] || quizResults[`${subject.id}-${quizIndex}`]}
                    >
                      Submit Answer
                    </button>
                    {quizResults[`${subject.id}-${quizIndex}`] && (
                      <div className={`result ${quizResults[`${subject.id}-${quizIndex}`].isCorrect ? 'correct' : 'incorrect'}`}>
                        {quizResults[`${subject.id}-${quizIndex}`].isCorrect 
                          ? '🎉 Correct! Well done!' 
                          : `❌ Incorrect. The correct answer is: ${quizResults[`${subject.id}-${quizIndex}`].correctAnswer}`
                        }
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Videos;
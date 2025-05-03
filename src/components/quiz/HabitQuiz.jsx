import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useTaskStore from '../../stores/useTaskStore';
import { Howl } from 'howler';

const clickSound = new Howl({ src: ["/sounds/click.mp3"], volume: 0.5 });
const completeSound = new Howl({ src: ["/sounds/complete.mp3"] });

const QUESTIONS = [
  {
    id: 'procrastination',
    question: "When do you usually start your tasks?",
    options: [
      { id: 'early', label: "Way before deadline", emoji: "🦉", value: 0.8 },
      { id: 'ontime', label: "Right on schedule", emoji: "⏱️", value: 1 },
      { id: 'lastmin', label: "Last possible minute", emoji: "🔥", value: 1.5 },
      { id: 'after', label: "After deadline passed", emoji: "💀", value: 2 }
    ]
  },
  {
    id: 'multitasking',
    question: "How often do you multitask with distractions?",
    options: [
      { id: 'never', label: "Never, fully focused", emoji: "🧘", value: 0.9 },
      { id: 'sometimes', label: "Sometimes", emoji: "🤔", value: 1.1 },
      { id: 'often', label: "Often", emoji: "📺", value: 1.3 },
      { id: 'always', label: "Always, what's focus?", emoji: "🌀", value: 1.7 }
    ]
  },
  {
    id: 'productivity',
    question: "Your typical productive hours per day?",
    type: "slider",
    min: 0,
    max: 12,
    emoji: "⏳"
  },
  {
    id: 'caffeine',
    question: "How much caffeine fuels your deadlines?",
    options: [
      { id: 'none', label: "None", emoji: "💧", value: 1 },
      { id: 'some', label: "Some coffee", emoji: "☕", value: 1.1 },
      { id: 'lots', label: "Energy drinks", emoji: "🥤", value: 1.3 },
      { id: 'danger', label: "IV drip of espresso", emoji: "💉", value: 1.6 }
    ]
  }
];

export default function HabitQuiz({ onComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setHabitAnswers } = useTaskStore();

  const handleAnswer = (questionId, value) => {
    clickSound.play();
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    if (QUESTIONS[currentQuestion].type !== "slider" && currentQuestion < QUESTIONS.length - 1) {
      setTimeout(() => setCurrentQuestion(prev => prev + 1), 300);
    }
  };

  const handleNext = () => {
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentQuestion(prev => prev - 1);
  };

// In HabitQuiz.jsx
const handleSubmit = () => {
  onComplete({
    procrastination: 'lastmin', // Sample data
    multitasking: 'often',
    productivity: 4
  });
};

  const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;

  return (
    <section className="min-h-screen bg-gray-800 text-white py-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Tell Us About Your Work Habits</h2>
          <p className="text-gray-300 mb-4">Answer honestly for better suggestions</p>

          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <motion.div
              className="bg-blue-500 h-2.5 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-700 rounded-xl p-6 mb-8"
          >
            <h3 className="text-2xl font-semibold mb-6 flex items-center">
              {QUESTIONS[currentQuestion].emoji && (
                <span className="mr-3 text-2xl">{QUESTIONS[currentQuestion].emoji}</span>
              )}
              {QUESTIONS[currentQuestion].question}
            </h3>

            {QUESTIONS[currentQuestion].type === "slider" ? (
              <div className="px-4">
                <SliderQuestion
                  question={QUESTIONS[currentQuestion]}
                  value={answers[QUESTIONS[currentQuestion].id] ?? QUESTIONS[currentQuestion].min}
                  onChange={(val) => handleAnswer(QUESTIONS[currentQuestion].id, val)}
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {QUESTIONS[currentQuestion].options.map((option) => (
                  <motion.button
                    key={option.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`p-4 rounded-lg text-left transition-colors ${
                      answers[QUESTIONS[currentQuestion].id] === option.value
                        ? 'bg-blue-600'
                        : 'bg-gray-600 hover:bg-gray-500'
                    }`}
                    onClick={() => handleAnswer(QUESTIONS[currentQuestion].id, option.value)}
                  >
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{option.emoji}</span>
                      <span>{option.label}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-6 py-3 rounded-lg ${
              currentQuestion === 0 ? 'opacity-0 pointer-events-none' : 'bg-gray-600'
            }`}
            onClick={handleBack}
            disabled={currentQuestion === 0}
          >
            Back
          </motion.button>

          {currentQuestion < QUESTIONS.length - 1 ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 rounded-lg bg-blue-600"
              onClick={handleNext}
              disabled={answers[QUESTIONS[currentQuestion].id] === undefined}
            >
              Next
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 rounded-lg bg-blue-600 font-bold"
              onClick={handleSubmit}
              disabled={isSubmitting || answers[QUESTIONS[currentQuestion].id] === undefined}
            >
              {isSubmitting ? "Processing..." : "Finish"}
            </motion.button>
          )}
        </div>
      </div>
    </section>
  );
}

function SliderQuestion({ question, value, onChange }) {
  const [tempValue, setTempValue] = useState(value);

  const handleChange = (e) => {
    const newValue = parseInt(e.target.value);
    setTempValue(newValue);
    onChange(newValue);
  };

  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="text-gray-300">0h</span>
        <span className="text-xl font-bold">
          {tempValue}h {tempValue === 0 ? "😴" : tempValue > 8 ? "🤯" : ""}
        </span>
        <span className="text-gray-300">12h</span>
      </div>
      <input
        type="range"
        min={question.min}
        max={question.max}
        value={tempValue}
        onChange={handleChange}
        className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
      />
    </div>
  );
}

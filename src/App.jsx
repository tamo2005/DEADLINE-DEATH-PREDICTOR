import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Hero from './components/landing/Hero';
import TaskForm from './components/task-input/TaskForm';
import HabitQuiz from './components/quiz/HabitQuiz';
import Results from './components/results/Results';

export default function App() {
  const [currentStep, setCurrentStep] = useState('landing');
  const [tasks, setTasks] = useState([]);
  const [habits, setHabits] = useState({});

  // Debugging current step and data
  useEffect(() => {
    console.log(`Current step: ${currentStep}`);
    console.log('Tasks:', tasks);
    console.log('Habits:', habits);
  }, [currentStep, tasks, habits]);

  // Reset scroll position on step change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

  const handleTasksSubmit = (submittedTasks) => {
    if (!Array.isArray(submittedTasks)) {
      console.error('Invalid tasks data:', submittedTasks);
      return;
    }
    
    const isValid = submittedTasks.every(task => 
      task.title && task.deadline && task.hours && task.type
    );
    
    if (!isValid) {
      console.error('Missing required task fields');
      return;
    }

    console.log('Tasks submitted:', submittedTasks);
    setTasks(submittedTasks);
    setCurrentStep('quiz');
  };

  const handleHabitsSubmit = (submittedHabits) => {
    const requiredFields = ['procrastination', 'multitasking', 'productivity'];
    const isValid = requiredFields.every(field => field in submittedHabits);
    
    if (!isValid) {
      console.error('Missing required habit fields:', submittedHabits);
      return;
    }

    console.log('Habits submitted:', submittedHabits);
    setHabits(submittedHabits);
    setCurrentStep('results');
  };

  const transitionVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <AnimatePresence mode="wait">
        {currentStep === 'landing' && (
          <motion.div
            key="landing"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={transitionVariants}
          >
            <Hero onStart={() => setCurrentStep('tasks')} />
          </motion.div>
        )}

        {currentStep === 'tasks' && (
          <motion.div
            key="tasks"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={transitionVariants}
          >
            <TaskForm onTasksSubmit={handleTasksSubmit} />
          </motion.div>
        )}

        {currentStep === 'quiz' && (
          <motion.div
            key="quiz"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={transitionVariants}
          >
            <HabitQuiz 
              onComplete={handleHabitsSubmit}
              onBack={() => setCurrentStep('tasks')}
            />
          </motion.div>
        )}

        {currentStep === 'results' && (
          <motion.div
            key="results"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={transitionVariants}
          >
            <Results 
              tasks={tasks} 
              habits={habits}
              onRestart={() => {
                setTasks([]);
                setHabits({});
                setCurrentStep('landing');
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// Import your GIFs
import goodBg from '../../assets/good.gif';
import moderateBg from '../../assets/moderate.gif';
import badBg from '../../assets/bad.gif';

ChartJS.register(ArcElement, Tooltip, Legend);

const getRiskLevel = (score) => {
  if (score < 30) return { 
    label: 'Safe', 
    color: 'green-400', 
    emoji: '🛡️', 
    bgColor: 'bg-green-400', 
    textColor: 'text-green-400',
    background: goodBg,
    quotes: [
      "You're more organized than a librarian on alphabetizing day!",
      "Your deadlines don't stand a chance against you!",
      "Are you sure you're not a productivity robot?"
    ]
  };
  if (score < 70) return { 
    label: 'Moderate', 
    color: 'yellow-400', 
    emoji: '⚠️', 
    bgColor: 'bg-yellow-400', 
    textColor: 'text-yellow-400',
    background: moderateBg,
    quotes: [
      "You're walking the tightrope between productivity and Netflix!",
      "One more episode won't hurt... until it does!",
      "You're not procrastinating, you're strategically delaying!"
    ]
  };
  return { 
    label: 'High', 
    color: 'red-500', 
    emoji: '🔥', 
    bgColor: 'bg-red-500', 
    textColor: 'text-red-500',
    background: badBg,
    quotes: [
      "Calling in sick might be your best option right now!",
      "At this point, even time travel wouldn't save you!",
      "Your to-do list is judging you harder than your ex!"
    ]
  };
};

export default function Results({ tasks = [], habits = {} }) {
  const [riskScore, setRiskScore] = useState(0);
  const [displayedScore, setDisplayedScore] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [currentQuote, setCurrentQuote] = useState('');

  const calculateRisk = () => {
    if (!tasks.length) return 0;
    
    const today = new Date();
    const totalRisk = tasks.reduce((sum, task) => {
      const deadline = new Date(task.deadline);
      const daysLeft = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
      const dailyLoad = task.hours / Math.max(1, daysLeft);
      
      let taskScore = Math.min(dailyLoad * 10, 100);
      
      if (habits.procrastination === 'lastmin') taskScore *= 1.5;
      if (habits.multitasking === 'often') taskScore *= 1.2;
      if (habits.productivity < 4) taskScore *= 1.3;
      
      return sum + taskScore;
    }, 0);
    
    return Math.min(Math.round(totalRisk / tasks.length), 100);
  };

  useEffect(() => {
    const score = calculateRisk();
    setRiskScore(score);

    const duration = 2000;
    const start = Date.now();

    const animateScore = () => {
      const now = Date.now();
      const progress = Math.min(1, (now - start) / duration);
      const current = Math.floor(progress * score);
      setDisplayedScore(current);

      if (now < start + duration) {
        requestAnimationFrame(animateScore);
      } else {
        setDisplayedScore(score);
      }
    };

    animateScore();
  }, [tasks, habits]);

  const riskLevel = getRiskLevel(riskScore);

  // Set a random quote when risk level is determined
  useEffect(() => {
    if (riskLevel.quotes) {
      const randomIndex = Math.floor(Math.random() * riskLevel.quotes.length);
      setCurrentQuote(riskLevel.quotes[randomIndex]);
    }
  }, [riskLevel]);

  const chartData = {
    labels: ['Risk', 'Remaining'],
    datasets: [{
      data: [displayedScore, 100 - displayedScore],
      backgroundColor: [
        riskLevel.label === 'Safe' ? '#10B981' : 
        riskLevel.label === 'Moderate' ? '#F59E0B' : 
        '#EF4444',
        '#374151'
      ],
      borderWidth: 0,
    }],
  };

  const getFeedbackMessage = () => {
    if (riskLevel.label === "Safe") return "You're on track! Keep it up.";
    if (riskLevel.label === "Moderate") return "Caution! Prioritize wisely.";
    return "Warning! You need a focused sprint now!";
  };

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 -z-10">
        <img 
          src={riskLevel.background}
          alt="background"
          className="w-full h-full object-cover"
          style={{ opacity: 0.3 }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/70 to-gray-900/30"></div>
      </div>

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen py-16 relative z-10"
      >
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-4xl font-bold mb-6">Your Deadline Doom Results</h2>

          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="relative w-64 h-64 mx-auto mb-8"
          >
            <Doughnut
              data={chartData}
              options={{
                cutout: '70%',
                plugins: { legend: { display: false } },
                animation: { animateRotate: false },
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-5xl font-bold">{displayedScore}%</span>
              <span className={`font-semibold ${riskLevel.textColor}`}>
                {riskLevel.emoji} {riskLevel.label}
              </span>
            </div>
          </motion.div>

          <p className="text-xl mb-4">{getFeedbackMessage()}</p>
          
          {/* Funny Quote */}
          {currentQuote && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-lg italic mb-8 text-gray-300"
            >
              "{currentQuote}"
            </motion.p>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowDetails(!showDetails)}
            className={`px-6 py-3 rounded-lg font-bold mb-8 ${riskLevel.bgColor}`}
          >
            {showDetails ? 'Hide Details' : 'Show Breakdown'}
          </motion.button>

          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden bg-gray-800/80 backdrop-blur-sm rounded-lg text-left"
              >
                {/* ... rest of your details content ... */}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.section>
    </div>
  );
}
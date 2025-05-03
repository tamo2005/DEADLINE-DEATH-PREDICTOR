import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

// Remove Howler since we can't access audio files directly
// const tickSound = new Howl({ src: ['/sounds/tick.mp3'], loop: true });

const getRiskLevel = (score) => {
  if (score < 30) return { label: 'Safe', color: 'green-400', emoji: '🛡️' };
  if (score < 70) return { label: 'Moderate', color: 'yellow-400', emoji: '⚠️' };
  return { label: 'High', color: 'red-500', emoji: '🔥' };
};

export default function Results({ tasks = [], habits = {} }) {
  const [riskScore, setRiskScore] = useState(0);
  const [displayedScore, setDisplayedScore] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  // Risk Calculation
  const calculateRisk = () => {
    if (!tasks.length) return 0;
    const totalHours = tasks.reduce((sum, t) => sum + t.hours, 0);
    const avgPerDay = totalHours / 7;
    let score = Math.min(avgPerDay * 10, 100);

    if (habits.procrastination === 'lastmin') score *= 1.5;
    if (habits.multitasking === 'often') score *= 1.2;

    return Math.min(Math.round(score), 100);
  };

  useEffect(() => {
    const score = calculateRisk();
    setRiskScore(score);

    // Remove audio-related code since we can't access audio files
    // tickSound.play();
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
        // tickSound.stop();
      }
    };

    animateScore();
    // return () => tickSound.stop();
  }, [tasks, habits]);

  const riskLevel = getRiskLevel(riskScore);

  const chartData = {
    labels: ['Completed', 'Remaining'],
    datasets: [{
      data: [displayedScore, 100 - displayedScore],
      backgroundColor: ['#10B981', '#374151'],
      borderWidth: 0,
    }],
  };

  const getFeedbackMessage = () => {
    if (riskLevel.label === "Safe") return "You're on track! Keep it up.";
    if (riskLevel.label === "Moderate") return "Caution! Prioritize wisely.";
    return "Warning! You need a focused sprint now!";
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen py-16 bg-gray-900 text-white"
    >
      <div className="container mx-auto px-4 max-w-3xl text-center">
        <h2 className="text-4xl font-bold mb-6">Your Deadline Doom Results</h2>

        {/* Score Chart */}
        <div className="relative w-64 h-64 mx-auto mb-8">
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
            <span className={`font-semibold text-${riskLevel.color}`}>
              {riskLevel.emoji} {riskLevel.label}
            </span>
          </div>
        </div>

        <p className="text-xl mb-8">{getFeedbackMessage()}</p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowDetails(!showDetails)}
          className={`px-6 py-3 rounded-lg font-bold mb-8 bg-${riskLevel.color}`}
        >
          {showDetails ? 'Hide Details' : 'Show Breakdown'}
        </motion.button>

        {/* Task + Habit Breakdown */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden bg-gray-800 rounded-lg text-left"
            >
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-4">Task Breakdown</h3>
                  <div className="space-y-4">
                    {tasks.map((task, index) => {
                      const daysLeft = Math.ceil((new Date(task.deadline) - new Date()) / (1000 * 60 * 60 * 24));
                      const hoursPerDay = task.hours / Math.max(1, daysLeft);
                      const taskRisk = Math.min(Math.round(hoursPerDay * 10), 100);
                      const taskLevel = getRiskLevel(taskRisk);

                      return (
                        <div key={index} className="p-4 bg-gray-700 rounded">
                          <div className="flex justify-between mb-2">
                            <span className="font-semibold">{task.title}</span>
                            <span className={`text-${taskLevel.color}`}>{taskRisk}%</span>
                          </div>
                          <div className="h-2 bg-gray-600 rounded-full overflow-hidden">
                            <div
                              className={`bg-${taskLevel.color} h-full`}
                              style={{ width: `${taskRisk}%` }}
                            />
                          </div>
                          <div className="mt-2 text-sm text-gray-300">
                            {task.hours}h over {daysLeft} days = ~{hoursPerDay.toFixed(1)}h/day
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold mb-4">Habit Analysis</h3>
                  <pre className="bg-gray-600 p-4 rounded overflow-x-auto">
                    {JSON.stringify(habits, null, 2)}
                  </pre>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
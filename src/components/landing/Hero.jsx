import { motion } from 'framer-motion';
import { useLottie } from 'lottie-react';
import { useRef } from 'react';
import clockAnimation from "../../assets/animations/clock.json";

export default function Hero({ onStart }) {
  const scrollToRef = useRef(null);
  const { View } = useLottie({
    animationData: clockAnimation,
    loop: true,
    autoplay: true,
  });

  return (
    <section className="min-h-screen  text-white">
      <div className="container mx-auto px-4 py-20 flex flex-col items-center">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-64 h-64 mb-8"
        >
          {View}
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-5xl font-bold mb-4 text-center"
        >
          Deadline Death Predictor
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-xl mb-8 text-center max-w-2xl"
        >
          Your deadlines are watching... Are you ready?
        </motion.p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-red-500 px-8 py-3 rounded-full font-bold text-lg"
          onClick={() => {
            console.log("Button clicked in Hero");
            onStart(); // Use prop like in your working version
          }}
        >
          Find Your Doom Score
        </motion.button>
      </div>
    </section>
  );
}

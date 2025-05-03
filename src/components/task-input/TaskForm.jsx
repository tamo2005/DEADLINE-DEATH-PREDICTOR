import { useState } from 'react';
import { motion } from 'framer-motion';

const TASK_TYPES = [
  { id: 'assignment', emoji: '📝', label: 'Assignment' },
  { id: 'work', emoji: '💼', label: 'Work Project' },
  { id: 'personal', emoji: '🏠', label: 'Personal' },
  { id: 'exam', emoji: '📚', label: 'Exam' },
];

export default function TaskForm({ onTasksSubmit }) {
  const [tasks, setTasks] = useState([{ title: '', deadline: '', hours: 1, type: 'assignment' }]);
  
  const addTask = () => {
    setTasks([...tasks, { title: '', deadline: '', hours: 1, type: 'assignment' }]);
  };
  
  const updateTask = (index, field, value) => {
    const newTasks = [...tasks];
    newTasks[index][field] = value;
    setTasks(newTasks);
  };
  
  const removeTask = (index) => {
    if (tasks.length <= 1) return;
    setTasks(tasks.filter((_, i) => i !== index));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validTasks = tasks.filter(task => {
      if (!task.title || !task.deadline || task.hours <= 0) return false;
      
      const deadlineDate = new Date(task.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return deadlineDate >= today;
    });
    
    if (validTasks.length === 0) {
      alert('Please add at least one valid task with a future deadline');
      return;
    }
    
    onTasksSubmit(validTasks);
  };

  return (
    <section className="py-16 text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Enter Your Impending Doom</h2>
        
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          {tasks.map((task, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="mb-6 p-6 bg-gray-700 rounded-lg"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Task #{index + 1}</h3>
                {tasks.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTask(index)}
                    className="text-red-400 hover:text-red-300"
                  >
                    Remove
                  </button>
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block mb-2">Task Name</label>
                  <input
                    type="text"
                    value={task.title}
                    onChange={(e) => updateTask(index, 'title', e.target.value)}
                    className="w-full p-3 bg-gray-600 rounded"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2">Deadline</label>
                    <input
                      type="date"
                      value={task.deadline}
                      onChange={(e) => updateTask(index, 'deadline', e.target.value)}
                      className="w-full p-3 bg-gray-600 rounded"
                      required
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-2">Estimated Hours</label>
                    <input
                      type="number"
                      min="1"
                      value={task.hours}
                      onChange={(e) => updateTask(index, 'hours', parseInt(e.target.value) || 1)}
                      className="w-full p-3 bg-gray-600 rounded"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block mb-2">Task Type</label>
                  <div className="flex flex-wrap gap-2">
                    {TASK_TYPES.map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => updateTask(index, 'type', type.id)}
                        className={`flex items-center px-4 py-2 rounded-full transition-colors ${
                          task.type === type.id ? 'bg-red-500' : 'bg-gray-600 hover:bg-gray-500'
                        }`}
                      >
                        <span className="mr-2">{type.emoji}</span>
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <motion.button
              type="button"
              onClick={addTask}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-6 py-3 bg-gray-600 rounded-lg"
            >
              Add Another Task
            </motion.button>
            
            <motion.button
              type="submit"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-6 py-3 bg-red-500 rounded-lg font-bold"
            >
              Calculate My Doom
            </motion.button>
          </div>
        </form>
      </div>
    </section>
  );
}
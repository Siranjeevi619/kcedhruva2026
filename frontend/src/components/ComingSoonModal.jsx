import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Calendar, Sparkles, Timer } from 'lucide-react';

const ComingSoonModal = ({ isOpen, onClose }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-lg bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-[2.5rem] p-8 md:p-12 overflow-hidden shadow-[0_0_50px_rgba(59,130,246,0.2)]"
                    >
                        {/* Animated Background Elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] -mr-32 -mt-32" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/10 rounded-full blur-[80px] -ml-32 -mb-32" />

                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-all border border-white/5"
                        >
                            <X size={20} />
                        </button>

                        <div className="relative z-10 text-center">
                            {/* Icon Animation */}
                            <motion.div
                                animate={{
                                    y: [-10, 10, -10],
                                    rotate: [0, 5, -5, 5, 0]
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="inline-flex p-5 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl mb-8 border border-white/10 shadow-inner"
                            >
                                <Timer size={48} className="text-blue-400" />
                            </motion.div>

                            <h2 className="text-4xl md:text-5xl font-black mb-4 leading-tight italic">
                                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                    Registration Opening Soon!
                                </span>
                            </h2>

                            <p className="text-gray-400 text-lg mb-10 max-w-sm mx-auto leading-relaxed">
                                We're adding the final touches to some spectacular experiences. Stay tuned for the biggest event launch!
                            </p>

                            <div className="grid grid-cols-2 gap-4 mb-10">
                                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                    <Sparkles className="text-yellow-400 mx-auto mb-2" size={24} />
                                    <span className="text-xs text-gray-400 uppercase tracking-widest font-bold">New Events</span>
                                </div>
                                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                    <Calendar className="text-green-400 mx-auto mb-2" size={24} />
                                    <span className="text-xs text-gray-400 uppercase tracking-widest font-bold">2026 Edition</span>
                                </div>
                            </div>

                            <button
                                onClick={onClose}
                                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2 group"
                            >
                                <Bell size={20} className="group-hover:animate-bounce" />
                                Notify Me
                            </button>

                            <p className="mt-4 text-[10px] text-gray-600 uppercase tracking-[0.2em]">
                                Prepare for the extraordinary
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ComingSoonModal;

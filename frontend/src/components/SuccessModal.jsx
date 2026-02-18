import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X, PartyPopper, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SuccessModal = ({ isOpen, onClose, title = "Success!", message = "Your registration has been confirmed." }) => {
    const navigate = useNavigate();

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
                        className="relative w-full max-w-lg bg-gradient-to-br from-gray-900 to-black border border-green-500/20 rounded-[2.5rem] p-8 md:p-12 overflow-hidden shadow-[0_0_50px_rgba(34,197,94,0.15)]"
                    >
                        {/* Animated Background Elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-green-600/10 rounded-full blur-[80px] -mr-32 -mt-32" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] -ml-32 -mb-32" />

                        <div className="relative z-10 text-center">
                            {/* Icon Animation */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                                transition={{ type: "spring", damping: 12, stiffness: 200 }}
                                className="inline-flex p-5 bg-green-500/20 rounded-3xl mb-8 border border-green-500/20"
                            >
                                <CheckCircle size={48} className="text-green-400" />
                            </motion.div>

                            <h2 className="text-4xl md:text-5xl font-black mb-4 italic tracking-tight">
                                <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                                    {title}
                                </span>
                            </h2>

                            <p className="text-gray-300 text-lg mb-10 max-w-sm mx-auto leading-relaxed">
                                {message}
                            </p>

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => {
                                        onClose();
                                        navigate('/');
                                    }}
                                    className="w-full py-4 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-green-500/20 flex items-center justify-center gap-2 group"
                                >
                                    Return Home
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </button>

                                <button
                                    onClick={onClose}
                                    className="w-full py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl transition-all border border-white/10"
                                >
                                    Dismiss
                                </button>
                            </div>

                            <div className="mt-8 flex justify-center gap-2">
                                <PartyPopper className="text-green-400 animate-bounce" size={20} />
                                <span className="text-[10px] text-gray-500 uppercase tracking-[0.3em]">Registration Confirmed</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default SuccessModal;

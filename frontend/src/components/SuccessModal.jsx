import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X, PartyPopper, ArrowRight, Home, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SuccessModal = ({ isOpen, onClose, title = "Success!", message = "Your registration has been confirmed." }) => {
    const navigate = useNavigate();

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center px-4 overflow-y-auto pt-20 pb-10">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/90 backdrop-blur-xl"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 40 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 40 }}
                        className="relative w-full max-w-[95%] sm:max-w-xl bg-[#0d0d0d] border border-green-500/20 rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 md:p-14 overflow-hidden shadow-[0_0_80px_rgba(34,197,94,0.15)]"
                    >
                        {/* Premium Glow Effects */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent" />
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-green-600/20 rounded-full blur-[100px]" />
                        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-600/20 rounded-full blur-[100px]" />

                        {/* Close Icon - Optional as we have buttons, but nice for UX */}
                        <button
                            onClick={onClose}
                            className="absolute top-8 right-8 p-3 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/10 group"
                        >
                            <X size={20} className="group-hover:rotate-90 transition-transform" />
                        </button>

                        <div className="relative z-10 text-center">
                            {/* Icon Animation */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                                transition={{ type: "spring", damping: 12, stiffness: 200 }}
                                className="inline-flex p-4 sm:p-6 bg-green-500/20 rounded-2xl sm:rounded-[2rem] mb-6 sm:mb-10 border border-green-500/30 shadow-2xl"
                            >
                                <CheckCircle size={48} className="text-green-400 sm:w-16 sm:h-16" />
                            </motion.div>

                            <h2 className="text-4xl sm:text-5xl md:text-7xl font-black mb-4 sm:mb-6 tracking-tighter leading-tight italic">
                                <span className="bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
                                    {title}
                                </span>
                            </h2>

                            <p className="text-gray-300 text-base sm:text-lg md:text-xl mb-8 sm:mb-12 max-w-sm mx-auto leading-relaxed">
                                {message}
                            </p>

                            <div className="flex flex-col gap-4">
                                <button
                                    onClick={() => {
                                        onClose();
                                        navigate('/');
                                    }}
                                    className="w-full py-4 sm:py-5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-black text-base sm:text-lg rounded-xl sm:rounded-[1.5rem] transition-all shadow-2xl shadow-green-500/30 flex items-center justify-center gap-3 group relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                    <Home size={20} className="relative z-10 sm:w-5 sm:h-5" />
                                    <span className="relative z-10">Return to Portal</span>
                                    <ArrowRight size={20} className="relative z-10 group-hover:translate-x-2 transition-transform sm:w-5 sm:h-5" />
                                </button>

                                <button
                                    onClick={onClose}
                                    className="w-full py-4 sm:py-5 bg-white/5 hover:bg-white/10 text-white font-bold text-sm sm:text-base rounded-xl sm:rounded-[1.5rem] transition-all border border-white/10 flex items-center justify-center gap-2"
                                >
                                    Keep Exploring
                                </button>
                            </div>

                            <div className="mt-12 flex items-center justify-center gap-3">
                                <div className="h-px w-8 bg-white/10" />
                                <PartyPopper className="text-green-400 animate-pulse" size={24} />
                                <span className="text-[11px] text-gray-500 uppercase tracking-[0.5em] font-black">Success</span>
                                <div className="h-px w-8 bg-white/10" />
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default SuccessModal;

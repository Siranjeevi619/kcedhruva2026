import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Calendar, Sparkles, Timer, CheckCircle, Smartphone, Mail, User } from 'lucide-react';

const ComingSoonModal = ({ isOpen, onClose, isPreRegistration = false }) => {
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        if (isOpen && isPreRegistration) {
            setIsSaved(true);
        }
    }, [isOpen, isPreRegistration]);

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
                        className="relative w-full max-w-[95%] sm:max-w-xl bg-[#0d0d0d] border border-white/10 rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 md:p-14 overflow-hidden shadow-[0_0_80px_rgba(59,130,246,0.15)]"
                    >
                        {/* Premium Glow Effects */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/20 rounded-full blur-[100px]" />
                        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-600/20 rounded-full blur-[100px]" />

                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 sm:top-8 sm:right-8 p-2 sm:p-3 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl sm:rounded-2xl transition-all border border-white/10 group z-50"
                        >
                            <X size={18} className="group-hover:rotate-90 transition-transform" />
                        </button>

                        <div className="relative z-10 text-center">
                            {/* Icon Animation */}
                            <motion.div
                                animate={isSaved ? { scale: [1, 1.1, 1] } : {
                                    y: [-5, 5, -5],
                                    rotate: [0, 2, -2, 0]
                                }}
                                transition={{
                                    duration: isSaved ? 0.5 : 5,
                                    repeat: isSaved ? 0 : Infinity,
                                    ease: "easeInOut"
                                }}
                                className={`inline-flex p-4 sm:p-6 rounded-2xl sm:rounded-[2rem] mb-6 sm:mb-10 border shadow-2xl ${isSaved ? 'bg-green-500/20 border-green-500/30' : 'bg-blue-500/10 border-white/10'}`}
                            >
                                {isSaved ? (
                                    <CheckCircle size={40} className="text-green-400 sm:w-14 sm:h-14" />
                                ) : (
                                    <Timer size={40} className="text-blue-400 sm:w-14 sm:h-14" />
                                )}
                            </motion.div>

                            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black mb-4 sm:mb-6 leading-[1.1] tracking-tighter">
                                {isSaved ? (
                                    <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                                        You're on the List!
                                    </span>
                                ) : (
                                    <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent italic">
                                        Stay Tuned.<br className="hidden sm:block" />Stay Ahead.
                                    </span>
                                )}
                            </h2>

                            <p className="text-gray-400 text-base sm:text-lg md:text-xl mb-8 sm:mb-12 max-w-sm mx-auto leading-relaxed">
                                {isSaved
                                    ? "We've captured your interest! You'll be the first to know the moment registrations go live."
                                    : "Our team is crafting something legendary. Don't miss out on the launch of Dhruva 2026."}
                            </p>

                            <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12">
                                <div className="group bg-white/5 border border-white/10 p-4 sm:p-6 rounded-2xl sm:rounded-[2rem] hover:bg-white/10 hover:border-blue-500/30 transition-all duration-500">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500/20 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                                        <Sparkles className="text-blue-400" size={20} />
                                    </div>
                                    <span className="text-[8px] sm:text-[10px] text-gray-400 uppercase tracking-[0.2em] font-black block">Exclusive Access</span>
                                </div>
                                <div className="group bg-white/5 border border-white/10 p-4 sm:p-6 rounded-2xl sm:rounded-[2rem] hover:bg-white/10 hover:border-purple-500/30 transition-all duration-500">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500/20 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                                        <Bell className="text-purple-400" size={20} />
                                    </div>
                                    <span className="text-[8px] sm:text-[10px] text-gray-400 uppercase tracking-[0.2em] font-black block">Tier-1 Alerts</span>
                                </div>
                            </div>

                            <button
                                onClick={onClose}
                                className={`w-full py-5 rounded-[1.5rem] font-black text-lg transition-all shadow-2xl flex items-center justify-center gap-3 group relative overflow-hidden ${isSaved
                                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 shadow-green-500/20'
                                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-500/20'
                                    }`}
                            >
                                <motion.div
                                    className="absolute inset-0 bg-white/10"
                                    initial={{ x: '-100%' }}
                                    whileHover={{ x: '100%' }}
                                    transition={{ duration: 0.6 }}
                                />
                                {isSaved ? (
                                    <>Awesome</>
                                ) : (
                                    <>
                                        <Bell size={22} className="group-hover:rotate-12 transition-transform" />
                                        Keep me Updated
                                    </>
                                )}
                            </button>

                            <div className="mt-10 pt-8 border-t border-white/5">
                                <span className="text-[11px] text-gray-600 uppercase tracking-[0.4em] font-bold">
                                    Powered by KCE Events
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ComingSoonModal;

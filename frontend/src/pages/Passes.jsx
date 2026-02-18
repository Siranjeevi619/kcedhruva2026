import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import { Ticket, CheckCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_URL } from '../utils/config';

import Doodles from '../components/Doodles';

const CardDoodles = ({ variant }) => {
    switch (variant) {
        case 0: // Geometric / Star
            return (
                <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none opacity-10">
                    <svg className="absolute -top-4 -right-4 w-24 h-24 text-white animate-spin-slow" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10z" /></svg>
                    <svg className="absolute bottom-4 -left-4 w-20 h-20 text-black rotate-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M8 12h8" /></svg>
                    <svg className="absolute top-1/2 right-4 w-12 h-12 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12l16 0" /><path d="M12 4l0 16" /><circle cx="12" cy="12" r="10" /></svg>
                </div>
            );
        case 1: // Ticket / Dots
            return (
                <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none opacity-10">
                    <svg className="absolute top-10 left-10 w-14 h-14 text-white opacity-40 animate-bounce-slow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18v12H3z" /><path d="M3 11a2 2 0 012-2 2 2 0 01-2-2" /><path d="M21 11a2 2 0 00-2-2 2 2 0 002-2" /></svg>
                    <svg className="absolute bottom-10 right-10 w-16 h-16 text-black opacity-50" viewBox="0 0 24 24" fill="currentColor"><circle cx="4" cy="4" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="20" cy="4" r="2" /></svg>
                    <svg className="absolute top-4 right-1/4 w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12h20M12 2v20" /></svg>
                </div>
            );
        case 2: // Tech / Abstract
            return (
                <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none opacity-10">
                    <svg className="absolute -bottom-8 -right-8 w-32 h-32 text-black opacity-30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M12 2a10 10 0 0 1 10 10 10 10 0 0 1-10 10A10 10 0 0 1 2 12 10 10 0 0 1 12 2zM12 6v6l4 2" /></svg>
                    <svg className="absolute top-6 left-6 w-12 h-12 text-white animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
                </div>
            );
        case 3: // Music / Fun
        default:
            return (
                <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none opacity-10">
                    <svg className="absolute top-4 right-4 w-16 h-16 text-white rotate-45" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18V5l12-2v13" /><path d="M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" /><path d="M21 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" /></svg>
                    <svg className="absolute bottom-4 left-4 w-12 h-12 text-black animate-bounce-slow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                </div>
            );
    }
};

const Passes = ({ embed = false }) => {
    const navigate = useNavigate();
    const [passes, setPasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showGrid, setShowGrid] = useState(false);
    const [showPayment, setShowPayment] = useState({ show: false, pass: null });

    useEffect(() => {
        const fetchPasses = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/passes`);
                setPasses(data.filter(p => p.isActive));
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchPasses();
    }, []);

    // Advanced Color Mapping for Contrast
    // Returns: { bgClass, textPrimary, textSecondary, borderClass, iconClass }
    const getColorStyles = (color) => {
        switch (color) {
            case 'yellow':
                return {
                    bg: 'bg-gradient-to-br from-yellow-400 to-yellow-500',
                    border: 'border-yellow-600',
                    shadow: 'hover:shadow-yellow-500/30',
                    text: 'text-black',
                    subText: 'text-black/70',
                    icon: 'text-black'
                };
            // Default Gradients
            case 'orange':
            case 'blue': return { bg: 'bg-gradient-to-br from-orange-500 to-orange-600', border: 'border-orange-500/50', shadow: 'hover:shadow-orange-500/30', text: 'text-black', subText: 'text-black', icon: 'text-black' };
            case 'red': return { bg: 'bg-gradient-to-br from-rose-500 to-red-600', border: 'border-rose-500/50', shadow: 'hover:shadow-rose-500/30', text: 'text-black', subText: 'text-black', icon: 'text-black' };
            case 'green': return { bg: 'bg-gradient-to-br from-emerald-500 to-green-600', border: 'border-emerald-500/50', shadow: 'hover:shadow-emerald-500/30', text: 'text-black', subText: 'text-black', icon: 'text-black' };
            case 'purple': return { bg: 'bg-gradient-to-br from-violet-500 to-purple-600', border: 'border-violet-500/50', shadow: 'hover:shadow-violet-500/30', text: 'text-black', subText: 'text-black', icon: 'text-black' };
            case 'pink': return { bg: 'bg-gradient-to-br from-fuchsia-500 to-pink-600', border: 'border-fuchsia-500/50', shadow: 'hover:shadow-fuchsia-500/30', text: 'text-black', subText: 'text-black', icon: 'text-black' };

            default: return { bg: 'bg-gradient-to-br from-cyan-700 to-cyan-800', border: 'border-gray-600', shadow: '', text: 'text-black', subText: 'text-black', icon: 'text-black' };
        }
    };

    return (
        <div className={`${!embed ? 'min-h-screen bg-[#0a0a0a]' : ''} text-white font-inter pt-10 min-h-screen bg-[radial-gradient(circle_at_top_left,_#1e3a8a_0%,_#0f172a_35%,_#1e1b4b_60%,_#7c2d92_80%,_#be185d_100%)] relative`}>
            {!embed && <Navbar />}
            <Doodles />

            <div className={`${!embed ? 'pt-24 sm:pt-32' : 'pt-10'} pb-20 px-4 sm:px-6 max-w-7xl mx-auto`}>
                <div className="text-center mb-10 sm:mb-16">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-br from-green-400 via-orange-500 to-red-500 tracking-tight">
                        Get Your Access
                    </h1>
                    <p className="text-gray-400 text-base sm:text-lg max-w-md mx-auto">Choose the perfect pass for the ultimate experience</p>
                </div>

                {loading ? <Loader text="Loading passes..." /> : (
                    <AnimatePresence mode="wait">
                        {!showGrid ? (
                            <motion.div
                                key="intro-card"
                                className="flex justify-center items-center py-20 min-h-[50vh]"
                                initial={{ y: -400, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ scale: [1, 1.1, 0.5], opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } }}
                                transition={{ type: "spring", stiffness: 100, damping: 20, duration: 0.7 }}
                                onAnimationComplete={() => {
                                    setTimeout(() => setShowGrid(true), 500); // Brief pause before transforming
                                }}
                            >
                                {/* Intro Hero Card - Representative of the first pass or a generic style */}
                                {passes.length > 0 && (
                                    <motion.div
                                        className="relative w-full max-w-md transform scale-110"
                                        animate={{
                                            y: [-10, 10, -10],
                                            rotate: [0, 5, -5, 5, 0],
                                        }}
                                        transition={{
                                            duration: 4,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                    >
                                        {/* Cloning the card UI for the intro */}
                                        {(() => {
                                            const pass = passes[0]; // Use first pass as hero
                                            const styles = getColorStyles(pass.color || 'orange');
                                            return (
                                                <div className={`relative flex flex-col h-full ${styles.bg} text-white border ${styles.border} rounded-3xl p-8 shadow-2xl ${styles.shadow}`}>
                                                    <CardDoodles variant={0} />
                                                    <div className="mb-6 montserrat-light text-white">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <h3 className={`text-2xl font-bold ${styles.text}`}>Dhruva Access</h3>
                                                            <span className={`text-[12px] font-bold px-2 py-0.5 rounded uppercase bg-white/20 text-black`}>
                                                                OFFICIAL
                                                            </span>
                                                        </div>
                                                        <div className={`text-4xl font-bold ${styles.text}`}>
                                                            Get Ready
                                                        </div>
                                                    </div>
                                                    <div className="space-y-4 mb-8">
                                                        <div className={`flex items-start gap-3 text-sm ${styles.subText}`}>
                                                            <CheckCircle size={18} className={`${styles.icon} shrink-0 mt-0.5`} />
                                                            <span>Unlimited Events</span>
                                                        </div>
                                                        <div className={`flex items-start gap-3 text-sm ${styles.subText}`}>
                                                            <CheckCircle size={18} className={`${styles.icon} shrink-0 mt-0.5`} />
                                                            <span>Exclusive Perks</span>
                                                        </div>
                                                    </div>
                                                    <div className="w-full mt-auto py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-black bg-white/20 backdrop-blur-md border border-white/30">
                                                        Unlock Experience <ArrowRight size={18} className="text-black" />
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                    </motion.div>
                                )}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="pass-grid"
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center"
                                initial="hidden"
                                animate="visible"
                                variants={{
                                    hidden: { opacity: 0 },
                                    visible: {
                                        opacity: 1,
                                        transition: {
                                            staggerChildren: 0.15
                                        }
                                    }
                                }}
                            >
                                {passes.map((pass, i) => {
                                    const styles = getColorStyles(pass.color || 'orange');

                                    return (
                                        <motion.div
                                            key={pass._id}
                                            variants={{
                                                hidden: { y: 100, opacity: 0 },
                                                visible: {
                                                    y: 0,
                                                    opacity: 1,
                                                    transition: {
                                                        type: "spring",
                                                        stiffness: 100,
                                                        damping: 20
                                                    }
                                                }
                                            }}
                                            className="h-full"
                                        >
                                            <motion.div
                                                className={`relative flex flex-col h-full ${styles.bg} text-white hover- bg-opacity-10 border ${styles.border} rounded-3xl p-8 hover:transform hover:-translate-y-2 transition-all duration-300 group hover:shadow-2xl ${styles.shadow}`}
                                                animate={{
                                                    y: [-10, 10, -10],
                                                    rotate: [0, 2, -2, 2, 0],
                                                }}
                                                transition={{
                                                    duration: 6,
                                                    repeat: Infinity,
                                                    ease: "easeInOut",
                                                    delay: i * 0.2 // Staggered delay for each card
                                                }}
                                            >

                                                {/* Card Doodles */}
                                                <CardDoodles variant={i % 4} />

                                                <div className="mb-6 montserrat-light text-white hover:text-gray-200 transition-colors duration-300">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h3 className={`text-2xl font-bold ${styles.text}`}>{pass.name}</h3>
                                                        <span className={`text-[12px] font-bold px-2 py-0.5 rounded uppercase bg-white/20 text-black`}>
                                                            {pass.type || 'Individual'}
                                                        </span>
                                                    </div>
                                                    <div className={`text-4xl font-bold ${styles.text}`}>
                                                        ₹{pass.price}/-
                                                        {/* <span className={`text-sm font-normal ml-1 ${styles.subText}`}>/person</span> */}
                                                    </div>
                                                </div>

                                                <div className="space-y-4 mb-8">
                                                    {pass.perks.map((perk, i) => (
                                                        <div key={i} className={`flex items-start gap-3 text-sm ${styles.subText}`}>
                                                            <CheckCircle size={18} className={`${styles.icon} shrink-0 mt-0.5`} />
                                                            <span>{perk}</span>
                                                        </div>
                                                    ))}
                                                </div>

                                                <button
                                                    onClick={() => navigate('/select-events', { state: { pass } })}
                                                    className="w-full mt-auto py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-black bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 transition-all"
                                                >
                                                    Buy Pass <ArrowRight size={18} className="text-black" />
                                                </button>

                                            </motion.div>
                                        </motion.div>
                                    );
                                })}
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}
            </div>

            {!embed && <Footer />}
        </div>
    );
};

export default Passes;

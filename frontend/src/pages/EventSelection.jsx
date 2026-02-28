import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useGlobalConfig } from '../context/GlobalConfigContext';
import { API_URL } from '../utils/config';
import ComingSoonModal from '../components/ComingSoonModal';
import SuccessModal from '../components/SuccessModal';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, GraduationCap, Building2, MapPin, CreditCard, ChevronRight, Sparkles, Trophy, Ticket } from 'lucide-react';
import Doodles from '../components/Doodles';

const EventSelection = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { pass } = location.state || {}; // Expect pass object
    const { config } = useGlobalConfig();

    const [formData, setFormData] = useState({
        studentName: '',
        rollNumber: '',
        email: '',
        phone: '',
        department: '',
        customDepartment: '',
        year: '',
        college: '',
        district: '',
        state: '',
        pass: pass?._id || '',
    });
    const [passes, setPasses] = useState([]);
    const [currentPass, setCurrentPass] = useState(pass);
    const [submitting, setSubmitting] = useState(false);
    const [showComingSoon, setShowComingSoon] = useState(false);
    const [successState, setSuccessState] = useState({ show: false, title: '', message: '', ticketId: '' });

    // Sports Specific State
    const [sportsEvents, setSportsEvents] = useState([]);
    const [selectedSportEventId, setSelectedSportEventId] = useState('');
    const [dynamicPrice, setDynamicPrice] = useState(null);

    const isSportsPass = currentPass?.name?.toLowerCase().includes('sports');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: passesData } = await axios.get(`${API_URL}/passes`);
                setPasses(passesData.filter(p => p.isActive));

                if (isSportsPass) {
                    fetchSportsEvents();
                } else {
                    setDynamicPrice(currentPass?.price);
                }
            } catch (error) {
                console.error("Failed to fetch data", error);
            }
        };

        if (!currentPass) {
            navigate('/passes');
            return;
        }
        fetchData();
    }, [currentPass, navigate, isSportsPass]);

    const fetchSportsEvents = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/events`);
            // Filter strictly for sports events
            const sports = data.filter(e => e.category === 'Sports');
            setSportsEvents(sports);
        } catch (error) {
            console.error("Failed to fetch sports events", error);
        }
    };

    const handleSportSelect = (e) => {
        const eventId = e.target.value;
        setSelectedSportEventId(eventId);
        const event = sportsEvents.find(ev => ev._id === eventId);
        if (event) {
            setDynamicPrice(event.teamPrice || currentPass?.price);
        } else {
            setDynamicPrice(currentPass?.price);
        }
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === 'pass') {
            const selected = passes.find(p => p._id === value);
            if (selected) {
                setCurrentPass(selected);
                setDynamicPrice(selected.price);
                // Clear sports selection if switching away from sports pass
                if (!selected.name.toLowerCase().includes('sports')) {
                    setSelectedSportEventId('');
                }
                // Scroll to top to show updated pass details
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        if (config.registration_open === 'false') {
            try {
                const payload = {
                    passId: currentPass?._id,
                    eventIds: selectedSportEventId ? [selectedSportEventId] : [],
                    ...formData,
                    department: formData.department === 'Other' ? formData.customDepartment : formData.department
                };
                delete payload.customDepartment;
                await axios.post(`${API_URL}/registrations/pre-register`, payload);
                setShowComingSoon(true);
            } catch (err) {
                console.error(err);
                alert(err.response?.data?.message || 'Failed to register interest');
            } finally {
                setSubmitting(false);
            }
            return;
        }
        try {
            const payload = {
                passId: currentPass?._id,
                eventIds: selectedSportEventId ? [selectedSportEventId] : [],
                ...formData,
                department: formData.department === 'Other' ? formData.customDepartment : formData.department
            };
            delete payload.customDepartment;

            const { data: regData } = await axios.post(`${API_URL}/registrations`, payload);

            // Check if payment was bypassed
            if (regData.paymentStatus === 'Completed' || regData.paymentStatus === 'Bypassed') {
                setSuccessState({
                    show: true,
                    title: 'Registration Successful!',
                    message: "Welcome to Dhruva! Your registration has been confirmed. See you at the event!",
                    ticketId: regData.ticketId
                });
                setSubmitting(false);
                return;
            }

            // Razorpay Checkout
            const options = {
                key: window.RAZORPAY_KEY_ID || 'rzp_test_5h5Hk8zY9I1qV3',
                amount: Math.round((parseFloat(regData.amount.toString().split('/')[0]) || 0) * 100),
                currency: 'INR',
                name: `${config.website_name || 'Dhruva'} ${config.event_year || '2026'}`,
                description: `Payment for ${currentPass?.name}`,
                handler: async function (response) {
                    try {
                        await axios.post(`${API_URL}/payment/verify`, {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            registrationId: regData.registrationId
                        });
                        setSuccessState({
                            show: true,
                            title: 'Payment Successful!',
                            message: "Your payment has been verified and registration is confirmed. Get ready for an epic experience!",
                            ticketId: regData.ticketId
                        });
                    } catch (err) {
                        alert('Payment verification failed. Please contact support.');
                    }
                },
                prefill: {
                    name: formData.studentName,
                    pass: formData.pass,
                    department: formData.department,
                    year: formData.year,
                    college: formData.college,
                    district: formData.district,
                    email: formData.email,
                    contact: formData.phone
                },
                theme: { color: '#8b5cf6' },
                modal: {
                    ondismiss: async function () {
                        try {
                            await axios.post(`${API_URL}/payment/failed`, {
                                registrationId: regData.registrationId,
                                reason: 'Payment modal closed by user'
                            });
                        } catch (err) {
                            console.error('Failed to log payment cancellation', err);
                        }
                    }
                }
            };

            try {
                const { data: order } = await axios.post(`${API_URL}/payment/order`, {
                    amount: regData.amount,
                    receipt: regData.registrationId
                });
                if (order && order.id) {
                    options.order_id = order.id;
                }
            } catch (err) {
                console.warn("Failed to create official order, proceeding.", err);
            }

            const rzp = new window.Razorpay(options);

            // Add failure listener for specific payment errors
            rzp.on('payment.failed', async function (response) {
                try {
                    await axios.post(`${API_URL}/payment/failed`, {
                        registrationId: regData.registrationId,
                        reason: response.error.description || 'Payment failed at gateway'
                    });
                } catch (err) {
                    console.error('Failed to log payment failure', err);
                }
            });

            rzp.open();
            setSubmitting(false);
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Registration failed');
            setSubmitting(false);
        }
    };

    const getPassColorGradient = (color) => {
        switch (color?.toLowerCase()) {
            case 'orange': return 'from-orange-400 via-orange-500 to-red-500';
            case 'yellow': return 'from-yellow-300 via-yellow-400 to-orange-400';
            case 'red': return 'from-red-400 via-rose-500 to-red-600';
            case 'green': return 'from-emerald-400 via-green-500 to-emerald-600';
            case 'purple': return 'from-violet-400 via-purple-500 to-fuchsia-600';
            case 'pink': return 'from-pink-400 via-rose-400 to-fuchsia-500';
            case 'blue': return 'from-blue-400 via-cyan-500 to-blue-600';
            default: return 'from-white via-white to-white/50';
        }
    };

    if (!pass) return null;

    return (
        <div className="min-h-screen bg-[#050510] text-white font-inter flex flex-col relative overflow-x-hidden">
            {/* Premium Dynamic Background */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-600/20 rounded-full blur-[120px] animate-pulse-slow" />
                <div className="absolute top-[20%] right-[-5%] w-[35%] h-[35%] bg-fuchsia-600/10 rounded-full blur-[120px] animate-float" />
                <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] bg-cyan-600/10 rounded-full blur-[120px] animate-pulse-slow delay-1000" />
                <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] bg-blue-600/20 rounded-full blur-[120px] animate-float delay-500" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#050510_90%)]" />
                <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" />
            </div>

            <Doodles />
            <Navbar />

            <main className="flex-1 relative z-10 max-w-4xl mx-auto w-full px-4 pt-28 pb-12">
                {/* Hero Section with Glassmorphism */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10 p-1 rounded-3xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 shadow-[0_0_50px_-12px_rgba(139,92,246,0.5)]"
                >
                    <div className="bg-black/80 backdrop-blur-xl rounded-[22px] p-6 sm:p-10 text-center relative overflow-hidden">
                        {/* Decorative background circle */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-violet-600/20 rounded-full blur-3xl" />

                        <h1 className={`text-3xl sm:text-5xl font-black mb-2 bg-clip-text text-transparent bg-gradient-to-r ${getPassColorGradient(currentPass?.color)}`}>
                            {currentPass?.name}
                        </h1>

                        {currentPass?.perks && Array.isArray(currentPass.perks) && (
                            <div className="flex flex-wrap justify-center gap-2 mb-8 max-w-2xl mx-auto">
                                {currentPass.perks.filter(p => p).map((perk, i) => (
                                    <span key={i} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs sm:text-sm text-gray-400 flex items-center gap-2">
                                        <div className="w-1 h-1 rounded-full bg-violet-400" />
                                        {perk}
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className="inline-block p-1 rounded-2xl bg-white/5 border border-white/10">
                            <div className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">
                                {isSportsPass && !selectedSportEventId ? (
                                    <span className="text-sm sm:text-base text-gray-500 font-bold uppercase tracking-widest">Select Sport for Pricing</span>
                                ) : (
                                    `₹${dynamicPrice || currentPass?.price}`
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Form Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl overflow-hidden relative"
                >
                    {/* Corner gradient hits */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-500/10 blur-3xl" />

                    <div className="flex items-center gap-4 mb-10 pb-4 border-b border-white/10">
                        <div className="p-3 bg-violet-500/20 rounded-xl text-violet-400">
                            <User size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight">Registration Details</h2>
                            <p className="text-gray-500 text-sm">Please fill in your academic information</p>
                        </div>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-8">
                        {isSportsPass && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-6 bg-gradient-to-br from-violet-600/10 to-blue-600/10 border border-violet-500/30 rounded-2xl relative overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Trophy size={80} />
                                </div>
                                <label className="flex items-center gap-2 text-sm font-bold text-violet-400 mb-4 uppercase tracking-wider">
                                    <Trophy size={18} /> Choose Your Sport
                                </label>
                                <select
                                    value={selectedSportEventId}
                                    onChange={handleSportSelect}
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-5 focus:border-violet-500 outline-none text-white transition-all appearance-none cursor-pointer [&>option]:bg-[#10101a]"
                                >
                                    <option value="">Click to select a sport</option>
                                    {sportsEvents.map(event => (
                                        <option key={event._id} value={event._id}>
                                            {event.title} ({event.gender || 'Open'}) - ₹{event.teamPrice}/Team
                                        </option>
                                    ))}
                                </select>
                            </motion.div>
                        )}

                        <div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Student Name</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-violet-400 transition-colors" size={20} />
                                    <input name="studentName" value={formData.studentName} onChange={handleFormChange} required placeholder="Enter full name" className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:border-violet-500 focus:bg-white/10 outline-none transition-all placeholder:text-gray-600" />
                                </div>
                            </div>
                            {/* <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Roll Number</label>
                                <div className="relative group">
                                    <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-violet-400 transition-colors" size={20} />
                                    <input name="rollNumber" value={formData.rollNumber} onChange={handleFormChange} required placeholder="College Roll ID" className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:border-violet-500 focus:bg-white/10 outline-none transition-all placeholder:text-gray-600" />
                                </div>
                            </div>*/}

                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Department</label>
                                <select
                                    name="department"
                                    value={formData.department}
                                    onChange={handleFormChange}
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-5 focus:border-violet-500 focus:bg-white/10 outline-none text-gray-300 transition-all [&>option]:bg-[#10101a]"
                                >
                                    <option value="">Select Dept</option>
                                    {/* Core Engineering */}
                                    <option value="AIDS">AIDS</option>
                                    <option value="CIVIL">CIVIL</option>
                                    <option value="CSD-CST">CSD-CST</option>
                                    <option value="CSE">CSE</option>
                                    <option value="CSECS">CSE(CY)</option>
                                    <option value="ECE">ECE</option>
                                    <option value="EEE">EEE</option>
                                    <option value="ETE-VLSI">ETE-VLSI</option>
                                    <option value="MECH">MECH</option>
                                    <option value="IT">IT</option>
                                    <option value="CHEM">CHEM</option>
                                    <option value="BIOTECH">BIOTECH</option>
                                    {/* Core Sciences */}
                                    <option value="PHYSICS">Physics</option>
                                    <option value="CHEMISTRY">Chemistry</option>
                                    <option value="MATHEMATICS">Mathematics</option>
                                    <option value="BIOLOGY">Biology</option>
                                    {/* Commerce & Management */}
                                    <option value="BCom">B.Com - Commerce</option>
                                    <option value="BBA">BBA - Business Administration</option>
                                    <option value="MBA">MBA - Master of Business Administration</option>
                                    <option value="Other">Other (Please Specify)</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Current Year</label>
                                <select name="year" value={formData.year} onChange={handleFormChange} required className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-5 focus:border-violet-500 focus:bg-white/10 outline-none text-gray-300 transition-all [&>option]:bg-[#10101a]">
                                    <option value="">Select Year</option>
                                    <option value="1">1st Year</option>
                                    <option value="2">2nd Year</option>
                                    <option value="3">3rd Year</option>
                                    <option value="4">4th Year</option>
                                    <option value="5">5th Year</option>
                                </select>
                            </div>
                        </div>

                        <AnimatePresence>
                            {formData.department === 'Other' && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="space-y-2"
                                >
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Specify Department</label>
                                    <div className="relative group">
                                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-violet-400 transition-colors" size={20} />
                                        <input
                                            name="customDepartment"
                                            value={formData.customDepartment}
                                            onChange={handleFormChange}
                                            required
                                            placeholder="Enter your department name"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:border-violet-500 focus:bg-white/10 outline-none transition-all placeholder:text-gray-600"
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Email ID</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-violet-400 transition-colors" size={20} />
                                    <input name="email" type="email" value={formData.email} onChange={handleFormChange} required placeholder="Email Address" className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:border-violet-500 focus:bg-white/10 outline-none transition-all placeholder:text-gray-600" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Phone Number</label>
                                <div className="relative group">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-violet-400 transition-colors" size={20} />
                                    <input name="phone" value={formData.phone} onChange={handleFormChange} required placeholder="Contact Number" className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:border-violet-500 focus:bg-white/10 outline-none transition-all placeholder:text-gray-600" />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">College / Institution</label>
                                <div className="relative group">
                                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-violet-400 transition-colors" size={20} />
                                    <input name="college" value={formData.college} onChange={handleFormChange} required placeholder="Institution Name" className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:border-violet-500 focus:bg-white/10 outline-none transition-all placeholder:text-gray-600" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">District / City</label>
                                <div className="relative group">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-violet-400 transition-colors" size={20} />
                                    <input name="district" value={formData.district} onChange={handleFormChange} required placeholder="District" className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:border-violet-500 focus:bg-white/10 outline-none transition-all placeholder:text-gray-600" />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Selected Pass</label>
                            <div className="relative group">
                                <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-violet-400 transition-colors" size={20} />
                                <select
                                    name="pass"
                                    value={formData.pass}
                                    onChange={handleFormChange}
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:border-violet-500 focus:bg-white/10 outline-none text-gray-300 transition-all [&>option]:bg-[#10101a]"
                                >
                                    <option value="">Select Pass</option>
                                    {passes.map((p) => (
                                        <option key={p._id} value={p._id}>
                                            {p.name} - ₹{p.price}/-
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="pt-10">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full h-16 relative overflow-hidden group rounded-2xl transition-all"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-600 group-hover:scale-105 transition-transform duration-500" />
                                <div className="relative flex items-center justify-center gap-3 text-lg font-black uppercase tracking-widest">
                                    {submitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            <span>Processing...</span>
                                        </>
                                    ) : (
                                        <>
                                            <CreditCard size={22} />
                                            <span>{config.registration_open === 'false' ? 'Register Interest' : `Checkout - ₹${dynamicPrice || currentPass?.price}`}</span>
                                            <ChevronRight size={22} className="group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </div>
                            </button>
                        </div>
                    </form>
                </motion.div>
            </main>

            <ComingSoonModal
                isOpen={showComingSoon}
                onClose={() => setShowComingSoon(false)}
                isPreRegistration={true}
            />
            <SuccessModal
                isOpen={successState.show}
                onClose={() => setSuccessState({ ...successState, show: false })}
                title={successState.title}
                message={successState.message}
                ticketId={successState.ticketId}
            />
            <Footer />
        </div>
    );
};

export default EventSelection;


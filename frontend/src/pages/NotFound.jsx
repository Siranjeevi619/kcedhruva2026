import { useNavigate } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
            <Navbar />
            <main className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
                <div className="relative mb-8">
                    <div className="absolute inset-0 bg-blue-600/20 blur-[100px] rounded-full" />
                    <AlertCircle size={120} className="text-blue-500 relative z-10 animate-pulse" />
                </div>

                <h1 className="text-8xl font-black mb-4 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                    404
                </h1>

                <h2 className="text-3xl font-bold mb-6 text-white/90">
                    Oops! Page Not Found
                </h2>

                <p className="text-gray-400 max-w-md mx-auto mb-10 text-lg leading-relaxed">
                    The page you're looking for doesn't exist or has been moved.
                    Let's get you back on track to the EXTRAORDINARY!
                </p>

                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-lg shadow-blue-500/25 transform hover:-translate-y-1"
                >
                    <Home size={20} />
                    Back to Home
                </button>
            </main>
            <Footer />
        </div>
    );
};

export default NotFound;

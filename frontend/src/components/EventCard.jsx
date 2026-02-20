import { Calendar, MapPin, Clock, Edit, Trash2 } from 'lucide-react';
import { getImageUrl } from '../utils/imageUtils';

const EventCard = ({ event, onEdit, onDelete, onView }) => {
    return (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:transform hover:scale-[1.02] transition-all duration-300 group">
            <div className="aspect-[4/3] w-full overflow-hidden relative">
                <img
                    src={getImageUrl(event.image) || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80'}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-white border border-white/20">
                    {event.category}
                </div>
            </div>

            <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{event.title}</h3>
                <p className="text-white text-sm mb-4 line-clamp-2">{event.description}</p>

                <div className="space-y-3 mb-6">
                    {/* Row 1: Date */}
                    <div className="flex items-center gap-3 text-gray-300">
                        <Calendar size={18} className="text-purple-400 shrink-0" />
                        <span className="text-sm font-medium">{new Date(event.date).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                    </div>

                    {/* Row 2: Time */}
                    {event.fromTime || event.timings ? (
                        <div className="flex items-center gap-3 text-gray-300">
                            <Clock size={18} className="text-purple-400 shrink-0" />
                            <span className="text-sm font-medium">
                                {event.fromTime ? (event.toTime ? `${event.fromTime} - ${event.toTime}` : event.fromTime) : event.timings}
                            </span>
                        </div>
                    ) : null}

                    {/* Row 3: Location */}
                    <div className="flex items-center gap-3 text-gray-300">
                        <MapPin size={18} className="text-purple-400 shrink-0" />
                        <span className="text-sm font-medium line-clamp-1">{event.venue}</span>
                    </div>
                </div>

                {onEdit && onDelete ? (
                    <div className="flex gap-3 mt-auto">
                        <button
                            onClick={() => onEdit(event)}
                            className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white py-2 rounded-lg transition-colors border border-white/10 text-sm font-medium"
                        >
                            <Edit size={16} /> Edit
                        </button>
                        <button
                            onClick={() => onDelete(event._id)}
                            className="flex-1 flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 py-2 rounded-lg transition-colors border border-red-500/20 text-sm font-medium"
                        >
                            <Trash2 size={16} /> Delete
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => onView && onView(event)}
                        className="w-full mt-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white py-2 rounded-lg font-medium transition-all shadow-lg shadow-blue-900/20"
                    >
                        Register Now
                    </button>
                )}
            </div>
        </div>
    );
};

export default EventCard;

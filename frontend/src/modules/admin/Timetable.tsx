import { Plus, MoreVertical, MapPin } from 'lucide-react';

export function TimetableScheduling() {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const times = ['09:00 AM', '10:30 AM', '12:00 PM', '01:30 PM', '03:00 PM'];

  const schedule = [
    { day: 'Monday', time: '09:00 AM', subject: 'Math', tutor: 'Prof. Miller', room: 'Room 302' },
    { day: 'Monday', time: '10:30 AM', subject: 'Physics', tutor: 'Dr. Stark', room: 'Lab 101' },
    { day: 'Tuesday', time: '09:00 AM', subject: 'History', tutor: 'Ms. Croft', room: 'Auditorium' },
    { day: 'Wednesday', time: '12:00 PM', subject: 'Computer Sc', tutor: 'Mr. Wayne', room: 'IT Hub' },
  ];

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black  tracking-tighter uppercase">Academic Timetable</h1>
          <p className="mt-1 text-muted-foreground font-medium  underline decoration-primary-200 underline-offset-4 decoration-2">Optimizing room allocation and tutor schedules for Grade 10-A.</p>
        </div>
        <div className="flex gap-4">
             <button className="flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-2.5 text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-primary-600/20 hover:scale-105 transition-all">
                <Plus size={16} /> Add Slot
             </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-1 space-y-6">
             <div className="rounded-3xl border bg-background p-6 shadow-sm">
                <h2 className="text-lg font-bold mb-6  underline decoration-primary-100 decoration-4 underline-offset-4">Conflict Alerts</h2>
                <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600">
                        <p className="text-[10px] font-black uppercase tracking-widest mb-1">Room Overlap</p>
                        <p className="text-xs font-bold  truncate">Lab 101: Physics vs Chemistry (Wed 10 AM)</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-yellow-50 border border-yellow-100 text-yellow-600">
                        <p className="text-[10px] font-black uppercase tracking-widest mb-1">Double Booking</p>
                        <p className="text-xs font-bold  truncate">Prof. Miller: 10A vs 12C (Mon 9 AM)</p>
                    </div>
                </div>
             </div>
             
             <div className="rounded-3xl border bg-background p-6 shadow-sm">
                <h2 className="text-lg font-bold mb-6  underline decoration-primary-100 decoration-4 underline-offset-4">Resources</h2>
                <div className="space-y-3">
                    {['24 Available Rooms', '12 Active Tutors', '8 Lab Facilities'].map((t, i) => (
                        <div key={i} className="flex items-center justify-between text-xs font-bold text-muted-foreground hover:text-foreground transition-all cursor-pointer">
                            <span>{t}</span>
                            <MoreVertical size={14} />
                        </div>
                    ))}
                </div>
             </div>
        </div>

        <div className="lg:col-span-3">
            <div className="rounded-3xl border bg-background overflow-hidden shadow-xl ring-4 ring-primary-500/5">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-muted/30">
                                <th className="border-b p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground ">Time</th>
                                {days.map(day => (
                                    <th key={day} className="border-b border-l p-4 text-[10px] font-black uppercase tracking-widest text-primary-900 ">{day}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {times.map(time => (
                                <tr key={time}>
                                    <td className="border-b p-4 text-center font-mono text-[10px] font-black text-muted-foreground tracking-tighter whitespace-nowrap">{time}</td>
                                    {days.map(day => {
                                        const entry = schedule.find(s => s.day === day && s.time === time);
                                        return (
                                            <td key={day} className="border-b border-l p-4 min-w-[160px] align-top">
                                                {entry ? (
                                                    <div className="group rounded-2xl bg-primary-600 p-4 text-white shadow-lg shadow-primary-600/20 hover:scale-105 transition-all cursor-pointer relative overflow-hidden">
                                                        <div className="absolute -right-4 -top-4 h-12 w-12 bg-white/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
                                                        <h4 className="font-extrabold tracking-tight  uppercase text-xs">{entry.subject}</h4>
                                                        <p className="mt-1 text-[10px] font-black text-primary-100 uppercase tracking-widest">{entry.tutor}</p>
                                                        <div className="mt-3 flex items-center gap-1.5 text-[9px] font-bold text-primary-200 uppercase">
                                                            <MapPin size={10} /> {entry.room}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex h-20 items-center justify-center rounded-2xl border-2 border-dashed border-muted/50 hover:bg-muted/10 transition-all cursor-pointer group">
                                                        <Plus size={16} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    </div>
                                                )}
                                            </td>
                                        )
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

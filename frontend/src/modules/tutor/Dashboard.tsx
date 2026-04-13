import { BookOpen, UserCheck, ClipboardList, MessageSquare, Video, FileText, Send } from 'lucide-react';
import { StatCard } from '../../components/shared/StatCard';

export function TutorDashboard() {
  return (
    <div className="space-y-8 animate-in slide-in-from-left-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Teacher\'s Portal</h1>
          <p className="mt-1 text-muted-foreground font-medium">Greetings, <span className="text-primary-600">Prof. Miller</span>. 3 classes scheduled for today.</p>
        </div>
        <div className="flex gap-4">
             <button className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary-600/30 hover:scale-105 transition-all">
                <Video size={18} /> Start Virtual Class
             </button>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Students Today" 
          value="118" 
          icon={<UserCheck size={24} />} 
        />
        <StatCard 
          title="Assignments" 
          value="12" 
          icon={<BookOpen size={24} />} 
          className="ring-2 ring-primary-500/5"
        />
        <StatCard 
          title="avg. Performance" 
          value="78%" 
          icon={<ClipboardList size={24} />} 
          trend={{ value: 3.2, isUp: true }}
        />
        <StatCard 
          title="Unread Messages" 
          value="9" 
          icon={<MessageSquare size={24} />} 
          className="bg-primary-600 text-white"
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Today\'s Schedule */}
        <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
                <FileText size={20} className="text-primary-600" /> Academic Delivery
            </h2>
            <div className="grid gap-4">
                {[
                    { class: 'Mathematics - Grade 10A', time: '09:00 AM - 10:30 AM', topic: 'Calculus Introduction', students: 32, status: 'Completed' },
                    { class: 'Physics - Grade 11C', time: '11:00 AM - 12:30 PM', topic: 'Thermodynamics', students: 28, status: 'Ongoing' },
                    { class: 'Mathematics - Grade 9B', time: '02:00 PM - 03:30 PM', topic: 'Geometry Basics', students: 30, status: 'Upcoming' },
                ].map((item, i) => (
                    <div key={i} className="group relative flex items-center justify-between rounded-2xl border bg-background p-5 hover:border-primary-600/50 hover:shadow-lg hover:shadow-primary-600/5 transition-all">
                        <div className="flex gap-5 items-center">
                            <div className={`h-14 w-1 flex rounded-full ${item.status === 'Completed' ? 'bg-emerald-500' : item.status === 'Ongoing' ? 'bg-primary-600 animate-pulse' : 'bg-muted'}`}></div>
                            <div>
                                <h4 className="font-extrabold tracking-tight">{item.class}</h4>
                                <p className="text-xs font-bold text-muted-foreground mt-1 uppercase tracking-widest">{item.time}</p>
                                <p className="mt-2 text-sm font-medium text-foreground ">Topic: {item.topic}</p>
                            </div>
                        </div>
                        <div className="text-right">
                             <div className="flex -space-x-2 justify-end mb-2">
                                {[1, 2, 3].map(j => (
                                    <div key={j} className="h-6 w-6 rounded-full border-2 border-background bg-muted">
                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${j+i*10}`} className="rounded-full" alt=""/>
                                    </div>
                                ))}
                             </div>
                             <span className={`text-[10px] font-black uppercase tracking-tighter px-2 py-1 rounded-md ${
                                item.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 
                                item.status === 'Ongoing' ? 'bg-primary-600 text-white' : 'bg-muted text-muted-foreground'
                             }`}>
                                {item.status}
                             </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Quick Communication */}
        <div className="rounded-3xl border bg-background p-8 flex flex-col shadow-xl shadow-primary-900/5 border-primary-100">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-black  text-primary-900">EduChat</h2>
                <div className="flex gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                    <span className="text-[10px] font-black uppercase text-muted-foreground">Active</span>
                </div>
            </div>
            <div className="flex-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
                <ChatMessage name="John Wick\'s Parent" text="Will there be extra classes for Geometry?" time="10:24 AM" isMe={false} />
                <ChatMessage name="Principal Office" text="Staff meeting moved to Friday 4 PM." time="09:15 AM" isMe={false} />
                <ChatMessage name="Me" text="I have uploaded the new physics notes." time="08:45 AM" isMe={true} />
            </div>
            <div className="mt-8 relative">
                <input 
                    type="text" 
                    placeholder="Type a message..." 
                    className="w-full rounded-2xl bg-muted/50 border-none py-4 pl-5 pr-14 text-sm font-medium focus:ring-2 focus:ring-primary-600/20 transition-all"
                />
                <button className="absolute right-2 top-2 h-10 w-10 flex items-center justify-center rounded-xl bg-primary-600 text-white hover:bg-primary-700 active:scale-95 transition-all">
                    <Send size={18} />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}

function ChatMessage({ name, text, time, isMe }: { name: string, text: string, time: string, isMe: boolean }) {
    return (
        <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
            <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{name}</span>
                <span className="text-[9px] font-bold text-muted-foreground/60">{time}</span>
            </div>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs font-medium shadow-sm leading-relaxed ${
                isMe ? 'bg-primary-600 text-white rounded-tr-none' : 'bg-muted/50 text-foreground rounded-tl-none border'
            }`}>
                {text}
            </div>
        </div>
    )
}

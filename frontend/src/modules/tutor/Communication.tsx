import { Send, Search, MoreVertical, Paperclip, Phone, Video, CheckCircle2 } from 'lucide-react';
import { cn } from '../../hooks/utils';

export function CommunicationHub() {
  const chats = [
    { name: 'John Wick (Parent)', lastMsg: 'Will there be extra classes for Geometry?', time: '10:24 AM', unread: 2, online: true },
    { name: 'Primary Office', lastMsg: 'Staff meeting moved to Friday 4 PM.', time: '09:15 AM', unread: 0, online: false },
    { name: 'Dr. Stark (Principal)', lastMsg: 'Physics lab reports review status?', time: 'Yesterday', unread: 1, online: true },
    { name: 'Student Group 10A', lastMsg: 'Notes uploaded for term exam.', time: 'Mon', unread: 0, online: true },
  ];

  return (
    <div className="h-[calc(100vh-140px)] animate-in slide-in-from-left-4 duration-500 overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black  tracking-tighter uppercase tracking-tighter">Communication Gateway</h1>
          <p className="mt-1 text-muted-foreground font-medium  underline decoration-primary-200 underline-offset-4 decoration-2">Direct messaging stream with parents, students, and administration.</p>
        </div>
      </div>

      <div className="flex h-full rounded-3xl border bg-background shadow-xl overflow-hidden ring-4 ring-primary-500/5">
        {/* Chat List */}
        <div className="w-80 border-r flex flex-col bg-muted/10">
            <div className="p-6 border-b bg-background">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                    <input type="text" placeholder="Filter messages..." className="w-full rounded-xl border bg-muted/20 py-2 pl-9 pr-4 text-xs font-bold outline-none focus:ring-2 focus:ring-primary-500/20" />
                </div>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {chats.map((chat, i) => (
                    <div key={i} className={cn(
                        "p-6 flex items-center justify-between cursor-pointer transition-all border-b border-muted/30 group",
                        i === 0 ? "bg-primary-50/50 border-primary-100" : "hover:bg-muted/30"
                    )}>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="h-10 w-10 overflow-hidden rounded-2xl ring-2 ring-primary-50 group-hover:ring-primary-100 transition-all">
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${chat.name}`} alt=""/>
                                </div>
                                {chat.online && <div className="absolute -right-1 -bottom-1 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></div>}
                            </div>
                            <div className="min-w-0">
                                <h3 className="text-xs font-black  uppercase tracking-tighter truncate text-foreground group-hover:text-primary-600 transition-colors">{chat.name}</h3>
                                <p className="text-[10px] font-bold text-muted-foreground truncate w-32 mt-0.5 ">{chat.lastMsg}</p>
                            </div>
                        </div>
                        <div className="text-right flex flex-col items-end">
                            <span className="text-[9px] font-black uppercase text-muted-foreground/60">{chat.time}</span>
                            {chat.unread > 0 && <span className="mt-1.5 h-4 min-w-[16px] px-1 flex items-center justify-center rounded-full bg-primary-600 text-[8px] font-black  text-white shadow-lg shadow-primary-600/30">{chat.unread}</span>}
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Conversation Area */}
        <div className="flex-1 flex flex-col relative overflow-hidden bg-background">
            <div className="p-6 border-b flex items-center justify-between relative z-10 bg-background/80 backdrop-blur-md">
                <div className="flex items-center gap-4">
                     <div className="h-10 w-10 rounded-2xl ring-2 ring-primary-50 overflow-hidden">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=John Wick (Parent)`} alt=""/>
                     </div>
                     <div>
                        <h2 className="text-sm font-black  uppercase tracking-tighter text-foreground leading-none">John Wick (Parent)</h2>
                        <div className="mt-1.5 flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-green-600">
                             <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div> Online
                        </div>
                     </div>
                </div>
                <div className="flex gap-4">
                    <button className="h-10 w-10 flex items-center justify-center rounded-xl border bg-background text-muted-foreground hover:text-primary-600 hover:border-primary-600/30 transition-all"><Phone size={18}/></button>
                    <button className="h-10 w-10 flex items-center justify-center rounded-xl border bg-background text-muted-foreground hover:text-primary-600 hover:border-primary-600/30 transition-all"><Video size={18}/></button>
                    <button className="h-10 w-10 flex items-center justify-center rounded-xl border bg-background text-muted-foreground hover:text-foreground hover:border-muted transition-all"><MoreVertical size={18}/></button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-10 space-y-8 pr-12 custom-scrollbar">
                <ChatMessage text="Good morning, Prof. Miller." time="10:20 AM" isMe={false} />
                <ChatMessage text="Checking if the extra classes for Geometry are starting from next week as discussed during the parent meeting." time="10:22 AM" isMe={false} />
                <ChatMessage text="Morning, Mr. Wick! Yes, the official schedule will be posted on the portal by tomorrow afternoon. We are finalizing the room allocations." time="10:24 AM" isMe={true} />
                <div className="flex justify-center flex-col items-center gap-2 opacity-30">
                    <div className="h-px w-24 bg-muted"></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground underline underline-offset-4">Today Oct 09</span>
                </div>
                <ChatMessage text="Will there be extra classes for Geometry?" time="10:24 AM" isMe={false} />
            </div>

            <div className="p-8 border-t bg-muted/10">
                <div className="relative group max-w-4xl mx-auto">
                    <input 
                        type="text" 
                        placeholder="Type a professional message..." 
                        className="w-full rounded-2xl border-none bg-background py-5 pl-14 pr-24 text-sm font-bold shadow-xl shadow-primary-950/5 focus:ring-4 focus:ring-primary-600/10 transition-all  leading-relaxed"
                    />
                    <button className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary-600 hover:scale-110 transition-all">
                        <Paperclip size={20} />
                    </button>
                    <button className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3 bg-primary-600 px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest text-white shadow-xl shadow-primary-600/40 hover:bg-primary-500 hover:scale-105 active:scale-95 transition-all">
                        Send <Send size={16} />
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

function ChatMessage({ text, time, isMe }: { text: string, time: string, isMe: boolean }) {
    return (
        <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[80%] ${isMe ? 'ml-auto' : ''} animate-in fade-in slide-in-from-${isMe ? 'right' : 'left'}-4 duration-500`}>
            <div className={`rounded-3xl p-5 shadow-sm leading-relaxed text-sm font-medium ${
                isMe ? 'bg-primary-600 text-white rounded-tr-none' : 'bg-muted/30 text-foreground border border-muted/30 rounded-tl-none'
            }`}>
                {text}
            </div>
            <div className="mt-2 flex items-center gap-2 px-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">{isMe ? 'Sent' : 'Read'}</span>
                <span className="text-[9px] font-bold text-muted-foreground opacity-40 ">{time}</span>
                {isMe && <CheckCircle2 size={10} className="text-primary-600" />}
            </div>
        </div>
    )
}

import React, { useState } from 'react';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import { Search, Star, Send, Paperclip, MoreVertical, MessageSquare, Plus, User } from 'lucide-react';

const Messages: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="h-[calc(100vh-140px)] flex bg-white rounded-[40px] shadow-soft border border-slate-200 overflow-hidden animate-in fade-in duration-500 font-sans">
        {/* Sidebar */}
        <div className="w-80 border-r border-slate-100 flex flex-col">
           <div className="p-6 border-b border-slate-50">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-medium text-gray-900 leading-none">Messages</h1>
                <button onClick={() => setIsModalOpen(true)} className="p-2 bg-brand-50 text-brand-500 rounded-xl hover:bg-brand-500 hover:text-white transition-all shadow-sm">
                   <Plus size={18} />
                </button>
              </div>
              <div className="flex items-center bg-slate-50 rounded-2xl px-4 py-2 border border-slate-100">
                 <Search size={16} className="text-slate-400" />
                 <input type="text" placeholder="Search chats..." className="bg-transparent border-none focus:ring-0 text-sm font-medium ml-2 w-full" />
              </div>
           </div>
           <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {[
                { name: 'Dr. John Doe', last: 'Finalized the lab schedule...', time: '12:45', active: true },
                { name: 'Alice Smith (Parent)', last: 'Regarding the absence of...', time: 'Yesterday', active: false },
                { name: 'Science Dept', last: 'Please review the new syllabus...', time: 'Monday', active: false },
              ].map((chat, idx) => (
                 <div key={idx} className={`p-4 rounded-3xl cursor-pointer transition-all ${chat.active ? 'bg-brand-500 text-white shadow-premium' : 'hover:bg-slate-50'}`}>
                    <div className="flex justify-between items-start mb-1">
                       <h4 className="font-medium text-xs   leading-none">{chat.name}</h4>
                       <span className={`text-[9px] font-medium   ${chat.active ? 'text-brand-300' : 'text-slate-400'}`}>{chat.time}</span>
                    </div>
                    <p className={`text-[10px] font-medium truncate ${chat.active ? 'text-white' : 'text-slate-500'}`}>{chat.last}</p>
                 </div>
              ))}
           </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-slate-50/30">
           <div className="p-6 bg-white border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center text-white shadow-soft">
                    <MessageSquare size={20} />
                 </div>
                 <div>
                    <h3 className="font-medium text-gray-900  ">Johnathan Reeves</h3>
                    <p className="text-[10px] font-medium text-success-dark  ">Active Now</p>
                 </div>
              </div>
              <div className="flex items-center gap-2">
                 <button className="p-2 text-slate-400 hover:text-brand-600 transition-colors"><Star size={20}/></button>
                 <button className="p-2 text-slate-400 hover:text-brand-600 transition-colors"><MoreVertical size={20}/></button>
              </div>
           </div>

           <div className="flex-1 p-4 sm:p-8 space-y-6 overflow-y-auto font-sans">
              <div className="flex justify-start">
                 <div className="max-w-md p-5 bg-white rounded-t-[28px] rounded-br-[28px] shadow-soft border border-slate-100">
                    <p className="text-sm font-medium text-slate-700">Hello team, I've noticed a few discrepancies in the attendance logs for the Grade 10 Physics session. Can we re-verify?</p>
                 </div>
              </div>
              <div className="flex justify-end">
                 <div className="max-w-md p-5 bg-brand-500 text-white rounded-t-[28px] rounded-bl-[28px] shadow-premium">
                    <p className="text-sm font-medium">Looking into it now. We should have the verified results by 3 PM. Thanks for flagging!</p>
                 </div>
              </div>
           </div>

           <div className="p-6 bg-white border-t border-slate-100">
              <div className="flex items-center gap-4 bg-slate-50 rounded-[32px] p-2 border border-slate-100">
                 <button className="p-3 text-slate-400 hover:text-brand-600 transition-colors"><Paperclip size={20}/></button>
                 <input type="text" placeholder="Type your institutional message..." className="bg-transparent border-none focus:ring-0 text-sm font-medium flex-1 px-2" />
                 <Button className="rounded-full w-12 h-12 p-0 shadow-premium group"><Send size={18} className="translate-x-0.5 -translate-y-0.5 group-hover:translate-x-1 transition-transform" /></Button>
              </div>
           </div>
        </div>
      </div>
      
      <Modal
         isOpen={isModalOpen}
         onClose={() => setIsModalOpen(false)}
         title="Direct Tutor-Student Messaging"
         description="Communicate directly with your assigned students or tutors in a secure environment."
         maxWidth="xl"
      >
         <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
            <div className="space-y-6">
               <Input label="Search Student or Tutor" placeholder="Enter name to start chat..." icon={User} required />
               <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Initial Message</label>
                  <textarea className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-2xl font-medium text-sm outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 focus:bg-white transition-all resize-none placeholder:text-slate-400" placeholder="Type your first message..."></textarea>
               </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
               <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl h-12 px-6">Cancel</Button>
               <Button type="submit" className="rounded-xl h-12 px-8 shadow-premium bg-brand-500 text-white hover:bg-brand-600"><Send size={18} className="mr-2" /> Start Conversation</Button>
            </div>
         </form>
      </Modal>
    </>
  );
};

export default Messages;

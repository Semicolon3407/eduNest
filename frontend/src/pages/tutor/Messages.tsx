import React, { useState, useEffect, useRef } from 'react';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { Search, Send, Paperclip, MoreVertical, MessageSquare, Plus, User, Loader2, Info } from 'lucide-react';
import { getContacts, getMessages, sendMessage } from '../../services/chatService';

const Messages: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contacts, setContacts] = useState<any[]>([]);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [msgLoading, setMsgLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    if (selectedContact) {
      fetchMessages(selectedContact.id);
    }
  }, [selectedContact]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const res = await getContacts();
      setContacts(res.data);
      if (res.data.length > 0) {
        setSelectedContact(res.data[0]);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (id: string) => {
    try {
      setMsgLoading(true);
      const res = await getMessages(id);
      setMessages(res.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setMsgLoading(false);
    }
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newMessage.trim() || !selectedContact) return;

    try {
      setIsSending(true);
      const res = await sendMessage({
        recipientId: selectedContact.id,
        content: newMessage
      });
      setMessages([...messages, res.data]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[calc(100vh-140px)] w-full flex flex-col items-center justify-center bg-white rounded-[40px] shadow-soft border border-slate-200">
        <Loader2 className="animate-spin text-brand-500 mb-4" size={40} />
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest italic">Synchronizing Institutional Vault...</p>
      </div>
    );
  }

  return (
    <>
      <div className="h-[calc(100vh-140px)] flex bg-white rounded-[40px] shadow-soft border border-slate-200 overflow-hidden animate-in fade-in duration-500 font-sans">
        {/* Sidebar */}
        <div className="w-80 border-r border-slate-100 flex flex-col">
           <div className="p-6 border-b border-slate-50">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-bold text-gray-900 tracking-tight leading-none">Messages</h1>
                <button onClick={() => setIsModalOpen(true)} className="p-2.5 bg-brand-50 text-brand-500 rounded-xl hover:bg-brand-500 hover:text-white transition-all shadow-sm border border-brand-100 flex items-center justify-center">
                   <Plus size={18} />
                </button>
              </div>
              <div className="flex items-center bg-slate-50 rounded-2xl px-4 py-2.5 border border-slate-100">
                 <Search size={16} className="text-slate-400" />
                 <input type="text" placeholder="Search institutional chats..." className="bg-transparent border-none focus:ring-0 text-xs font-bold ml-2 w-full uppercase tracking-wider placeholder:text-slate-300" />
              </div>
           </div>
           <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {contacts.length > 0 ? contacts.map((contact, idx) => (
                 <div 
                   key={idx} 
                   onClick={() => setSelectedContact(contact)}
                   className={`p-5 rounded-[28px] cursor-pointer transition-all border ${selectedContact?.id === contact.id ? 'bg-brand-500 text-white border-brand-500 shadow-premium' : 'bg-surface border-surface-200 text-gray-600 hover:border-brand-300 hover:bg-slate-50 shadow-soft'}`}
                 >
                    <div className="flex justify-between items-start mb-2">
                       <h4 className="font-bold text-xs tracking-tight leading-none">{contact.name}</h4>
                       <span className={`text-[8px] font-bold uppercase tracking-widest ${selectedContact?.id === contact.id ? 'text-brand-200' : 'text-slate-400'}`}>Now</span>
                    </div>
                    <div className="flex items-center justify-between">
                       <p className={`text-[10px] font-medium truncate ${selectedContact?.id === contact.id ? 'text-brand-50' : 'text-slate-400'}`}>{contact.role}</p>
                       <div className={`w-1.5 h-1.5 rounded-full ${selectedContact?.id === contact.id ? 'bg-white shadow-[0_0_8px_white]' : 'bg-success shadow-soft'}`}></div>
                    </div>
                 </div>
              )) : (
                <div className="p-8 text-center opacity-40">
                   <MessageSquare className="mx-auto mb-4 text-slate-300" size={32} />
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">No active conversations found.</p>
                </div>
              )}
           </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-slate-50/20">
           {selectedContact ? (
             <>
               <div className="p-6 bg-white border-b border-slate-100 flex items-center justify-between shadow-sm relative z-10">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-brand-500 rounded-[20px] flex items-center justify-center text-white shadow-premium border border-brand-400">
                        <User size={24} />
                     </div>
                     <div>
                        <h3 className="font-bold text-gray-900 tracking-tight text-lg leading-tight">{selectedContact.name}</h3>
                        <p className="text-[10px] font-bold text-success uppercase tracking-widest flex items-center gap-1.5 mt-0.5">
                           <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></span>
                           Active Profile
                        </p>
                     </div>
                  </div>
                  <div className="flex items-center gap-2">
                     <button className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-brand-600 hover:bg-slate-50 rounded-xl transition-all"><Paperclip size={20}/></button>
                     <button className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-brand-600 hover:bg-slate-50 rounded-xl transition-all"><MoreVertical size={20}/></button>
                  </div>
               </div>

               <div ref={scrollRef} className="flex-1 p-6 sm:p-10 space-y-8 overflow-y-auto font-sans bg-slate-50/30">
                  {msgLoading && messages.length === 0 ? (
                    <div className="h-full flex items-center justify-center">
                       <Loader2 className="animate-spin text-brand-500" size={32} />
                    </div>
                  ) : messages.length > 0 ? messages.map((msg, idx) => {
                     const isOwn = msg.sender.toString() !== selectedContact.id.toString();
                     return (
                      <div key={idx} className={`flex ${isOwn ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                        <div className={`max-w-md p-6 shadow-soft border ${isOwn ? 'bg-brand-500 text-white rounded-t-[32px] rounded-bl-[32px] border-brand-400 shadow-premium' : 'bg-white text-slate-700 rounded-t-[32px] rounded-br-[32px] border-slate-100'}`}>
                           <p className="text-sm font-medium leading-relaxed">{msg.content}</p>
                           <p className={`text-[8px] mt-3 font-bold uppercase tracking-widest ${isOwn ? 'text-brand-200' : 'text-slate-400'}`}>
                              {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                           </p>
                        </div>
                      </div>
                     );
                  }) : (
                    <div className="h-full flex flex-col items-center justify-center opacity-40">
                       <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center border border-dashed border-slate-200 mb-6 font-bold shadow-soft">
                          <MessageSquare size={32} className="text-slate-200" />
                       </div>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Beginning of institutional record.</p>
                    </div>
                  )}
               </div>

               <div className="p-8 bg-white border-t border-slate-100">
                  <form onSubmit={handleSend} className="flex items-center gap-4 bg-slate-50 rounded-[32px] p-2.5 border border-slate-100 focus-within:shadow-lg focus-within:border-brand-200 transition-all">
                     <input 
                       type="text" 
                       value={newMessage}
                       onChange={(e) => setNewMessage(e.target.value)}
                       placeholder="Type your secure institutional message..." 
                       className="bg-transparent border-none focus:ring-0 text-sm font-medium flex-1 px-6 placeholder:text-slate-300" 
                     />
                     <Button 
                       type="submit" 
                       disabled={isSending || !newMessage.trim()} 
                       className="rounded-full w-14 h-14 p-0 shadow-premium group bg-brand-500 hover:bg-brand-600 disabled:opacity-50"
                     >
                        {isSending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} className="translate-x-0.5 -translate-y-0.5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />}
                     </Button>
                  </form>
               </div>
             </>
           ) : (
             <div className="flex-1 flex flex-col items-center justify-center p-20 text-center">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-8 border border-dashed border-slate-200 shadow-soft">
                   <Info size={40} className="text-slate-200" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Select an Institutional Contact</h3>
                <p className="text-slate-500 mt-2 max-w-sm font-medium">Choose a verified student or tutor from the sidebar to begin secure communication.</p>
             </div>
           )}
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
               <div className="p-6 bg-brand-50 border border-brand-100 rounded-[32px] flex items-center gap-4">
                  <Info size={24} className="text-brand-500" />
                  <p className="text-xs font-bold text-brand-600 uppercase tracking-widest leading-relaxed">Please select an existing contact from your authorized directory to begin.</p>
               </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
               <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl h-12 px-6">Close</Button>
               <Button type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl h-12 px-8 shadow-premium bg-brand-500 text-white hover:bg-brand-600">Understood</Button>
            </div>
         </form>
      </Modal>
    </>
  );
};

export default Messages;

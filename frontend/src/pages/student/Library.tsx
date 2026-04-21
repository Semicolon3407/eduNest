import React from 'react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { Library, Search, Book, Clock, MapPin, Bookmark, CheckCircle2 } from 'lucide-react';

const borrowedBooks = [
  { id: 1, title: 'Calculus: Early Transcendentals', author: 'James Stewart', due: 'Oct 22, 2023', status: 'Active' },
  { id: 2, title: 'Clean Code: A Handbook', author: 'Robert C. Martin', due: 'Oct 15, 2023', status: 'Overdue' },
];

const availableBooks = [
  { id: 3, title: 'The Art of Computer Programming', author: 'Donald Knuth', shelf: 'D-12', available: 2 },
  { id: 4, title: 'Quantum Mechanics & Experience', author: 'David Z. Albert', shelf: 'P-04', available: 0 },
  { id: 5, title: 'Design Patterns', author: 'Gang of Four', shelf: 'CS-08', available: 5 },
];

const LibraryPortal: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-medium text-gray-900 ">Institutional Library</h1>
          <p className="text-gray-500 mt-1">Search the digital catalog and manage your borrowed resources</p>
        </div>
        <Button><Bookmark size={18} /> My Wishlist</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:p-8">
         {/* Borrowed Status */}
         <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-medium text-gray-900 px-1  ">Currently Borrowed</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {borrowedBooks.map(book => (
                  <div key={book.id} className={`p-6 rounded-3xl border ${book.status === 'Overdue' ? 'bg-danger/5 border-danger/20' : 'bg-surface border-surface-200 shadow-soft'} group`}>
                     <div className="flex justify-between items-start">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${book.status === 'Overdue' ? 'bg-danger text-white' : 'bg-brand-50 text-brand-600'}`}>
                           <Book size={24} />
                        </div>
                        <Badge variant={book.status === 'Overdue' ? 'danger' : 'brand'}>{book.status}</Badge>
                     </div>
                     <div className="mt-4">
                        <h4 className="font-medium text-gray-900 group-hover:text-brand-600 transition-colors   leading-snug">{book.title}</h4>
                        <p className="text-[10px] text-gray-400 font-medium  mt-1 ">{book.author}</p>
                     </div>
                     <div className="mt-6 flex items-center justify-between border-t border-surface-50 pt-4">
                        <p className="text-xs font-medium text-gray-500 flex items-center gap-1.5 leading-none">
                           <Clock size={12}/> Due {book.due}
                        </p>
                        <button className="text-[10px] font-medium text-brand-600   underline">Renew</button>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         {/* Digital Access Quick Info */}
         <div className="bg-brand-50 rounded-[40px] p-4 sm:p-8 border border-brand-100 shadow-soft">
            <div className="w-16 h-16 bg-brand-500 text-white rounded-[24px] flex items-center justify-center shadow-premium mb-6">
               <Library size={32} />
            </div>
            <h3 className="text-2xl font-medium text-brand-500  leading-none">Digital Archive</h3>
            <p className="mt-4 text-brand-700 text-sm font-medium leading-relaxed">You have unlimited access to over 12,000+ peer-reviewed journals and academic publications through our VPN.</p>
            <div className="mt-8 space-y-3">
               <div className="flex items-center gap-2 text-xs font-medium text-brand-700  ">
                  <CheckCircle2 size={16} className="text-success" /> JSTOR Access: Active
               </div>
               <div className="flex items-center gap-2 text-xs font-medium text-brand-700  ">
                  <CheckCircle2 size={16} className="text-success" /> IEEE Xplore: Active
               </div>
            </div>
            <Button className="w-full mt-8 bg-brand-500 text-white hover:bg-brand-600 h-12 shadow-premium">Launch Digital Portal</Button>
         </div>
      </div>

      {/* Search Catalog */}
      <div className="bg-surface p-6 sm:p-10 rounded-[40px] shadow-soft border border-surface-200">
         <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
            <h2 className="text-2xl font-medium text-gray-900   shrink-0">Catalog Search</h2>
            <div className="flex-1 max-w-2xl px-4">
               <Input placeholder="Search by title, ISBN, author, or keyword..." icon={Search} className="h-14 shadow-sm" />
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:p-8">
            {availableBooks.map(book => (
               <div key={book.id} className="group cursor-pointer">
                  <div className="aspect-[3/4] bg-surface-100 rounded-[32px] mb-4 flex items-center justify-center border border-surface-200 group-hover:bg-brand-50 group-hover:border-brand-200 transition-all shadow-sm overflow-hidden relative">
                     <div className="w-20 h-28 bg-white rounded-lg shadow-premium flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                        <Book size={40} className="text-brand-200 group-hover:text-brand-500" />
                     </div>
                     <div className="absolute top-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                        <Badge variant={book.available > 0 ? 'success' : 'danger'}>{book.available} Available</Badge>
                     </div>
                  </div>
                  <h4 className="font-medium text-gray-900   group-hover:text-brand-600 transition-colors text-sm px-2 text-center">{book.title}</h4>
                  <p className="text-[10px] text-gray-400 font-medium  text-center mt-1 tracking-[0.2em]">{book.author}</p>
                  <div className="mt-4 flex items-center justify-center gap-2 text-xs font-medium text-gray-400">
                     <MapPin size={12}/> Shelf {book.shelf}
                  </div>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default LibraryPortal;

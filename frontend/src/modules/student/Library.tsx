import { Book, Search, Filter, Bookmark, History, Clock, ArrowRight } from 'lucide-react';
import { cn } from '../../hooks/utils';

export function LibraryPortal() {
  const books = [
    { title: 'Advanced Calculus', author: 'Michael Spivak', category: 'Mathematics', status: 'Available', copies: 4, cover: 'bg-blue-600' },
    { title: 'The Art of Electronics', author: 'Paul Horowitz', category: 'Physics', status: 'Borrowed', returnDate: 'Oct 12', cover: 'bg-emerald-600' },
    { title: 'Clean Architecture', author: 'Robert C. Martin', category: 'IT', status: 'Available', copies: 2, cover: 'bg-orange-600' },
    { title: 'Sapiens: A Brief History', author: 'Yuval Noah Harari', category: 'History', status: 'Reserved', cover: 'bg-red-600' },
  ];

  return (
    <div className="space-y-8 animate-in zoom-in-95 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black  tracking-tighter uppercase tracking-tighter text-foreground">Digital Library Hub</h1>
          <p className="mt-1 text-muted-foreground font-medium  underline decoration-primary-200 underline-offset-4 decoration-2">Discover verified academic resources, journals, and physical inventory.</p>
        </div>
        <div className="flex gap-4">
             <button className="flex items-center gap-2 rounded-xl bg-primary-50 px-4 py-2 text-xs font-black uppercase tracking-widest text-primary-900 border border-primary-100  transition-all hover:bg-primary-100">
                <Bookmark size={14} className="fill-primary-600 text-primary-600" /> My Borrowed Books
             </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input type="text" placeholder="Search by book title, author, or ISBN..." className="w-full rounded-2xl border-2 border-primary-50 bg-background py-3.5 pl-12 pr-4 text-sm font-bold outline-none focus:border-primary-600/50 transition-all" />
        </div>
        <button className="flex h-12 items-center gap-2 rounded-2xl border bg-background px-6 text-sm font-black uppercase tracking-widest hover:bg-muted transition-all">
          <Filter size={18} /> Library Filters
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Book Catalog */}
        <div className="lg:col-span-2 grid gap-6 sm:grid-cols-2">
            {books.map((book, i) => (
                <div key={i} className="group flex items-start gap-4 rounded-3xl border bg-background p-5 hover:border-primary-600/30 hover:shadow-xl hover:shadow-primary-900/5 transition-all cursor-pointer">
                    <div className={cn("h-32 w-24 shrink-0 rounded-xl shadow-lg transition-transform group-hover:scale-105 group-hover:-rotate-2 duration-500 flex items-center justify-center text-white", book.cover)}>
                        <Book size={32} strokeWidth={1} />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary-600">{book.category}</span>
                            <h3 className="font-extrabold tracking-tight text-foreground uppercase  leading-tight mt-1 line-clamp-2">{book.title}</h3>
                            <p className="text-[10px] font-bold text-muted-foreground  mt-0.5">By {book.author}</p>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                            <span className={cn(
                                "rounded-lg px-2 py-0.5 text-[9px] font-black uppercase tracking-widest",
                                book.status === 'Available' ? "bg-green-50 text-green-600" : 
                                book.status === 'Borrowed' ? "bg-red-50 text-red-600" : "bg-yellow-50 text-yellow-600"
                            )}>
                                {book.status}
                            </span>
                            {book.status === 'Available' && <p className="text-[9px] font-black text-muted-foreground">{book.copies} Copies</p>}
                        </div>
                    </div>
                </div>
            ))}
        </div>

        {/* Library Info */}
        <div className="space-y-6">
            <div className="rounded-3xl border bg-background p-8 shadow-sm">
                 <h2 className="text-xl font-bold mb-6  underline decoration-primary-200 decoration-4 underline-offset-8">Activity Feed</h2>
                 <div className="space-y-6">
                    <LibraryEvent icon={<History size={16}/>} label="Returned Book" info="Calculus Part 1" date="2h ago" />
                    <LibraryEvent icon={<Clock size={16}/>} label="Due Tomorrow" info="Clean Architecture" date="Active" color="text-red-600" />
                    <LibraryEvent icon={<Bookmark size={16}/>} label="Reservation Confirmed" info="Spivak Analysis" date="1d ago" />
                 </div>
            </div>

            <div className="rounded-3xl bg-foreground p-8 text-background shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-all duration-1000">
                    <Book size={64} />
                </div>
                <h4 className="text-lg font-black  mb-4 tracking-tighter uppercase">Librarian Note</h4>
                <p className="text-xs font-bold text-muted-foreground  leading-loose">Late returns will attract a penalty of <span className="text-primary-400">$1/day</span>. Digital journals are available free of cost for all enrolled students.</p>
                <button className="mt-8 flex w-full items-center justify-between rounded-2xl bg-primary-600 px-6 py-4 text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary-600/30">
                    Explore Journals <ArrowRight size={16}/>
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}

function LibraryEvent({ icon, label, info, date, color = "text-muted-foreground" }: { icon: React.ReactNode, label: string, info: string, date: string, color?: string }) {
    return (
        <div className="flex items-start gap-4">
            <div className="h-8 w-8 shrink-0 flex items-center justify-center rounded-lg bg-muted text-muted-foreground shadow-sm">
                {icon}
            </div>
            <div className="flex-1">
                <div className="flex justify-between items-center mb-0.5">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{label}</span>
                    <span className={cn("text-[10px] font-black uppercase tracking-widest", color)}>{date}</span>
                </div>
                <p className="text-xs font-bold  text-foreground leading-none">{info}</p>
            </div>
        </div>
    )
}

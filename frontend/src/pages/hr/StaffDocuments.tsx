import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FileText, ArrowLeft, Download, Eye, Calendar, Shield, 
  ExternalLink, Loader2, Trash2 
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { hrService } from '../../services/hrService';
import toast from 'react-hot-toast';

const StaffDocuments: React.FC = () => {
  const { staffId } = useParams<{ staffId: string }>();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<any[]>([]);
  const [staff, setStaff] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const fetchStaffDocuments = async () => {
    if (!staffId) return;
    try {
      setIsLoading(true);
      const response = await hrService.getDocuments(staffId);
      if (response.success) {
        setDocuments(response.data);
        if (response.data.length > 0) {
          setStaff(response.data[0].staff);
        }
      }
    } catch (error) {
      toast.error('Failed to load documents');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffDocuments();
  }, [staffId]);

  const handlePreview = (doc: any) => {
    setSelectedDoc(doc);
    setIsPreviewOpen(true);
  };

  const handleDelete = async (docId: string) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    try {
      const response = await hrService.deleteDocument(docId);
      if (response.success) {
        toast.success('Document removed');
        fetchStaffDocuments();
      }
    } catch (error) {
      toast.error('Failed to delete document');
    }
  };

  const handleDownload = (doc: any) => {
    if (!doc.url || doc.url === '#') {
      toast.error('Legacy record: No file was attached during upload.');
      return;
    }

    let content = doc.url;
    if (doc.url.startsWith('eduNest_doc_')) {
      content = localStorage.getItem(doc.url) || '#';
      if (content === '#') {
        toast.error('File not found in this browser\'s local storage.');
        return;
      }
    }

    // Convert to Blob for more reliable downloading
    try {
      const parts = content.split(';base64,');
      const contentType = parts[0].split(':')[1];
      const raw = window.atob(parts[1]);
      const rawLength = raw.length;
      const uInt8Array = new Uint8Array(rawLength);

      for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
      }

      const blob = new Blob([uInt8Array], { type: contentType });
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = doc.title || 'document';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
      toast.success('Download initiated');
    } catch (e) {
      // Fallback to direct href if blob conversion fails
      const link = document.createElement('a');
      link.href = content;
      link.download = doc.title || 'document';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleOpenExternal = (doc: any) => {
    if (!doc.url || doc.url === '#') {
      toast.error('Legacy record: No file was attached during upload.');
      return;
    }

    let content = doc.url;
    if (doc.url.startsWith('eduNest_doc_')) {
      content = localStorage.getItem(doc.url) || '#';
      if (content === '#') {
        toast.error('File not found in this browser\'s local storage.');
        return;
      }
    }

    try {
      // Convert Data URL to Blob URL for maximum browser compatibility
      const parts = content.split(';base64,');
      const contentType = parts[0].split(':')[1];
      const raw = window.atob(parts[1]);
      const rawLength = raw.length;
      const uInt8Array = new Uint8Array(rawLength);

      for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
      }

      const blob = new Blob([uInt8Array], { type: contentType });
      const blobUrl = URL.createObjectURL(blob);
      
      const newTab = window.open();
      if (newTab) {
        newTab.location.href = blobUrl;
      } else {
        toast.error('Pop-up blocked. Please enable pop-ups.');
      }
    } catch (e) {
      console.error('Blob conversion failed:', e);
      // Fallback
      const newTab = window.open();
      if (newTab) {
        newTab.location.href = content;
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 size={40} className="animate-spin text-brand-500" />
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Retrieving Staff Vault...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/hr/documents')}
          className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-brand-600 hover:border-brand-200 transition-all shadow-sm"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-display font-medium text-gray-900">
            {staff ? `${staff.firstName} ${staff.lastName}'s Documents` : 'Staff Documents'}
          </h1>
          <p className="text-gray-500 font-medium text-sm">
            {staff ? `Employee ID: ${staff.employeeId}` : 'Browse archived credentials'}
          </p>
        </div>
      </div>

      {!documents || documents.length === 0 ? (
        <div className="bg-white rounded-[40px] p-12 border border-slate-200 shadow-soft text-center space-y-4">
          <div className="w-20 h-20 bg-slate-50 rounded-[32px] flex items-center justify-center mx-auto text-slate-300">
            <FileText size={40} />
          </div>
          <div className="max-w-xs mx-auto">
            <h3 className="text-lg font-medium text-slate-900">No Documents Found</h3>
            <p className="text-sm text-slate-500 mt-2">No institutional documents have been archived for this staff member yet.</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate('/hr/documents')}
            className="rounded-xl px-6"
          >
            Back to Document Center
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <div 
              key={doc._id} 
              className="bg-white rounded-[32px] border border-slate-200 shadow-soft hover:shadow-premium transition-all overflow-hidden group"
            >
              <div className="p-6 space-y-6">
                <div className="flex items-start justify-between">
                  <div className="p-3 bg-brand-50 text-brand-600 rounded-2xl group-hover:scale-110 transition-transform">
                    <FileText size={24} />
                  </div>
                  <Badge 
                    variant={doc.status === 'Verified & Active' ? 'success' : 'brand'}
                    className="font-black text-[10px] tracking-widest uppercase"
                  >
                    {doc.status}
                  </Badge>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 group-hover:text-brand-600 transition-colors line-clamp-1">
                    {doc.title}
                  </h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                    {doc.category}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    <div className="flex items-center gap-2">
                      <Calendar size={12} />
                      {new Date(doc.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                    </div>
                    <div className="flex items-center gap-2">
                       <Shield size={12} />
                       {doc.size || '1.2 MB'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button 
                    onClick={() => handlePreview(doc)}
                    className="flex-1 rounded-xl h-11 bg-slate-900 text-white hover:bg-slate-800 text-[10px] font-bold uppercase tracking-widest gap-2"
                  >
                    <Eye size={16} /> Preview
                  </Button>
                  <button 
                    onClick={() => handleDelete(doc._id)}
                    className="w-11 h-11 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center border border-red-100"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Action Modal */}
      <Modal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title={selectedDoc?.title || "Document Actions"}
        description={`${selectedDoc?.category} • Verification Status: ${selectedDoc?.status}`}
        maxWidth="2xl"
      >
        <div className="space-y-8 p-4">
          <div className="flex flex-col items-center justify-center py-10 bg-slate-50 rounded-[32px] border border-dashed border-slate-200 gap-4">
             <div className="w-20 h-20 bg-white rounded-[24px] shadow-sm flex items-center justify-center text-brand-500 animate-bounce">
                <FileText size={40} />
             </div>
             <div className="text-center">
                <p className="text-lg font-medium text-gray-900">{selectedDoc?.title}</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{selectedDoc?.size || '1.2 MB'}</p>
             </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <Button 
                onClick={() => handleDownload(selectedDoc)}
                className="rounded-2xl h-16 bg-white border border-slate-200 text-gray-900 hover:bg-slate-50 transition-all flex flex-col items-center justify-center gap-1 shadow-sm"
              >
                <Download size={20} className="text-brand-500" />
                <span className="text-[10px] font-black uppercase tracking-widest">Download File</span>
             </Button>
             <Button 
                onClick={() => handleOpenExternal(selectedDoc)}
                className="rounded-2xl h-16 bg-brand-500 text-white hover:bg-brand-600 transition-all flex flex-col items-center justify-center gap-1 shadow-premium"
              >
                <ExternalLink size={20} />
                <span className="text-[10px] font-black uppercase tracking-widest">Open in New Tab</span>
             </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default StaffDocuments;

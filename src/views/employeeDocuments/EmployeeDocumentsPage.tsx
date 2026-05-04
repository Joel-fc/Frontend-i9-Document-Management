import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getEmployeeDocumentsService, addEmployeeDocumentService } from '../../services/employeeServices';
import type { EmployeeDocumentsResponse } from '../../services/employeeServices';
import { FileText, FileDown, ArrowLeft, File, Image as ImageIcon, SearchX, Plus, X, Upload } from 'lucide-react';
import { supabase } from '../../library/supabase';

export default function EmployeeDocumentsPage() {
  const { id } = useParams<{ id: string }>();
  const [employeeData, setEmployeeData] = useState<EmployeeDocumentsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [docName, setDocName] = useState('');
  const [selectedFile, setSelectedFile] = useState<globalThis.File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      if (id) {
        const data = await getEmployeeDocumentsService(id);
        setEmployeeData(data);
      }
    } catch (err) {
      setError('Falha ao carregar documentos do funcionário.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [id]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        showToast('Formato inválido. Apenas PDF, PNG, JPG e JPEG são aceitos.', 'error');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim()) {
      showToast('O nome do documento é obrigatório.', 'error');
      return;
    }
    if (!selectedFile || !id) {
      showToast('Selecione um arquivo.', 'error');
      return;
    }

    try {
      setIsUploading(true);
      
      const uniqueFileName = `${Date.now()}-${selectedFile.name.replace(/\s+/g, '-')}`;
      
      const { error: uploadError } = await supabase.storage
        .from('user-documents')
        .upload(uniqueFileName, selectedFile);

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      const { data: publicUrlData } = supabase.storage
        .from('user-documents')
        .getPublicUrl(uniqueFileName);

      const fileUrl = publicUrlData.publicUrl;

      await addEmployeeDocumentService(id, { name: docName, fileUrl });

      showToast('Documento adicionado com sucesso!', 'success');
      
      setDocName('');
      setSelectedFile(null);
      setIsModalOpen(false);
      
      const updatedData = await getEmployeeDocumentsService(id);
      setEmployeeData(updatedData);

    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Erro ao enviar documento.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const renderIcon = (fileUrl: string) => {
    const extension = fileUrl.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf': return <FileText className="w-10 h-10 text-rose-400" />;
      case 'doc': 
      case 'docx': return <FileText className="w-10 h-10 text-blue-400" />;
      case 'png':
      case 'jpg':
      case 'jpeg': return <ImageIcon className="w-10 h-10 text-emerald-400" />;
      default: return <File className="w-10 h-10 text-slate-400" />;
    }
  };

  const getExtension = (fileUrl: string) => {
      const ext = fileUrl.split('.').pop()?.toUpperCase() || 'ARQUIVO';
      return ext.length > 4 ? 'DOC' : ext;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-5xl mx-auto">
          <div className="h-8 w-48 bg-gray-200 rounded-md animate-pulse mb-8"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-5 border border-gray-200 flex items-center gap-4 animate-pulse h-24">
                <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-5 w-1/3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 w-1/4 bg-gray-200 rounded"></div>
                </div>
                <div className="h-10 w-24 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
        <div className="text-center text-brand-blue">
          <h2 className="text-2xl font-bold uppercase tracking-wide mb-2">Erro</h2>
          <p className="text-gray-600">{error}</p>
          <button onClick={() => window.history.back()} className="text-brand-orange hover:text-orange-600 mt-4 inline-block font-semibold uppercase tracking-wider underline">
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-16 pb-12 px-4 sm:px-6 lg:px-8 font-sans relative">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded shadow-lg text-white font-bold text-sm uppercase tracking-wider transition-all duration-300 ${toast.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}>
          {toast.message}
        </div>
      )}
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-6 border-b-2 border-brand-orange mb-8 gap-4 relative">
          <div className="absolute top-0 left-0 w-12 h-1 bg-brand-orange rounded-full"></div>
          <div className="mt-4">
            <div className="flex items-center gap-2 text-brand-orange hover:text-orange-600 transition-colors cursor-pointer mb-2 w-fit font-bold uppercase tracking-wider" onClick={() => window.history.back()}>
              <ArrowLeft className="w-4 h-4" />
              <span className="text-xs">Voltar</span>
            </div>
            <h1 className="text-3xl font-bold text-brand-blue uppercase tracking-widest">Documentação</h1>
            <p className="text-gray-600 mt-1 flex items-center gap-2 text-sm">
              Gerencie e visualize documentos de {employeeData?.user?.name || 'este colaborador'}.
            </p>
          </div>
          <div className="flex items-center mt-4 sm:mt-0 gap-3">
            <div className="flex items-center gap-3 bg-gray-50 py-2 px-4 rounded-lg border border-gray-200 text-brand-blue shadow-sm">
              <span className="font-bold">{employeeData?.documents?.length || 0}</span> <span className="uppercase text-xs font-semibold tracking-wider">documentos</span>
            </div>
            
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-brand-orange hover:bg-orange-600 text-white text-xs font-bold uppercase tracking-wider rounded-md transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar Documento</span>
            </button>
          </div>
        </div>

        {/* Empty State / List */}
        {!employeeData?.documents || employeeData.documents.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 shadow-sm rounded-xl p-16 flex flex-col items-center justify-center text-center relative pt-1">
            <div className="absolute top-0 left-0 w-full h-1 bg-brand-orange"></div>
            <div className="bg-gray-100 p-4 rounded-full mb-4 border border-gray-200">
              <SearchX className="w-12 h-12 text-brand-orange" />
            </div>
            <h3 className="text-xl font-bold text-brand-blue uppercase tracking-wide mb-2 mt-4">Nenhum documento encontrado</h3>
            <p className="text-gray-600 max-w-md text-sm">
              Não existem documentos cadastrados ou disponíveis para este funcionário no momento.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {(employeeData?.documents || []).map((doc) => (
              <div 
                key={doc.id}
                className="bg-gray-50 border text-brand-blue border-gray-200 rounded-xl p-5 hover:shadow-md transition-all shadow-sm flex items-center justify-between gap-4 group relative overflow-hidden"
              >
                <div className="absolute left-0 top-0 h-full w-1 bg-brand-orange"></div>
                <div className="flex flex-1 items-center gap-5 min-w-0 pl-2">
                  <div className="p-3 bg-white rounded-lg border border-gray-200 shrink-0 group-hover:scale-105 transition-transform duration-300">
                    {renderIcon(doc.fileUrl || 'unknown')}
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-bold text-brand-blue uppercase tracking-wide truncate mb-1" title={doc.name}>
                      {doc.name}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                      <span className="uppercase tracking-widest bg-gray-200 px-2 py-0.5 rounded text-brand-blue border border-gray-300">
                        {getExtension(doc.fileUrl)}
                      </span>
                      <span>•</span>
                      <span className="uppercase tracking-wider">Adicionado em {new Date(doc.createdAt).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 bg-brand-orange hover:bg-orange-600 text-white text-xs font-bold uppercase tracking-wider rounded-md transition-colors shadow-sm focus:ring-2 focus:ring-brand-orange focus:ring-offset-2"
                  >
                    <FileDown className="w-4 h-4" />
                    <span>Abrir</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 bg-brand-blue">
              <h2 className="text-white font-bold uppercase tracking-wider">Novo Documento</h2>
              <button 
                onClick={() => {
                  setIsModalOpen(false);
                  setDocName('');
                  setSelectedFile(null);
                }} 
                className="text-gray-300 hover:text-white transition-colors focus:outline-none"
                disabled={isUploading}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleUpload} className="p-6">
              <div className="space-y-5">
                <div>
                  <label htmlFor="docName" className="block text-sm font-bold text-brand-blue mb-1 uppercase tracking-wide">
                    Nome do Documento
                  </label>
                  <input
                    type="text"
                    id="docName"
                    value={docName}
                    onChange={(e) => setDocName(e.target.value)}
                    placeholder="Ex: Certificado NR-35"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-brand-orange text-gray-700 bg-gray-50 transition-all"
                    disabled={isUploading}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-brand-blue mb-1 uppercase tracking-wide">
                    Arquivo
                  </label>
                  <div 
                    className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg transition-colors cursor-pointer ${selectedFile ? 'border-brand-orange bg-orange-50' : 'border-gray-300 hover:border-brand-orange hover:bg-gray-50'}`}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="space-y-1 text-center w-full">
                      <Upload className={`mx-auto h-12 w-12 ${selectedFile ? 'text-brand-orange' : 'text-gray-400'}`} />
                      <div className="flex text-sm text-gray-600 justify-center w-full mt-2">
                        <span className="relative font-bold text-brand-orange hover:text-orange-600 truncate max-w-[200px] block">
                          {selectedFile ? selectedFile.name : 'Selecionar arquivo'}
                        </span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          accept=".pdf,.png,.jpg,.jpeg"
                          className="sr-only"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          disabled={isUploading}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {selectedFile ? 'Clique para trocar de arquivo' : 'Apenas .pdf, .png, .jpg ou .jpeg'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setDocName('');
                    setSelectedFile(null);
                  }}
                  className="px-5 py-2 text-brand-blue font-bold text-xs uppercase tracking-wider hover:bg-gray-100 rounded-md transition-colors focus:outline-none"
                  disabled={isUploading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-6 py-2 bg-brand-orange hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider rounded-md transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2"
                >
                  {isUploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Enviando...</span>
                    </>
                  ) : (
                    'Salvar'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
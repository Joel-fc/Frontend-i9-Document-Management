import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getEmployeeDocumentsService } from '../../services/employeeServices';
import type { Document } from '../../services/employeeServices';
import { FileText, FileDown, ArrowLeft, File, Image as ImageIcon, SearchX } from 'lucide-react';

export default function EmployeeDocumentsPage() {
  const { id } = useParams<{ id: string }>();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        if (id) {
          const data = await getEmployeeDocumentsService(id);
          setDocuments(data);
        }
      } catch (err) {
        setError('Falha ao carregar documentos do funcionário.');
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [id]);

  const renderIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf': return <FileText className="w-10 h-10 text-rose-400" />;
      case 'doc': 
      case 'docx': return <FileText className="w-10 h-10 text-blue-400" />;
      case 'png':
      case 'jpg':
      case 'jpeg': return <ImageIcon className="w-10 h-10 text-emerald-400" />;
      default: return <File className="w-10 h-10 text-slate-400" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="h-8 w-48 bg-slate-800 rounded-md animate-pulse mb-8"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-slate-800 rounded-lg p-5 border border-slate-700 flex items-center gap-4 animate-pulse h-24">
                <div className="w-10 h-10 bg-slate-700 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-5 w-1/3 bg-slate-700 rounded mb-2"></div>
                  <div className="h-4 w-1/4 bg-slate-700 rounded"></div>
                </div>
                <div className="h-10 w-24 bg-slate-700 rounded-lg"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="text-center text-slate-300">
          <h2 className="text-2xl font-semibold mb-2">Erro</h2>
          <p>{error}</p>
          <button onClick={() => window.history.back()} className="text-blue-400 hover:text-blue-300 mt-4 inline-block underline">
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 pt-16 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-6 border-b border-slate-700 mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors cursor-pointer mb-2 w-fit" onClick={() => window.history.back()}>
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Voltar</span>
            </div>
            <h1 className="text-3xl font-bold text-white">Documentação</h1>
            <p className="text-slate-400 mt-1 flex items-center gap-2">
              Gerencie e visualize documentos deste colaborador.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-slate-800/50 py-2 px-4 rounded-lg border border-slate-700/50 text-slate-300 text-sm">
            <span className="font-semibold text-white">{documents.length}</span> documentos
          </div>
        </div>

        {/* Empty State / List */}
        {documents.length === 0 ? (
          <div className="bg-slate-800 border-2 border-dashed border-slate-700 rounded-xl p-16 flex flex-col items-center justify-center text-center">
            <div className="bg-slate-700/50 p-4 rounded-full mb-4">
              <SearchX className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Nenhum documento encontrado</h3>
            <p className="text-slate-400 max-w-md">
              Não existem documentos cadastrados ou disponíveis para este funcionário no momento.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {documents.map((doc) => (
              <div 
                key={doc.id}
                className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-slate-500 transition-all shadow-sm flex items-center justify-between gap-4 group"
              >
                <div className="flex flex-1 items-center gap-5 min-w-0">
                  <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-700/50 shadow-inner shrink-0 group-hover:scale-105 transition-transform duration-300">
                    {renderIcon(doc.type || 'unknown')}
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-semibold text-white truncate mb-1" title={doc.title}>
                      {doc.title}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-slate-400">
                      <span className="uppercase font-medium tracking-wider text-xs bg-slate-700/50 px-2 py-0.5 rounded text-slate-300 border border-slate-600/50">
                        {doc.type}
                      </span>
                      <span>•</span>
                      <span>Adicionado em {new Date(doc.createdAt).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors shadow-sm shadow-blue-900/20 active:scale-95 border border-blue-500 hover:border-blue-400"
                  >
                    <FileDown className="w-4 h-4" />
                    <span>Abrir Documento</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
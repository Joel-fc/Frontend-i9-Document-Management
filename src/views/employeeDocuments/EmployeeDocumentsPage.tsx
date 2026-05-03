import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getEmployeeDocumentsService } from '../../services/employeeServices';
import type { EmployeeDocumentsResponse } from '../../services/employeeServices';
import { FileText, FileDown, ArrowLeft, File, Image as ImageIcon, SearchX } from 'lucide-react';

export default function EmployeeDocumentsPage() {
  const { id } = useParams<{ id: string }>();
  const [employeeData, setEmployeeData] = useState<EmployeeDocumentsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

    fetchDocuments();
  }, [id]);

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
    <div className="min-h-screen bg-gray-100 pt-16 pb-12 px-4 sm:px-6 lg:px-8 font-sans">
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
          <div className="flex items-center mt-4 sm:mt-0 gap-3 bg-gray-50 py-2 px-4 rounded-lg border border-gray-200 text-brand-blue shadow-sm">
            <span className="font-bold">{employeeData?.documents?.length || 0}</span> <span className="uppercase text-xs font-semibold tracking-wider">documentos</span>
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
    </div>
  );
}
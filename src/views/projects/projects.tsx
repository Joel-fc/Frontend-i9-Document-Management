import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, AlertCircle, RefreshCw } from 'lucide-react';
import type { Project } from '../../services/projectServices';
import { getProjectsService } from '../../services/projectServices';
import { ProjectCard } from '../../components/ProjectCard';
import { ProjectSkeleton } from '../../components/ProjectSkeleton';

export default function Projects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTitle, setSearchTitle] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTitle);
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTitle]);

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getProjectsService(currentPage, debouncedSearch);
      
      if (response && response.projects) {
        setProjects(response.projects);
        setTotalPages(response.totalPages || 1);
      } else {
        console.warn('Formato de resposta não reconhecido:', response);
        setProjects([]); 
      }
    } catch (err: any) {
      if (err.response?.status === 401 || err.message === 'No token found') {
        localStorage.removeItem('@i9:token');
        navigate('/');
      } else {
        setError('Ocorreu um erro ao buscar os projetos. Tente novamente mais tarde.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [currentPage, debouncedSearch]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Section */}
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Lista de Projetos</h1>
          </div>
          
          <button className="inline-flex items-center justify-center bg-[#355a92] hover:bg-[#294672] text-white px-4 py-2 rounded-md font-medium transition-colors shadow-sm">
            <Plus className="w-5 h-5 mr-2" />
            Novo Projeto
          </button>
        </section>

        {/* Filter Section */}
        <section className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md leading-5 bg-white placeholder-slate-500 focus:outline-none focus:placeholder-slate-400 focus:ring-1 focus:ring-[#355a92] focus:border-[#355a92] sm:text-sm transition-colors"
              placeholder="Buscar pelo nome do projeto..."
            />
          </div>
        </section>

        {/* Feedback Messages */}
        {error && (
          <div className="bg-red-50 p-4 rounded-md flex items-center text-red-700 border border-red-200">
            <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
            <span>{error}</span>
            <button onClick={fetchProjects} className="ml-auto flex items-center text-sm font-medium hover:text-red-800">
              <RefreshCw className="w-4 h-4 mr-1" /> Tentar Novamente
            </button>
          </div>
        )}

        {/* Projects Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 9 }).map((_, index) => <ProjectSkeleton key={index} />)
          ) : projects.length > 0 ? (
            projects.map((project) => <ProjectCard key={project.id} project={project} />)
          ) : (
            <div className="col-span-1 sm:col-span-2 lg:col-span-3 flex flex-col items-center justify-center bg-white p-12 rounded-xl border border-dashed border-slate-300">
              <div className="bg-slate-100 p-4 rounded-full mb-4">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-medium text-slate-900 mb-1">Nenhum projeto encontrado</h3>
              <p className="text-slate-500 text-center max-w-sm">
                Não localizamos nenhum projeto com os filtros selecionados ou ainda não há cadastros.
              </p>
            </div>
          )}
        </section>

        {/* Pagination Controls */}
        {!loading && projects.length > 0 && totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-200 bg-white px-4 py-3 sm:px-6 rounded-xl shadow-sm">
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-slate-700">
                  Mostrando página <span className="font-medium">{currentPage}</span> de <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              <div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <span className="sr-only">Anterior</span>
                    Anterior
                  </button>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage >= totalPages}
                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <span className="sr-only">Próxima</span>
                    Próxima
                  </button>
                </nav>
              </div>
            </div>
            
            {/* Mobile Pagination */}
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="relative inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Anterior
              </button>
              <button
                onClick={handleNextPage}
                disabled={currentPage >= totalPages}
                className="relative ml-3 inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Próxima
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProjectByIdService } from '../../services/projectServices';
import type { ProjectDetails } from '../../services/projectServices';
import { Plus } from 'lucide-react';
import { LinkEmployeeModal } from '../../components/LinkEmployeeModal';

export default function ProjectDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);

  const fetchProject = async () => {
    try {
      if (!isLinkModalOpen && !project) setLoading(true); // avoid full loading skeleton on background refresh
      if (id) {
        const data = await getProjectByIdService(id);
        setProject(data);
      }
    } catch (err) {
      setError('Failed to load project details.');
    } finally {
      if (!isLinkModalOpen) setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-7xl mx-auto">
          {/* Skeleton Hero */}
          <div className="w-full h-64 bg-gray-200 rounded-lg animate-pulse mb-8 border border-gray-100"></div>
          {/* Skeleton Team */}
          <div className="h-8 w-48 bg-gray-200 rounded-md animate-pulse mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg p-6 border border-gray-200 animate-pulse h-40"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
        <div className="text-center text-brand-blue">
          <h2 className="text-2xl font-bold uppercase tracking-wide mb-2">Erro</h2>
          <p className="text-gray-600">{error || 'Projeto não encontrado.'}</p>
          <Link to="/projects" className="text-brand-orange hover:text-orange-600 mt-4 inline-block font-semibold uppercase tracking-wider underline">
            Voltar aos Projetos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12 font-sans">
      {/* Hero Section */}
      <div className="w-full bg-brand-blue border-b-4 border-brand-orange shadow-lg pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 items-start md:items-center">
          {project.imageUrl ? (
            <img
              src={project.imageUrl}
              alt={project.title}
              className="w-full md:w-64 h-64 object-cover rounded-lg border-2 border-white shadow-md bg-white"
            />
          ) : (
            <div className="w-full md:w-64 h-64 bg-white rounded-lg border-2 border-white flex items-center justify-center shadow-md">
              <span className="text-gray-400 font-medium uppercase tracking-wide text-sm">Imagem não disponível</span>
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-4 uppercase tracking-widest">{project.title}</h1>
            <p className="text-gray-100 text-lg leading-relaxed max-w-3xl">
              {project.description || 'Nenhuma descrição fornecida.'}
            </p>
            <div className="mt-6 flex gap-4">
              <span className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider
                ${project.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 
                  project.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' : 
                  'bg-gray-100 text-gray-800'}`}>
                {project.status.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div className="relative">
            <div className="absolute -top-3 left-0 w-10 h-1 bg-brand-orange rounded-full"></div>
            <h2 className="text-2xl mt-1 font-bold text-brand-blue uppercase tracking-widest">Equipe do Projeto</h2>
          </div>
          <button 
            onClick={() => setIsLinkModalOpen(true)}
            className="inline-flex items-center justify-center bg-brand-orange hover:bg-orange-600 text-white px-5 py-2.5 rounded-md font-semibold tracking-wide uppercase transition-colors shadow-md text-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Vincular Funcionário
          </button>
        </div>

        {(!project.users || project.users.length === 0) ? (
          <div className="bg-white border border-gray-200 rounded-lg p-10 text-center shadow-sm">
            <h3 className="text-brand-blue font-bold uppercase tracking-wide mb-2">Nenhum membro alocado.</h3>
            <p className="text-gray-500 text-sm">Este projeto ainda não possui colaboradores registrados.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {project.users.map((member) => (
              <div
                key={member.id}
                className="bg-white border text-brand-blue border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow shadow-sm flex flex-col justify-between"
              >
                <div className="flex items-center gap-4 mb-6">
                  {member.avatarUrl ? (
                    <img
                      src={member.avatarUrl}
                      alt={member.name}
                      className="w-14 h-14 rounded-full border-2 border-brand-orange object-cover p-0.5"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-brand-blue flex items-center justify-center border-2 border-brand-orange shrink-0">
                      <span className="text-white font-bold text-lg">
                        {member.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-brand-blue font-bold uppercase tracking-wide truncate" title={member.name}>
                      {member.name}
                    </h3>
                    <p className="text-gray-500 text-sm truncate uppercase tracking-widest text-xs" title={member.role || 'Colaborador'}>
                      {member.role || 'Colaborador'}
                    </p>
                  </div>
                </div>

                <Link
                  to={`/employees/${member.id}/documents`}
                  className="w-full px-4 py-2.5 bg-brand-blue hover:bg-[#002d44] text-white text-sm font-bold uppercase tracking-wider rounded-lg transition-colors border border-brand-blue flex justify-center items-center gap-2 group"
                >
                  <span>Ver Documentos</span>
                  <svg className="w-4 h-4 text-brand-orange transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      <LinkEmployeeModal
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
        onSuccess={() => {
          setIsLinkModalOpen(false);
          fetchProject();
        }}
        projectId={id!}
        currentUsers={project.users || []}
      />
    </div>
  );
}
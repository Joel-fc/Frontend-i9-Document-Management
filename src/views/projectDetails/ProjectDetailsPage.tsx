import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProjectByIdService } from '../../services/projectServices';
import type { ProjectDetails } from '../../services/projectServices';

export default function ProjectDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        if (id) {
          const data = await getProjectByIdService(id);
          setProject(data);
        }
      } catch (err) {
        setError('Failed to load project details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 pt-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Skeleton Hero */}
          <div className="w-full h-64 bg-slate-800 rounded-lg animate-pulse mb-8 border border-slate-700"></div>
          {/* Skeleton Team */}
          <div className="h-8 w-48 bg-slate-800 rounded-md animate-pulse mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-800 rounded-lg p-6 border border-slate-700 animate-pulse h-40"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="text-center text-slate-300">
          <h2 className="text-2xl font-semibold mb-2">Error</h2>
          <p>{error || 'Project not found.'}</p>
          <Link to="/projects" className="text-blue-400 hover:text-blue-300 mt-4 inline-block underline">
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 pb-12">
      {/* Hero Section */}
      <div className="w-full bg-slate-800 border-b border-slate-700 shadow-sm pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 items-start md:items-center">
          {project.imageUrl ? (
            <img
              src={project.imageUrl}
              alt={project.title}
              className="w-full md:w-64 h-64 object-cover rounded-lg border border-slate-700 shadow-md"
            />
          ) : (
            <div className="w-full md:w-64 h-64 bg-slate-700 rounded-lg border border-slate-600 flex items-center justify-center shadow-md">
              <span className="text-slate-400 font-medium">No image available</span>
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-4">{project.title}</h1>
            <p className="text-slate-300 text-lg leading-relaxed max-w-3xl">
              {project.description || 'No description provided for this project.'}
            </p>
            <div className="mt-6 flex gap-4">
              <span className={`px-4 py-1.5 rounded-full text-sm font-semibold 
                ${project.status === 'COMPLETED' ? 'bg-emerald-900/50 text-emerald-400 border border-emerald-800' : 
                  project.status === 'IN_PROGRESS' ? 'bg-blue-900/50 text-blue-400 border border-blue-800' : 
                  'bg-slate-700 text-slate-300 border border-slate-600'}`}>
                {project.status.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white">Equipe do Projeto</h2>
        </div>

        {(!project.users || project.users.length === 0) ? (
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-10 text-center">
            <h3 className="text-slate-300 font-medium mb-1">Nenhum membro alocado.</h3>
            <p className="text-slate-500 text-sm">Este projeto ainda não possui colaboradores registrados.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {project.users.map((member) => (
              <div
                key={member.id}
                className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-slate-500 transition-colors shadow-sm flex flex-col justify-between"
              >
                <div className="flex items-center gap-4 mb-6">
                  {member.avatarUrl ? (
                    <img
                      src={member.avatarUrl}
                      alt={member.name}
                      className="w-14 h-14 rounded-full border-2 border-slate-600 object-cover"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-slate-700 flex items-center justify-center border-2 border-slate-600 shrink-0">
                      <span className="text-slate-300 font-bold text-lg">
                        {member.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold truncate" title={member.name}>
                      {member.name}
                    </h3>
                    <p className="text-slate-400 text-sm truncate" title={member.role || 'Colaborador'}>
                      {member.role || 'Colaborador'}
                    </p>
                  </div>
                </div>

                <Link
                  to={`/employees/${member.id}/documents`}
                  className="w-full px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-lg transition-colors border border-slate-600 flex justify-center items-center gap-2 group"
                >
                  <span>Ver Documentos</span>
                  <svg className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
import { useState } from 'react';
import { ProjectStatus } from '../services/projectServices';
import type { Project } from '../services/projectServices';
import { ExternalLink, HardHat, CheckCircle, Clock, XCircle, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProjectCardProps {
  project: Project;
}

const statusConfig: Record<ProjectStatus, { label: string; bg: string; text: string; icon: React.FC<any> }> = {
  [ProjectStatus.PLANNING]: {
    label: 'Planejamento',
    bg: 'bg-yellow-100',
    text: 'text-yellow-700',
    icon: HardHat,
  },
  [ProjectStatus.IN_PROGRESS]: {
    label: 'Em Execução',
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    icon: Clock,
  },
  [ProjectStatus.COMPLETED]: {
    label: 'Finalizado',
    bg: 'bg-green-100',
    text: 'text-green-700',
    icon: CheckCircle,
  },
  [ProjectStatus.CANCELED]: {
    label: 'Cancelado',
    bg: 'bg-red-100',
    text: 'text-red-700',
    icon: XCircle,
  },
};

export function ProjectCard({ project }: ProjectCardProps) {
  const [imageError, setImageError] = useState(false);
  
  const statusInfo = statusConfig[project.status];
  const StatusIcon = statusInfo.icon;

  return (
    <div className="bg-white border text-card-foreground shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col h-full ring-1 ring-slate-200">
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100 flex items-center justify-center">
        {!project.imageUrl || imageError ? (
          <div className="flex flex-col items-center justify-center text-slate-400">
            <Building2 className="w-12 h-12 mb-2 opacity-50" />
            <span className="text-sm font-medium">Imagem indisponível</span>
          </div>
        ) : (
          <img
            src={project.imageUrl}
            alt={project.title}
            className="object-cover w-full h-full"
            onError={() => setImageError(true)}
          />
        )}
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-semibold text-lg leading-tight text-slate-900 line-clamp-2" title={project.title}>
            {project.title}
          </h3>
        </div>
        
        <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-grow" title={project.description}>
          {project.description || 'Nenhuma descrição fornecida.'}
        </p>
        
        <div className="flex items-center justify-between mt-auto space-y-4 flex-col sm:flex-row sm:space-y-0 sm:items-end">
           <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.text}` }>
            <StatusIcon className="w-3.5 h-3.5 mr-1" />
            {statusInfo.label}
          </span>
          <Link
            to={`/projects/${project.id}`}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 ring-offset-background hover:bg-slate-100 hover:text-slate-900 h-9 px-4 py-2 border border-slate-200 w-full sm:w-auto"
          >
            Lista de Colaboradores
            <ExternalLink className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
}

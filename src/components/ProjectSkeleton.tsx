export function ProjectSkeleton() {
  return (
    <div className="bg-white border text-card-foreground shadow-sm rounded-xl overflow-hidden h-full ring-1 ring-slate-200 animate-pulse">
      {/* Imagem Placeholder */}
      <div className="w-full aspect-video bg-slate-200" />
      
      <div className="p-6 flex flex-col flex-grow">
        {/* Title */}
        <div className="h-6 bg-slate-200 rounded w-3/4 mb-4" />
        
        {/* Description line 1 and 2 */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-slate-200 rounded w-full" />
          <div className="h-4 bg-slate-200 rounded w-5/6" />
        </div>
        
        {/* Footer com botão e status */}
        <div className="flex items-center justify-between mt-auto space-y-4 flex-col sm:flex-row sm:space-y-0 sm:items-end">
          <div className="h-5 bg-slate-200 rounded-full w-24 mb-2 sm:mb-0" />
          <div className="h-9 bg-slate-200 rounded-md w-full sm:w-28" />
        </div>
      </div>
    </div>
  );
}

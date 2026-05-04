import React, { useState, useEffect } from 'react';
import { X, Search, User, Loader2 } from 'lucide-react';
import { getAllEmployeesService } from '../services/employeeServices';
import type { EmployeeListItem } from '../services/employeeServices';
import { addEmployeeToProjectService } from '../services/projectServices';

interface LinkEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  projectId: string;
  currentUsers: Array<{ id: string | number }>;
}

export function LinkEmployeeModal({ isOpen, onClose, onSuccess, projectId, currentUsers }: LinkEmployeeModalProps) {
  const [employees, setEmployees] = useState<EmployeeListItem[]>([]);
  const [employeeSearch, setEmployeeSearch] = useState('');
  const [selectedEmployees, setSelectedEmployees] = useState<EmployeeListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchEmployees();
      setSelectedEmployees([]);
      setEmployeeSearch('');
      setError(null);
    }
  }, [isOpen]);

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const data = await getAllEmployeesService();
      const allEmployees = Array.isArray(data) ? data : (data as any).employees || [];
      // Filter out employees that are already in the project
      const currentIds = currentUsers.map(u => String(u.id));
      setEmployees(allEmployees.filter((emp: EmployeeListItem) => !currentIds.includes(String(emp.id))));
    } catch (err) {
      console.error('Erro ao buscar colaboradores:', err);
      setError('Erro ao carregar lista de colaboradores.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleEmployeeSelection = (employee: EmployeeListItem) => {
    if (selectedEmployees.find((e) => e.id === employee.id)) {
      setSelectedEmployees(selectedEmployees.filter((e) => e.id !== employee.id));
    } else {
      setSelectedEmployees([...selectedEmployees, employee]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (selectedEmployees.length === 0) {
      setError('Por favor, selecione ao menos um colaborador.');
      return;
    }

    setIsSubmitting(true);

    try {
      await addEmployeeToProjectService(projectId, selectedEmployees.map(e => String(e.id)));
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Erro ao vincular colaborador:', err);
      setError(err.response?.data?.message || err.message || 'Ocorreu um erro ao vincular os colaboradores. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const filteredEmployees = employees.filter((emp) =>
    (emp?.name || '').toLowerCase().includes(employeeSearch.toLowerCase()) || 
    (emp?.email || '').toLowerCase().includes(employeeSearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-brand-blue px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white tracking-widest uppercase">
            Vincular Funcionário
          </h2>
          <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          <form id="link-employee-form" onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 text-red-700 rounded border border-red-200 text-sm">
                {error}
              </div>
            )}

            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar colaborador por nome ou email..."
                value={employeeSearch}
                onChange={(e) => setEmployeeSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-orange focus:border-brand-orange transition-colors shadow-sm"
              />
            </div>

            <div className="border border-gray-200 rounded-lg overflow-hidden flex flex-col">
              <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 font-semibold text-brand-blue text-sm uppercase tracking-wide">
                Selecione os Colaboradores
              </div>
              <div className="max-h-60 overflow-y-auto custom-scrollbar p-2 space-y-1">
                {isLoading ? (
                  <div className="flex justify-center items-center py-6 text-brand-blue">
                    <Loader2 className="w-6 h-6 animate-spin" />
                  </div>
                ) : filteredEmployees.length === 0 ? (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    Nenhum colaborador disponível para vínculo.
                  </div>
                ) : (
                  filteredEmployees.map((emp) => {
                    const isSelected = selectedEmployees.some((e) => e.id === emp.id);
                    return (
                      <button
                        type="button"
                        key={emp.id}
                        onClick={() => toggleEmployeeSelection(emp)}
                        className={`w-full text-left px-3 py-2.5 text-sm rounded-md flex items-center justify-between transition-colors ${
                          isSelected ? 'bg-orange-50 border border-brand-orange text-brand-orange shadow-sm' : 'bg-white border border-transparent text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${isSelected ? 'bg-brand-orange text-white' : 'bg-brand-blue text-white'}`}>
                            {(emp?.name || 'U').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold">{emp?.name || 'Usuário Sem Nome'}</p>
                            <p className="text-xs opacity-80">{emp?.email}</p>
                          </div>
                        </div>
                        {isSelected && <User className="w-5 h-5" />}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 pt-2">
              {selectedEmployees.map((emp) => (
                <div key={emp.id} className="flex items-center bg-brand-blue text-white rounded-full px-3 py-1 text-xs">
                  <span className="max-w-[120px] truncate">{emp?.name || 'Usuário'}</span>
                  <button
                    type="button"
                    onClick={() => toggleEmployeeSelection(emp)}
                    className="ml-2 hover:text-brand-orange"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-5 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="link-employee-form"
            disabled={isSubmitting || selectedEmployees.length === 0}
            className="flex items-center justify-center bg-brand-orange hover:bg-orange-600 text-white px-5 py-2 rounded-md text-sm font-semibold tracking-wide transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Vinculando...
              </>
            ) : (
              'Vincular'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
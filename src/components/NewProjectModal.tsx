import React, { useState, useEffect } from 'react';
import { X, Plus, User, Trash, Search, UploadCloud, Loader2 } from 'lucide-react';
import { supabase } from '../library/supabase';
import { createProjectService } from '../services/projectServices';
import { getAllEmployeesService } from '../services/employeeServices';
import type { EmployeeListItem } from '../services/employeeServices';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function NewProjectModal({ isOpen, onClose, onSuccess }: NewProjectModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [selectedEmployees, setSelectedEmployees] = useState<EmployeeListItem[]>([]);
  
  const [employees, setEmployees] = useState<EmployeeListItem[]>([]);
  const [isEmployeeDropdownOpen, setIsEmployeeDropdownOpen] = useState(false);
  const [employeeSearch, setEmployeeSearch] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchEmployees();
      resetForm();
    }
  }, [isOpen]);

  const fetchEmployees = async () => {
    try {
      const data = await getAllEmployeesService();
      // Em alguns casos, a API pode enviar os usuários de uma chave na resposta
      setEmployees(Array.isArray(data) ? data : (data as any).employees || []);
    } catch (err) {
      console.error('Erro ao buscar colaboradores:', err);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setFile(null);
    setSelectedEmployees([]);
    setEmployeeSearch('');
    setIsEmployeeDropdownOpen(false);
    setError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const toggleEmployeeSelection = (employee: EmployeeListItem) => {
    if (selectedEmployees.find((e) => e.id === employee.id)) {
      setSelectedEmployees(selectedEmployees.filter((e) => e.id !== employee.id));
    } else {
      setSelectedEmployees([...selectedEmployees, employee]);
    }
  };

  const removeEmployee = (employeeId: string) => {
    setSelectedEmployees(selectedEmployees.filter((e) => e.id !== employeeId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title || !description || !file) {
      setError('Por favor, preencha todos os campos e selecione uma imagem.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Upload da imagem para o Supabase
      const fileName = `${Date.now()}_${file.name.replace(/\\s+/g, '_')}`;
      const { error: uploadError } = await supabase.storage
        .from('project_i9_images')
        .upload(fileName, file);

      if (uploadError) {
        throw new Error(`Erro no upload da imagem: ${uploadError.message}`);
      }

      // 2. Obter a URL Pública
      const { data: publicUrlData } = supabase.storage
        .from('project_i9_images')
        .getPublicUrl(fileName);

      const imageUrl = publicUrlData.publicUrl;

      // 3. Montar Payload e chamar API
      await createProjectService({
        title,
        description,
        imageUrl,
        employeeIds: selectedEmployees.map(e => String(e.id))
      });

      // Sucesso
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Erro ao criar projeto:', err);
      setError(err.message || 'Ocorreu um erro ao criar o projeto. Tente novamente.');
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
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-brand-blue px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white tracking-widest uppercase">
            Novo Projeto
          </h2>
          <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Formulário com Scroll */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          <form id="new-project-form" onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 text-red-700 rounded border border-red-200 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Nome do Projeto</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-brand-orange focus:border-brand-orange outline-none transition-colors"
                placeholder="Ex: i9 Document Management"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Descrição</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-brand-orange focus:border-brand-orange outline-none transition-colors"
                placeholder="Descreva o objetivo do projeto..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Imagem de Capa</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-brand-orange transition-colors">
                <div className="space-y-1 text-center">
                  <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600 justify-center">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-brand-orange hover:text-orange-600 focus-within:outline-none">
                      <span>Upload de arquivo</span>
                      <input
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleFileChange}
                        required
                      />
                    </label>
                    <p className="pl-1">ou arraste e solte</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF até 10MB</p>
                  {file && <p className="text-sm font-semibold text-brand-blue mt-2">{file.name}</p>}
                </div>
              </div>
            </div>

            {/* Seção Equipe do Projeto */}
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-brand-blue">Equipe do Projeto</h3>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsEmployeeDropdownOpen(!isEmployeeDropdownOpen)}
                    className="text-sm bg-brand-blue text-white px-3 py-1.5 rounded flex items-center hover:bg-[#002a40] transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Adicionar Colaborador
                  </button>

                  {/* Dropdown de Colaboradores */}
                  {isEmployeeDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-xl z-10">
                      <div className="p-2 border-b border-gray-100">
                        <div className="relative">
                          <Search className="w-4 h-4 absolute left-2 top-2.5 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Buscar..."
                            value={employeeSearch}
                            onChange={(e) => setEmployeeSearch(e.target.value)}
                            className="w-full pl-8 pr-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-brand-orange"
                          />
                        </div>
                      </div>
                      <div className="max-h-48 overflow-y-auto">
                        {filteredEmployees.length === 0 ? (
                          <div className="p-3 text-sm text-gray-500 text-center">Nenhum encontrado.</div>
                        ) : (
                          filteredEmployees.map((emp) => {
                            const isSelected = selectedEmployees.some((e) => e.id === emp.id);
                            return (
                              <button
                                type="button"
                                key={emp.id}
                                onClick={() => toggleEmployeeSelection(emp)}
                                className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between hover:bg-gray-50 ${isSelected ? 'bg-orange-50 text-brand-orange' : 'text-gray-700'}`}
                              >
                                <span className="truncate pr-2">{emp?.name || 'Usuário Sem Nome'}</span>
                                {isSelected && <User className="w-4 h-4" />}
                              </button>
                            );
                          })
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Badges/Chips de Selecionados */}
              <div className="flex flex-wrap gap-2">
                {selectedEmployees.length === 0 && (
                  <p className="text-sm text-gray-500 italic">Nenhum colaborador adicionado.</p>
                )}
                {selectedEmployees.map((emp) => (
                  <div key={emp.id} className="flex items-center bg-white border border-gray-300 rounded-full px-3 py-1 text-sm text-brand-blue shadow-sm">
                    <div className="w-5 h-5 rounded-full bg-brand-orange text-white flex items-center justify-center mr-2 text-xs font-bold">
                      {(emp?.name || 'U').charAt(0).toUpperCase()}
                    </div>
                    <span className="max-w-[120px] truncate">{emp?.name || 'Usuário Sem Nome'}</span>
                    <button
                      type="button"
                      onClick={() => removeEmployee(emp.id)}
                      className="ml-2 text-gray-400 hover:text-red-500"
                    >
                      <Trash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
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
            form="new-project-form"
            disabled={isSubmitting}
            className="flex items-center justify-center bg-brand-orange hover:bg-orange-600 text-white px-5 py-2 rounded-md text-sm font-semibold tracking-wide transition-colors disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              'Salvar Projeto'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

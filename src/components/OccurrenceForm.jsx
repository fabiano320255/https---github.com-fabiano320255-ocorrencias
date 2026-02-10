import React, { useState, useEffect } from 'react';
import { Camera, Plus, Trash2, Calendar, Save, X } from 'lucide-react';

export function OccurrenceForm({ onAdd, editingItem, onCancelEdit }) {
    const [formData, setFormData] = useState({
        condominio: '',
        contato: '',
        localEspecifico: '',
        observacao: '',
        data: new Date().toISOString().split('T')[0],
        files: []
    });
    const [previews, setPreviews] = useState([]);

    // Load editing item into form
    useEffect(() => {
        if (editingItem) {
            setFormData({
                condominio: editingItem.condominio,
                contato: editingItem.contato,
                localEspecifico: editingItem.localEspecifico,
                observacao: editingItem.observacao,
                data: editingItem.data,
                files: editingItem.files || []
            });

            // Generate previews for existing files
            if (editingItem.files && editingItem.files.length > 0) {
                const newPreviews = editingItem.files.map(file => {
                    if (file instanceof Blob || file instanceof File) {
                        return URL.createObjectURL(file);
                    }
                    return file; // If string URL
                });
                setPreviews(newPreviews);
            } else {
                setPreviews([]);
            }
        }
    }, [editingItem]);

    useEffect(() => {
        return () => previews.forEach(url => {
            if (url.startsWith('blob:')) URL.revokeObjectURL(url);
        });
    }, [previews]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            const newPreviews = newFiles.map(file => URL.createObjectURL(file));

            setFormData(prev => ({
                ...prev,
                files: [...prev.files, ...newFiles]
            }));
            setPreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const removeMidia = (index) => {
        setFormData(prev => ({
            ...prev,
            files: prev.files.filter((_, i) => i !== index)
        }));
        setPreviews(prev => {
            const urlToRemove = prev[index];
            if (urlToRemove && urlToRemove.startsWith('blob:')) URL.revokeObjectURL(urlToRemove);
            return prev.filter((_, i) => i !== index);
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd({
            ...formData,
            id: editingItem ? editingItem.id : Date.now(), // Keep ID if editing
        });

        // Reset
        setFormData({
            condominio: '',
            contato: '',
            localEspecifico: '',
            observacao: '',
            data: new Date().toISOString().split('T')[0],
            files: []
        });
        setPreviews([]);
    };

    return (
        <form onSubmit={handleSubmit} className={`space-y-4 p-4 shadow rounded-lg mb-6 border ${editingItem ? 'bg-yellow-50 border-yellow-200' : 'bg-white border-slate-200'}`}>
            <div className="flex justify-between items-center border-b pb-2 mb-4">
                <h2 className="text-xl font-bold text-slate-800">
                    {editingItem ? 'Editar Ocorrência' : 'Nova Ocorrência'}
                </h2>
                {editingItem && (
                    <button type="button" onClick={onCancelEdit} className="text-sm text-slate-500 hover:text-slate-700 flex items-center">
                        <X className="h-4 w-4 mr-1" /> Cancelar
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-semibold text-slate-700">Data da Ocorrência</label>
                    <div className="relative mt-1 rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Calendar className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="date"
                            name="data"
                            value={formData.data}
                            onChange={handleChange}
                            className="block w-full rounded-md border-slate-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700">Conjunto / Local Geral *</label>
                    <input
                        type="text"
                        name="condominio"
                        value={formData.condominio}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border hover:border-indigo-300 transition"
                        placeholder="Ex: Condomínio Solar"
                        required
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-semibold text-slate-700">Local da Ocorrência *</label>
                <input
                    type="text"
                    name="localEspecifico"
                    value={formData.localEspecifico}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border hover:border-indigo-300 transition"
                    placeholder="Ex: Bloco B, Apto 402 - Ralo da cozinha"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-semibold text-slate-700">Responsável / Contato</label>
                <input
                    type="text"
                    name="contato"
                    value={formData.contato}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border hover:border-indigo-300 transition"
                    placeholder="Ex: Sr. João"
                />
            </div>

            <div>
                <label className="block text-sm font-semibold text-slate-700">Observação</label>
                <textarea
                    name="observacao"
                    value={formData.observacao}
                    onChange={handleChange}
                    rows="3"
                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border hover:border-indigo-300 transition"
                    placeholder="Detalhes do que foi observado..."
                ></textarea>
            </div>

            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Evidências (Fotos/Vídeos)</label>
                <div className="flex flex-col space-y-3">
                    <label className="cursor-pointer bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold py-3 px-4 rounded-lg flex items-center justify-center border border-indigo-200 transition">
                        <Camera className="mr-2 h-5 w-5" />
                        <span>Adicionar Mídia</span>
                        <input
                            type="file"
                            multiple
                            accept="image/*,video/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </label>
                </div>

                {previews.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-4">
                        {previews.map((src, index) => (
                            <div key={index} className="relative group">
                                <img src={src} alt={`preview ${index}`} className="h-24 w-full object-cover rounded-lg shadow-sm" />
                                <button
                                    type="button"
                                    onClick={() => removeMidia(index)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <button
                type="submit"
                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-bold text-white transition transform active:scale-95 ${editingItem ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}
            >
                {editingItem ? <Save className="mr-2 h-5 w-5" /> : <Plus className="mr-2 h-5 w-5" />}
                {editingItem ? 'Atualizar Ocorrência' : 'Salvar Ocorrência'}
            </button>
        </form>
    );
}

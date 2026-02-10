import React, { useState, useEffect } from 'react';
import { Trash, Share2, Pencil, Smartphone, Monitor } from 'lucide-react';

export function OccurrenceList({ occurrences, onRemove, onEdit, onShareMobile, onShareWeb }) {
    const [imageUrls, setImageUrls] = useState({});

    useEffect(() => {
        const newUrls = {};
        occurrences.forEach(occ => {
            if (occ.files && occ.files.length > 0) {
                occ.files.forEach((file, index) => {
                    if (file instanceof Blob || file instanceof File) {
                        const key = `${occ.id}-${index}`;
                        if (!imageUrls[key]) {
                            newUrls[key] = URL.createObjectURL(file);
                        }
                    }
                });
            }
        });

        if (Object.keys(newUrls).length > 0) {
            setImageUrls(prev => ({ ...prev, ...newUrls }));
        }
    }, [occurrences]);

    const getSrc = (file, id, index) => {
        if (typeof file === 'string') return file;
        return imageUrls[`${id}-${index}`] || '';
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    }

    if (occurrences.length === 0) {
        return (
            <div className="text-center p-8 text-slate-500">
                Nenhuma ocorrência registrada ainda.
            </div>
        );
    }

    return (
        <div className="space-y-4 p-4">
            {occurrences.map((item) => (
                <div key={item.id} className="bg-white shadow rounded-lg p-4 border-l-4 border-indigo-500 relative">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-bold text-lg">{item.condominio}</h3>
                            <p className="text-sm font-semibold text-slate-800">{item.localEspecifico}</p>
                            <p className="text-xs text-slate-500 flex items-center gap-1">
                                📅 {formatDate(item.data)}
                            </p>
                        </div>
                        <div className="flex space-x-1">
                            <button onClick={() => onEdit(item)} className="text-yellow-600 hover:text-yellow-800 p-2" title="Editar">
                                <Pencil className="h-5 w-5" />
                            </button>
                            <button onClick={() => onRemove(item.id)} className="text-red-500 hover:text-red-700 p-2" title="Remover">
                                <Trash className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {item.contato && <p className="text-sm mt-2"><strong>Contato:</strong> {item.contato}</p>}
                    {item.observacao && <p className="mt-2 text-slate-700 bg-slate-50 p-2 rounded text-sm whitespace-pre-wrap">{item.observacao}</p>}

                    {item.files && item.files.length > 0 && (
                        <div className="flex overflow-x-auto gap-2 mt-3 pb-2">
                            {item.files.map((file, i) => (
                                <img
                                    key={i}
                                    src={getSrc(file, item.id, i)}
                                    className="h-20 w-20 object-cover rounded border cursor-pointer hover:opacity-90"
                                    alt="evidencia"
                                    onClick={() => window.open(getSrc(file, item.id, i), '_blank')}
                                />
                            ))}
                        </div>
                    )}
                </div>
            ))}

            <div className="sticky bottom-4 pt-4 bg-gradient-to-t from-slate-100 to-transparent space-y-2">
                <button
                    onClick={onShareMobile}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg flex items-center justify-center transition transform active:scale-95"
                >
                    <Smartphone className="mr-2 h-6 w-6" /> Enviar (Celular/App)
                </button>
                <button
                    onClick={onShareWeb}
                    className="w-full bg-slate-700 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-lg shadow-lg flex items-center justify-center transition transform active:scale-95"
                >
                    <Monitor className="mr-2 h-6 w-6" /> Enviar (Computador/Web)
                </button>
            </div>
        </div>
    );
}

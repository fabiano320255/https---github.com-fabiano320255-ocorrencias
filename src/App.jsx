import React, { useState, useEffect } from 'react';
import { OccurrenceForm } from './components/OccurrenceForm';
import { OccurrenceList } from './components/OccurrenceList';
import { ClipboardList, AlertCircle } from 'lucide-react';
import { addOccurrence, getAllOccurrences, deleteOccurrence } from './db';

function App() {
  const [occurrences, setOccurrences] = useState([]);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    loadOccurrences();
  }, []);

  const loadOccurrences = async () => {
    const data = await getAllOccurrences();
    data.sort((a, b) => b.id - a.id);
    setOccurrences(data);
  };

  const handleAddOccurrence = async (occurrence) => {
    await addOccurrence(occurrence);
    await loadOccurrences();
    setEditingItem(null); // Exit edit mode
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRemoveOccurrence = async (id) => {
    if (window.confirm('Tem certeza que deseja apagar esta ocorrência?')) {
      await deleteOccurrence(id);
      await loadOccurrences();
    }
  };

  const handleEditOccurrence = (item) => {
    setEditingItem(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const generateReportText = () => {
    let message = `*RELATÓRIO DE OCORRÊNCIAS*\n`;
    message += `📅 Data do Relatório: ${new Date().toLocaleDateString()}\n\n`;

    occurrences.forEach((occ, index) => {
      const [year, month, day] = occ.data.split('-');
      const formattedDate = `${day}/${month}/${year}`;

      message += `--------------------------------\n`;
      message += `*#${occurrences.length - index} - ${occ.condominio.toUpperCase()}*\n`;
      message += `📅 Data: ${formattedDate}\n`;
      message += `📍 Local: ${occ.localEspecifico}\n`;
      if (occ.contato) message += `👤 Contato: ${occ.contato}\n`;
      if (occ.observacao) message += `📝 Obs: ${occ.observacao}\n`;
    });
    return message;
  };

  const handleShareMobile = async () => {
    const message = generateReportText();
    const allFiles = occurrences.flatMap(occ => occ.files || []);

    if (navigator.share) {
      try {
        const shareData = {
          title: 'Relatório de Ocorrências',
          text: message,
        };

        // Only attach files if they exist and are valid Files/Blobs
        // Note: Android often fails if mixing types or too many files.
        // We try to filter for valid blobs
        const validFiles = allFiles.filter(f => f instanceof File || f instanceof Blob);

        if (validFiles.length > 0) {
          // Re-wrap blobs as Files if needed to ensure they have names/types
          const processedFiles = validFiles.map((f, i) => {
            if (f instanceof File) return f;
            return new File([f], `evidence_${i}.jpg`, { type: f.type || 'image/jpeg' });
          });
          shareData.files = processedFiles;
        }

        await navigator.share(shareData);
      } catch (error) {
        console.error('Error sharing:', error);
        alert('Não foi possível compartilhar nativamente. Tente a opção Web/PC.');
      }
    } else {
      alert('Navegador não suporta compartilhamento nativo. Use a opção Web/PC.');
    }
  };

  const handleShareWeb = () => {
    const message = generateReportText();
    // WhatsApp URL scheme
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;

    // Check if we have images and warn user
    const hasImages = occurrences.some(occ => occ.files && occ.files.length > 0);

    if (hasImages) {
      alert('⚠️ ATENÇÃO: O WhatsApp Web não permite enviar fotos automaticamente pelo site.\n\n1. O WhatsApp Web vai abrir com o TEXTO.\n2. Volte aqui, copie as fotos e cole na conversa manualmente.');
    }

    window.open(whatsappUrl, '_blank');
  };

  const handleShareSingleMobile = async (item) => {
    const [year, month, day] = item.data.split('-');
    const formattedDate = `${day}/${month}/${year}`;

    let message = `*OCORRÊNCIA - ${item.condominio.toUpperCase()}*\n`;
    message += `📅 Data: ${formattedDate}\n`;
    message += `📍 Local: ${item.localEspecifico}\n`;
    if (item.contato) message += `👤 Contato: ${item.contato}\n`;
    if (item.observacao) message += `📝 Obs: ${item.observacao}\n`;

    const allFiles = item.files || [];

    if (navigator.share) {
      try {
        const shareData = {
          title: 'Ocorrência',
          text: message,
        };

        const validFiles = allFiles.filter(f => f instanceof File || f instanceof Blob);

        if (validFiles.length > 0) {
          const processedFiles = validFiles.map((f, i) => {
            if (f instanceof File) return f;
            return new File([f], `evidence_${i}.jpg`, { type: f.type || 'image/jpeg' });
          });
          shareData.files = processedFiles;
        }

        await navigator.share(shareData);
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      alert('Navegador não suporta compartilhamento nativo.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 pb-20">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ClipboardList className="h-8 w-8 text-indigo-600" />
            <h1 className="text-xl font-extrabold text-slate-800">GesOcorrências</h1>
          </div>
          <div className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            {occurrences.length} {occurrences.length === 1 ? 'item' : 'itens'}
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        <OccurrenceForm
          onAdd={handleAddOccurrence}
          editingItem={editingItem}
          onCancelEdit={() => setEditingItem(null)}
        />

        <div className="border-t border-slate-200 pt-6">
          <h2 className="text-lg font-bold text-slate-700 mb-4 px-2">Itens Registrados</h2>
          <OccurrenceList
            occurrences={occurrences}
            onRemove={handleRemoveOccurrence}
            onEdit={handleEditOccurrence}
            onShareMobile={handleShareMobile}
            onShareWeb={handleShareWeb}
            onShareSingleMobile={handleShareSingleMobile}
          />
        </div>
      </main>
    </div>
  );
}

export default App;

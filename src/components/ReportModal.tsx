import { useState } from 'react';
import { X, AlertTriangle, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { ReportReason } from '../lib/database.types';

interface ReportModalProps {
  listingId: string;
  userId: string;
  onClose: () => void;
}

const reportReasons: { value: ReportReason; label: string; description: string }[] = [
  { value: 'professional', label: 'Vendeur professionnel', description: 'Cette personne semble etre un professionnel, pas un particulier' },
  { value: 'quantity_suspicious', label: 'Contenu douteux', description: 'L\'annonce semble suspecte ou non conforme' },
  { value: 'inappropriate', label: 'Contenu inapproprie', description: 'L\'annonce contient du contenu offensant ou inapproprie' },
  { value: 'fake', label: 'Annonce frauduleuse', description: 'Cette annonce semble etre une arnaque' },
  { value: 'spam', label: 'Spam / Publicite', description: 'Cette annonce est du spam ou de la publicite' },
  { value: 'other', label: 'Autre', description: 'Autre raison non listee' },
];

export function ReportModal({ listingId, userId, onClose }: ReportModalProps) {
  const [selectedReason, setSelectedReason] = useState<ReportReason | ''>('');
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit() {
    if (!selectedReason) return;

    setLoading(true);
    setError('');

    const { error: submitError } = await supabase.from('reports').insert({
      listing_id: listingId,
      reporter_id: userId,
      reason: selectedReason,
      details: details || null,
    });

    setLoading(false);

    if (submitError) {
      if (submitError.code === '23505') {
        setError('Vous avez deja signale cette annonce.');
      } else {
        setError('Une erreur est survenue. Veuillez reessayer.');
      }
      return;
    }

    setSuccess(true);
    setTimeout(onClose, 2000);
  }

  if (success) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center">
          <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-primary-600" />
          </div>
          <h3 className="text-xl font-bold text-stone-900 mb-2">Merci pour votre signalement</h3>
          <p className="text-stone-600">Nous examinerons cette annonce dans les plus brefs delais.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-stone-200 px-4 py-3 flex items-center justify-between">
          <h2 className="text-xl font-bold text-stone-900">Signaler l'annonce</h2>
          <button
            onClick={onClose}
            className="p-2 text-stone-500 hover:text-stone-700 rounded-full hover:bg-stone-100"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-4">
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <AlertTriangle size={24} className="text-amber-600 flex-shrink-0" />
            <p className="text-sm text-amber-800">
              Signalez uniquement les annonces qui enfreignent nos regles. Les faux signalements peuvent entrainer une suspension de votre compte.
            </p>
          </div>

          <p className="text-stone-700 mb-4">Pourquoi signalez-vous cette annonce ?</p>

          <div className="space-y-3 mb-6">
            {reportReasons.map(reason => (
              <label
                key={reason.value}
                className={`block p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                  selectedReason === reason.value
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="reason"
                    value={reason.value}
                    checked={selectedReason === reason.value}
                    onChange={(e) => setSelectedReason(e.target.value as ReportReason)}
                    className="mt-1 w-5 h-5 text-primary-600 focus:ring-primary-500"
                  />
                  <div>
                    <p className="font-medium text-stone-900">{reason.label}</p>
                    <p className="text-sm text-stone-600">{reason.description}</p>
                  </div>
                </div>
              </label>
            ))}
          </div>

          <div className="mb-6">
            <label htmlFor="details" className="label">
              Details supplementaires (optionnel)
            </label>
            <textarea
              id="details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="input min-h-[100px]"
              placeholder="Ajoutez des informations supplementaires..."
              maxLength={500}
            />
            <p className="text-xs text-stone-500 mt-1 text-right">{details.length}/500</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={!selectedReason || loading}
            className="btn-primary w-full"
          >
            {loading ? (
              <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
            ) : (
              'Envoyer le signalement'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

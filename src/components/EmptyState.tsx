import { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionTo?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionTo,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
      <div className="bg-stone-100 rounded-full p-6 mb-4">
        <Icon size={48} className="text-stone-400" />
      </div>
      <h3 className="text-xl font-semibold text-stone-900 mb-2">{title}</h3>
      <p className="text-stone-600 mb-6 max-w-md">{description}</p>
      {actionLabel && (actionTo || onAction) && (
        <>
          {actionTo ? (
            <Link to={actionTo} className="btn-primary">
              {actionLabel}
            </Link>
          ) : (
            <button onClick={onAction} className="btn-primary">
              {actionLabel}
            </button>
          )}
        </>
      )}
    </div>
  );
}

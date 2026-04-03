import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageCircle, User, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { usePageTitle } from '../lib/usePageTitle';
import { SkeletonConversationList } from '../components/SkeletonDetail';
import type { ConversationWithDetails, Message } from '../lib/database.types';

export function MessagesPage() {
  usePageTitle('Messages');
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [conversations, setConversations] = useState<ConversationWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchConversations();

    const subscription = supabase
      .channel('messages-list-refresh')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        () => { fetchConversations(); }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'messages' },
        () => { fetchConversations(); }
      )
      .subscribe();

    return () => { subscription.unsubscribe(); };
  }, [user, navigate]);

  async function fetchConversations() {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          listing:listings(*),
          buyer:profiles!conversations_buyer_id_fkey(*),
          seller:profiles!conversations_seller_id_fkey(*)
        `)
        .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
        .order('last_message_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const conversationsWithLastMessage = await Promise.all(
          data.map(async (conv) => {
            const { data: messages } = await supabase
              .from('messages')
              .select('*')
              .eq('conversation_id', conv.id)
              .order('created_at', { ascending: false })
              .limit(1);

            const { count } = await supabase
              .from('messages')
              .select('*', { count: 'exact', head: true })
              .eq('conversation_id', conv.id)
              .eq('is_read', false)
              .neq('sender_id', user.id);

            return {
              ...conv,
              last_message: messages?.[0] as Message | undefined,
              unread_count: count || 0,
            };
          })
        );

        setConversations(conversationsWithLastMessage as ConversationWithDetails[]);
      }
    } catch {
      showToast('Impossible de charger les conversations', 'error');
    } finally {
      setLoading(false);
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white">
        <header className="bg-white border-b border-stone-200 px-4 py-4">
          <h1 className="text-2xl font-bold text-stone-900">Messages</h1>
        </header>
        <div className="text-center py-16 px-4">
          <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageCircle size={40} className="text-primary-600" />
          </div>
          <h2 className="text-xl font-semibold text-stone-900 mb-3">Vos conversations</h2>
          <p className="text-stone-600 mb-8 max-w-sm mx-auto">Connectez-vous pour envoyer des messages à vos voisins et organiser vos échanges.</p>
          <div className="space-y-3 max-w-xs mx-auto">
            <Link to="/inscription" state={{ from: '/messages' }} className="btn-primary w-full">Créer un compte</Link>
            <Link to="/connexion" state={{ from: '/messages' }} className="btn-secondary w-full">Se connecter</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white border-b border-stone-200 px-4 py-4">
        <h1 className="text-2xl font-bold text-stone-900">Messages</h1>
      </header>

      {loading ? (
        <SkeletonConversationList />
      ) : conversations.length === 0 ? (
        <div className="text-center py-12 px-4">
          <div className="bg-stone-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle size={40} className="text-stone-400" />
          </div>
          <h3 className="text-xl font-semibold text-stone-700 mb-2">
            Aucun message
          </h3>
          <p className="text-stone-500 mb-6">
            Quand vous contacterez un voisin, vos conversations apparaîtront ici.
          </p>
          <Link to="/" className="btn-primary">
            Voir les annonces
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-stone-100">
          {conversations.map((conv) => {
            const otherUser = conv.buyer_id === user.id ? conv.seller : conv.buyer;
            const lastMessageDate = conv.last_message
              ? new Date(conv.last_message.created_at).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'short',
                })
              : '';

            return (
              <Link
                key={conv.id}
                to={`/messages/${conv.id}`}
                className="flex items-center gap-4 px-4 py-4 hover:bg-stone-50 transition-colors"
              >
                {otherUser?.avatar_url ? (
                  <img
                    src={otherUser.avatar_url}
                    alt={otherUser.username || 'Utilisateur'}
                    className="w-14 h-14 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <User size={28} className="text-primary-600" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className={`text-lg truncate ${conv.unread_count ? 'font-bold text-stone-900' : 'font-medium text-stone-800'}`}>
                      {otherUser?.username || 'Voisin'}
                    </p>
                    <span className="text-sm text-stone-500 flex-shrink-0">{lastMessageDate}</span>
                  </div>
                  {conv.listing && (
                    <p className="text-sm text-primary-600 truncate mb-1">
                      {conv.listing.title}
                    </p>
                  )}
                  {conv.last_message && (
                    <p className={`text-stone-600 truncate ${conv.unread_count ? 'font-semibold' : ''}`}>
                      {conv.last_message.sender_id === user.id ? 'Vous: ' : ''}
                      {conv.last_message.content}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {(conv.unread_count ?? 0) > 0 && (
                    <span className="bg-primary-600 text-white text-sm font-bold w-6 h-6 rounded-full flex items-center justify-center">
                      {conv.unread_count}
                    </span>
                  )}
                  <ChevronRight size={20} className="text-stone-400" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

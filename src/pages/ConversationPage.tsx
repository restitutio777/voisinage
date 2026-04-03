import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Send, User, MapPin } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { usePageTitle } from '../lib/usePageTitle';
import { SkeletonConversation } from '../components/SkeletonDetail';
import type { ConversationWithDetails, Message } from '../lib/database.types';

export function ConversationPage() {
  usePageTitle('Conversation');
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [conversation, setConversation] = useState<ConversationWithDetails | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    if (id) {
      fetchConversation();
      fetchMessages();
      markAsRead();

      const subscription = supabase
        .channel(`messages:${id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `conversation_id=eq.${id}`,
          },
          (payload) => {
            const newMsg = payload.new as Message;
            setMessages((prev) => [...prev, newMsg]);
            if (newMsg.sender_id !== user.id) {
              markAsRead();
            }
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [id, user, navigate]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  async function fetchConversation() {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          listing:listings(*),
          buyer:profiles!conversations_buyer_id_fkey(*),
          seller:profiles!conversations_seller_id_fkey(*)
        `)
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setConversation(data as ConversationWithDetails);
      }
    } catch {
      showToast('Impossible de charger la conversation', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function fetchMessages() {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', id)
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (data) {
        setMessages(data);
      }
    } catch {
      showToast('Impossible de charger les messages', 'error');
    }
  }

  async function markAsRead() {
    if (!user || !id) return;

    await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('conversation_id', id)
      .neq('sender_id', user.id);
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!newMessage.trim() || !user || !id) return;

    setSending(true);
    const messageContent = newMessage.trim();
    setNewMessage('');

    try {
      const { error } = await supabase.from('messages').insert({
        conversation_id: id,
        sender_id: user.id,
        content: messageContent,
      });

      if (error) throw error;
    } catch {
      setNewMessage(messageContent);
      showToast('Impossible d\'envoyer le message', 'error');
    } finally {
      setSending(false);
    }
  }

  if (!user) return null;

  if (!user) {
    navigate('/connexion', { state: { from: `/messages/${id}` } });
    return null;
  }

  if (loading) {
    return <SkeletonConversation />;
  }

  if (!conversation) {
    return (
      <div className="px-4 py-12 text-center">
        <h2 className="text-xl font-semibold text-stone-700 mb-4">
          Conversation introuvable
        </h2>
        <Link to="/messages" className="btn-primary">
          Retour aux messages
        </Link>
      </div>
    );
  }

  const otherUser = conversation.buyer_id === user.id ? conversation.seller : conversation.buyer;

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <header className="sticky top-0 bg-white border-b border-stone-200 px-4 py-3 z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/messages')}
            className="text-stone-600 hover:text-stone-800"
          >
            <ArrowLeft size={24} />
          </button>

          <div className="flex items-center gap-3 flex-1 min-w-0">
            {otherUser?.avatar_url ? (
              <img
                src={otherUser.avatar_url}
                alt={otherUser.username || 'Utilisateur'}
                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                <User size={20} className="text-primary-600" />
              </div>
            )}
            <div className="min-w-0">
              <p className="font-semibold text-stone-900 truncate">
                {otherUser?.username || 'Voisin'}
              </p>
              {otherUser?.city && (
                <p className="text-sm text-stone-500 flex items-center gap-1">
                  <MapPin size={12} />
                  {otherUser.city}
                </p>
              )}
            </div>
          </div>
        </div>
      </header>

      {conversation.listing && (
        <Link
          to={`/annonce/${conversation.listing.id}`}
          className="bg-white border-b border-stone-200 px-4 py-3 flex items-center gap-3 hover:bg-stone-50"
        >
          {conversation.listing.image_url ? (
            <img
              src={conversation.listing.image_url}
              alt={conversation.listing.title}
              className="w-12 h-12 rounded-lg object-cover"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; e.currentTarget.parentElement!.insertAdjacentHTML('afterbegin', '<div class="w-12 h-12 rounded-lg bg-stone-100 flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-stone-400"><path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 17 3.5s0 0 0 0C17 3.5 22 9 22 13.5A7.5 7.5 0 0 1 11 20z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg></div>'); }}
            />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-stone-100" />
          )}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-stone-900 truncate">
              {conversation.listing.title}
            </p>
            <p className="text-sm text-primary-600">
              {conversation.listing.listing_type === 'donner'
                ? 'À donner'
                : conversation.listing.listing_type === 'echanger'
                ? 'À échanger'
                : conversation.listing.listing_type === 'preter'
                ? 'À prêter'
                : conversation.listing.listing_type === 'cherche'
                ? 'Recherche'
                : `${conversation.listing.price?.toFixed(2)} €`}
            </p>
          </div>
        </Link>
      )}

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="space-y-4">
          {messages.map((message) => {
            const isOwn = message.sender_id === user.id;
            const time = new Date(message.created_at).toLocaleTimeString('fr-FR', {
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={message.id}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                    isOwn
                      ? 'bg-primary-600 text-white rounded-br-md'
                      : 'bg-white text-stone-800 rounded-bl-md shadow-sm'
                  }`}
                >
                  <p className="text-base whitespace-pre-wrap">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      isOwn ? 'text-primary-200' : 'text-stone-400'
                    }`}
                  >
                    {time}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="sticky bottom-0 bg-white border-t border-stone-200 px-4 py-3 mb-22">
        <form onSubmit={handleSend} className="flex gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Votre message..."
            className="flex-1 px-4 py-3 text-lg border-2 border-stone-300 rounded-xl bg-white focus:outline-none focus:border-primary-500"
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="bg-primary-600 text-white px-5 rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={24} />
          </button>
        </form>
      </div>
    </div>
  );
}

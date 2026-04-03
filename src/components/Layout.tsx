import { ReactNode, useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MapPin, PlusCircle, MessageCircle, User, ArrowLeftRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { supabase } from '../lib/supabase';
import { playNotificationSound } from '../lib/notificationSound';

interface LayoutProps {
  children: ReactNode;
}

const navItems = [
  { path: '/', icon: MapPin, label: 'Découvrir' },
  { path: '/echanger', icon: ArrowLeftRight, label: 'Échanger' },
  { path: '/creer', icon: PlusCircle, label: 'Proposer' },
  { path: '/messages', icon: MessageCircle, label: 'Messages' },
  { path: '/profil', icon: User, label: 'Profil' },
];

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnread = useCallback(async () => {
    if (!user) return;

    const { data: conversations } = await supabase
      .from('conversations')
      .select('id')
      .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`);

    if (!conversations || conversations.length === 0) return;

    const ids = conversations.map(c => c.id);
    const { count } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .in('conversation_id', ids)
      .eq('is_read', false)
      .neq('sender_id', user.id);

    setUnreadCount(count || 0);
  }, [user]);

  useEffect(() => {
    if (!user) {
      setUnreadCount(0);
      return;
    }

    fetchUnread();

    const subscription = supabase
      .channel('unread-messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          fetchUnread();
          const msg = payload.new as { sender_id: string; conversation_id: string };
          if (msg.sender_id !== user.id) {
            const onConversation = location.pathname === `/messages/${msg.conversation_id}`;
            if (!onConversation) {
              playNotificationSound();
              showToast('Nouveau message recu', 'success');
            }
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'messages' },
        () => { fetchUnread(); }
      )
      .subscribe();

    return () => { subscription.unsubscribe(); };
  }, [user, fetchUnread, showToast, location.pathname]);

  return (
    <div className="min-h-screen bg-cream-50 lg:bg-transparent pb-22 relative z-10">
      <main className="max-w-2xl mx-auto lg:bg-cream-50 min-h-screen">
        {children}
      </main>

      <nav aria-label="Navigation principale" className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-stone-100 safe-area-bottom shadow-[0_-4px_20px_rgba(0,0,0,0.06)] lg:border-stone-300">
        <div className="max-w-2xl mx-auto flex justify-around px-2 py-1 lg:border-x lg:border-stone-200" role="menubar">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            const href = item.requiresAuth && !user ? '/connexion' : item.path;
            const showBadge = item.path === '/messages' && unreadCount > 0;

            if (item.path === '/creer') {
              return (
                <Link
                  key={item.path}
                  to={href}
                  role="menuitem"
                  aria-label={item.label}
                  className="flex flex-col items-center justify-center -mt-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded-full"
                >
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-sun to-sun-dark flex items-center justify-center shadow-lg shadow-sun/30 ring-4 ring-white">
                    <Icon size={26} strokeWidth={2.5} className="text-white" />
                  </div>
                  <span className="text-xs mt-1.5 font-medium text-stone-600">
                    {item.label}
                  </span>
                </Link>
              );
            }

            return (
              <Link
                key={item.path}
                to={href}
                role="menuitem"
                aria-label={showBadge ? `${item.label} (${unreadCount} non lus)` : item.label}
                aria-current={isActive ? 'page' : undefined}
                className={`flex flex-col items-center py-2.5 px-3 min-w-[64px] rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 ${
                  isActive
                    ? 'text-field'
                    : 'text-stone-600 hover:text-stone-800'
                }`}
              >
                <div className={`relative p-1.5 rounded-xl transition-colors ${isActive ? 'bg-field/10' : ''}`}>
                  <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                  {showBadge && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 animate-pulse">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </div>
                <span className={`text-xs mt-0.5 ${isActive ? 'font-semibold' : 'font-medium'}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

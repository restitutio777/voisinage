export type ListingType = 'donner' | 'echanger' | 'vendre' | 'preter' | 'cherche';
export type ListingStatus = 'active' | 'reserved' | 'completed' | 'expired';
export type ReportReason = 'professional' | 'quantity_suspicious' | 'inappropriate' | 'fake' | 'spam' | 'other';
export type ReportStatus = 'pending' | 'reviewed' | 'dismissed' | 'action_taken';
export type ExchangeMatchStatus = 'pending' | 'contacted' | 'completed' | 'declined';

export interface Category {
  id: string;
  name: string;
  icon: string;
  sort_order: number;
  created_at: string;
}

export interface QuantityThreshold {
  id: string;
  category_id: string;
  unit: string;
  warning_threshold: number;
  max_threshold: number;
  warning_message_fr: string;
  legal_info_fr: string | null;
  created_at: string;
}

export interface Profile {
  id: string;
  username: string | null;
  postal_code: string | null;
  city: string | null;
  avatar_url: string | null;
  phone: string | null;
  is_private_garden: boolean;
  is_verified: boolean;
  verified_at: string | null;
  bio: string | null;
  garden_photo_url: string | null;
  pickup_info: string | null;
  preferred_pickup_times: string[] | null;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  updated_at: string;
}

export interface Listing {
  id: string;
  user_id: string;
  category_id: string;
  title: string;
  description: string | null;
  quantity: string | null;
  listing_type: ListingType;
  price: number | null;
  image_url: string | null;
  postal_code: string;
  city: string | null;
  status: ListingStatus;
  expires_at: string | null;
  is_private_garden_confirmed: boolean;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  updated_at: string;
}

export interface ListingWithDistance extends Listing {
  distance_km: number | null;
}

export interface ListingWithDetails extends Listing {
  category: Category;
  profile: Profile;
}

export interface Report {
  id: string;
  listing_id: string;
  reporter_id: string;
  reason: ReportReason;
  details: string | null;
  status: ReportStatus;
  created_at: string;
  reviewed_at: string | null;
}

export interface ExchangeWish {
  id: string;
  user_id: string;
  offer_category_id: string;
  offer_description: string;
  seek_category_id: string;
  seek_description: string;
  postal_code: string;
  city: string | null;
  radius_km: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ExchangeWishWithDetails extends ExchangeWish {
  offer_category: Category;
  seek_category: Category;
  profile: Profile;
}

export interface ExchangeMatch {
  id: string;
  wish_a_id: string;
  wish_b_id: string;
  status: ExchangeMatchStatus;
  created_at: string;
  updated_at: string;
}

export interface ExchangeMatchWithDetails extends ExchangeMatch {
  wish_a: ExchangeWishWithDetails;
  wish_b: ExchangeWishWithDetails;
}

export interface PushSubscription {
  id: string;
  user_id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  created_at: string;
}

export interface NotificationPreferences {
  user_id: string;
  new_listings_nearby: boolean;
  new_messages: boolean;
  exchange_matches: boolean;
  radius_km: number;
  created_at: string;
  updated_at: string;
}

export interface AnalyticsEvent {
  id: string;
  event_type: string;
  event_data: Record<string, unknown>;
  postal_code_prefix: string | null;
  created_at: string;
}

export interface Conversation {
  id: string;
  listing_id: string | null;
  buyer_id: string;
  seller_id: string;
  last_message_at: string;
  created_at: string;
}

export interface ConversationWithDetails extends Conversation {
  listing: Listing | null;
  buyer: Profile;
  seller: Profile;
  last_message?: Message;
  unread_count?: number;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: Category;
        Insert: Omit<Category, 'id' | 'created_at'>;
        Update: Partial<Omit<Category, 'id' | 'created_at'>>;
      };
      quantity_thresholds: {
        Row: QuantityThreshold;
        Insert: Omit<QuantityThreshold, 'id' | 'created_at'>;
        Update: Partial<Omit<QuantityThreshold, 'id' | 'created_at'>>;
      };
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at'>>;
      };
      listings: {
        Row: Listing;
        Insert: Omit<Listing, 'id' | 'created_at' | 'updated_at' | 'status'>;
        Update: Partial<Omit<Listing, 'id' | 'user_id' | 'created_at'>>;
      };
      reports: {
        Row: Report;
        Insert: Omit<Report, 'id' | 'created_at' | 'status' | 'reviewed_at'>;
        Update: Partial<Pick<Report, 'status' | 'reviewed_at'>>;
      };
      exchange_wishes: {
        Row: ExchangeWish;
        Insert: Omit<ExchangeWish, 'id' | 'created_at' | 'updated_at' | 'is_active'>;
        Update: Partial<Omit<ExchangeWish, 'id' | 'user_id' | 'created_at'>>;
      };
      exchange_matches: {
        Row: ExchangeMatch;
        Insert: Omit<ExchangeMatch, 'id' | 'created_at' | 'updated_at' | 'status'>;
        Update: Partial<Pick<ExchangeMatch, 'status'>>;
      };
      push_subscriptions: {
        Row: PushSubscription;
        Insert: Omit<PushSubscription, 'id' | 'created_at'>;
        Update: never;
      };
      notification_preferences: {
        Row: NotificationPreferences;
        Insert: Omit<NotificationPreferences, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<NotificationPreferences, 'user_id' | 'created_at'>>;
      };
      analytics_events: {
        Row: AnalyticsEvent;
        Insert: Omit<AnalyticsEvent, 'id' | 'created_at'>;
        Update: never;
      };
      conversations: {
        Row: Conversation;
        Insert: Omit<Conversation, 'id' | 'created_at' | 'last_message_at'>;
        Update: Partial<Omit<Conversation, 'id' | 'created_at'>>;
      };
      messages: {
        Row: Message;
        Insert: Omit<Message, 'id' | 'created_at' | 'is_read'>;
        Update: Partial<Pick<Message, 'is_read'>>;
      };
    };
  };
}

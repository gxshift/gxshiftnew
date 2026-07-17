export interface Profile {
  id: string;
  role: 'admin' | 'user';
  full_name: string | null;
  created_at: string;
}

export interface Game {
  id: string;
  name: string;
  slug: string;
  cover_image: string | null;
  is_active: boolean;
  order_index: number;
  created_at: string;
}

export interface Level {
  id: string;
  game_id: string;
  name: string;
  sub_level: string | null;
  price: number;
  estimated_time: string;
  icon_url: string | null;
  is_active: boolean;
  order_index: number;
  created_at: string;
  games?: Game; // Relation
}

export interface Order {
  id: string;
  customer_name: string;
  whatsapp_number: string;
  game_id: string | null;
  level_id: string | null;
  server_id: string | null;
  nickname: string;
  current_rank: string;
  notes: string | null;
  total_price: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  created_at: string;
}

export interface SiteSetting {
  id: string;
  setting_key: string;
  setting_value: string;
  description: string | null;
  updated_at: string;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
}

export interface Testimonial {
  id: string;
  customer_name: string;
  game_purchased: string | null;
  rating: number;
  review: string;
  is_active: boolean;
  created_at: string;
}
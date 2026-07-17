export interface Game {
    id: string;
    name: string;
    slug: string;
    cover_image: string | null;
    is_active: boolean;
    order_index: number;
    created_at: string;
    updated_at: string;
  }
  
  export interface Rank {
    id: string;
    game_id: string;
    name: string;
    sub_level: string | null;
    price: number;
    estimated_time: string;
    icon_image: string | null;
    is_active: boolean;
    order_index: number;
    created_at: string;
    updated_at: string;
  }
  
  export interface Order {
    id: string;
    order_number: string;
    customer_name: string;
    whatsapp_number: string;
    game_id: string;
    game_name: string;
    server_info: string;
    nickname: string;
    current_rank: string;
    target_rank: string;
    notes: string | null;
    total_price: number;
    status: 'pending' | 'processing' | 'completed' | 'cancelled';
    created_at: string;
  }
  
  export interface Testimonial {
    id: string;
    customer_name: string;
    review_text: string;
    rating: number;
    avatar_image: string | null;
    is_active: boolean;
    created_at: string;
  }
  
  export interface FAQ {
    id: string;
    question: string;
    answer: string;
    is_active: boolean;
    order_index: number;
    created_at: string;
  }
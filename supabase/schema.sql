-- ==============================================================================
-- 1. DROP EXISTING SCHEMA SECARA TOTAL (RESET)
-- ==============================================================================
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres, anon, authenticated, service_role;

-- Pastikan ekstensi UUID aktif
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" SCHEMA public;

-- ==============================================================================
-- 2. CREATE TABLES
-- ==============================================================================

-- Tabel Users/Profiles (Extends Supabase Auth)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel Master Games
CREATE TABLE public.games (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    cover_image TEXT,
    is_active BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel Ranks / Levels
CREATE TABLE public.ranks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    game_id UUID REFERENCES public.games(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    sub_level TEXT,
    price NUMERIC NOT NULL,
    estimated_time TEXT NOT NULL,
    icon_image TEXT,
    is_active BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel Orders (Transaksi)
CREATE TABLE public.orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_number TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    whatsapp_number TEXT NOT NULL,
    game_id UUID REFERENCES public.games(id),
    game_name TEXT NOT NULL,
    server_info TEXT NOT NULL,
    nickname TEXT NOT NULL,
    current_rank TEXT NOT NULL,
    target_rank TEXT NOT NULL,
    notes TEXT,
    total_price NUMERIC NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel Pengaturan Global Website (Hero, WA, Statistik, dll)
CREATE TABLE public.settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    setting_key TEXT UNIQUE NOT NULL,
    setting_value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel Testimonial
CREATE TABLE public.testimonials (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    customer_name TEXT NOT NULL,
    review_text TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    avatar_image TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel FAQ
CREATE TABLE public.faqs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 3. CREATE FUNCTIONS & TRIGGERS
-- ==============================================================================

-- Fungsi update timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger untuk updated_at
CREATE TRIGGER update_profiles_modtime BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER update_games_modtime BEFORE UPDATE ON public.games FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER update_ranks_modtime BEFORE UPDATE ON public.ranks FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER update_settings_modtime BEFORE UPDATE ON public.settings FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Fungsi auto-create profile setelah user register di Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ranks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- Cek jika Admin
CREATE OR REPLACE FUNCTION public.is_admin() RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Policies: Public Read (Anon & Authenticated)
CREATE POLICY "Public can view active games" ON public.games FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view active ranks" ON public.ranks FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view settings" ON public.settings FOR SELECT USING (true);
CREATE POLICY "Public can view active testimonials" ON public.testimonials FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view active faqs" ON public.faqs FOR SELECT USING (is_active = true);
CREATE POLICY "Public can create orders" ON public.orders FOR INSERT WITH CHECK (true);

-- Policies: Admin Full Access
CREATE POLICY "Admin full access games" ON public.games FOR ALL USING (public.is_admin());
CREATE POLICY "Admin full access ranks" ON public.ranks FOR ALL USING (public.is_admin());
CREATE POLICY "Admin full access settings" ON public.settings FOR ALL USING (public.is_admin());
CREATE POLICY "Admin full access testimonials" ON public.testimonials FOR ALL USING (public.is_admin());
CREATE POLICY "Admin full access faqs" ON public.faqs FOR ALL USING (public.is_admin());
CREATE POLICY "Admin full access orders" ON public.orders FOR ALL USING (public.is_admin());
CREATE POLICY "Admin full access profiles" ON public.profiles FOR ALL USING (public.is_admin());

-- ==============================================================================
-- 5. STORAGE BUCKETS
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public) VALUES 
('game-cover', 'game-cover', true),
('rank-icon', 'rank-icon', true),
('hero-banner', 'hero-banner', true),
('background', 'background', true),
('logo', 'logo', true),
('testimonial', 'testimonial', true)
ON CONFLICT (id) DO NOTHING;

-- RLS Storage: Public Read, Admin All
CREATE POLICY "Public read storage" ON storage.objects FOR SELECT USING (bucket_id IN ('game-cover', 'rank-icon', 'hero-banner', 'background', 'logo', 'testimonial'));
CREATE POLICY "Admin manage storage" ON storage.objects FOR ALL USING (public.is_admin());

-- ==============================================================================
-- 6. INSERT SAMPLE DATA
-- ==============================================================================

-- Insert Settings
INSERT INTO public.settings (setting_key, setting_value) VALUES
('whatsapp_number', '"6281234567890"'),
('site_logo', '"/assets/logo.png"'),
('hero_banner', '{"title": "Rank Up", "subtitle": "Dominate. Be Legendary.", "image": "/assets/hero-bg.jpg"}'),
('statistics', '[{"label": "Active Users", "value": "15K+"}, {"label": "Orders Completed", "value": "50K+"}, {"label": "Pro Boosters", "value": "200+"}]')
ON CONFLICT (setting_key) DO UPDATE SET setting_value = EXCLUDED.setting_value;

-- Insert Game Mobile Legends
INSERT INTO public.games (id, name, slug, order_index) 
VALUES ('11111111-1111-1111-1111-111111111111', 'Mobile Legends', 'mobile-legends', 1);

-- Insert Ranks Mobile Legends
INSERT INTO public.ranks (game_id, name, sub_level, price, estimated_time, order_index) VALUES
('11111111-1111-1111-1111-111111111111', 'Epic', 'I - V', 50000, '1-2 Days', 1),
('11111111-1111-1111-1111-111111111111', 'Legend', 'I - V', 75000, '2-3 Days', 2),
('11111111-1111-1111-1111-111111111111', 'Mythic', 'Grading', 150000, '3-4 Days', 3),
('11111111-1111-1111-1111-111111111111', 'Mythical Glory', '50+ Stars', 300000, '5-7 Days', 4);
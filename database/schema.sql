
-- ==========================================
-- Instagram Database
-- Project: Instagram Supabase Backend
-- Database: PostgreSQL
-- ==========================================

-- 1. PROFILES TABLE
-- Stores basic information about users.

CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT UNIQUE NOT NULL,
    full_name TEXT,
    bio TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. POSTS TABLE
-- Stores posts created by users.

CREATE TABLE public.posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL
        REFERENCES public.profiles(id) ON DELETE CASCADE,
    caption TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. LIKES TABLE
-- Stores which users liked which posts.
-- A user can like a particular post only once.

CREATE TABLE public.likes (
    user_id UUID NOT NULL
        REFERENCES public.profiles(id) ON DELETE CASCADE,
    post_id UUID NOT NULL
        REFERENCES public.posts(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, post_id)
);

-- 4. COMMENTS TABLE
-- Stores comments on posts.

CREATE TABLE public.comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL
        REFERENCES public.profiles(id) ON DELETE CASCADE,
    post_id UUID NOT NULL
        REFERENCES public.posts(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. ENABLE ROW LEVEL SECURITY
-- Access policies must be configured separately.

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

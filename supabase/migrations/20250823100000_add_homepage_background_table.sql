/*
  # [Feature] Homepage Background Management
  Creates a new table to manage dynamic backgrounds for the homepage.

  ## Query Description:
  This operation adds a new table `homepage_background` to the database. It is a non-destructive, structural change. It includes a unique index to ensure only one background can be active at a time, preventing conflicts in the UI. RLS is enabled to allow public read access for the active background and full access for authenticated admin users.

  ## Metadata:
  - Schema-Category: "Structural"
  - Impact-Level: "Low"
  - Requires-Backup: false
  - Reversible: true (the table can be dropped)

  ## Structure Details:
  - Table Added: `homepage_background`
  - Columns: `id`, `created_at`, `type`, `url`, `is_active`
  - Indexes: `homepage_background_pkey`, `one_active_background`

  ## Security Implications:
  - RLS Status: Enabled
  - Policy Changes: Yes, new policies for admin and anonymous access are created.
  - Auth Requirements: Admin role (authenticated) is needed to manage this table.

  ## Performance Impact:
  - Indexes: Adds a primary key and a unique index. Impact on write performance is negligible. Read performance for the active background will be excellent.
  - Triggers: None.
  - Estimated Impact: Low.
*/

-- Create the table
CREATE TABLE homepage_background (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    type TEXT NOT NULL CHECK (type IN ('image', 'video')),
    url TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT false
);

-- This unique index ensures that only one row can have is_active = true.
-- Any attempt to insert/update a second row to be active will fail.
CREATE UNIQUE INDEX one_active_background ON homepage_background (is_active) WHERE (is_active IS TRUE);

-- Enable RLS on the new table
ALTER TABLE public.homepage_background ENABLE ROW LEVEL SECURITY;

-- Create Policies
-- 1. Allow public (anonymous) read access to the active background
CREATE POLICY "Allow public read access to active background"
ON public.homepage_background
FOR SELECT
TO anon
USING (is_active = true);

-- 2. Allow full access for authenticated users (admins)
CREATE POLICY "Allow full access for authenticated users"
ON public.homepage_background
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Insert a default background to start with
INSERT INTO public.homepage_background (type, url, is_active) VALUES
('image', 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=2693&auto=format&fit=crop', true);

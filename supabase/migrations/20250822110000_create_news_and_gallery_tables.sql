/*
# [Structural] Create News and Gallery Tables
This migration script creates two new tables: `public.news` and `public.gallery`. These tables are essential for the News and Gallery sections of the application, both on the public-facing site and in the admin panel.

## Query Description:
- **`CREATE TABLE public.news`**: This command defines the structure for storing news articles, including columns for title, content, author, category, and publication status. It sets up a primary key and default values.
- **`CREATE TABLE public.gallery`**: This command defines the structure for storing gallery images, with columns for title, description, category, image URL, and photographer.
- **Row Level Security (RLS)**: RLS is enabled on both tables to control data access. Public users can only read published news and all gallery items, while authenticated admin users have full management rights (create, read, update, delete).

This operation is safe and does not affect any existing data as it only creates new tables.

## Metadata:
- Schema-Category: "Structural"
- Impact-Level: "Low"
- Requires-Backup: false
- Reversible: true (Can be reversed by dropping the tables)

## Structure Details:
- **Tables Created**: `public.news`, `public.gallery`
- **Columns Added**:
  - `news`: id, created_at, title, excerpt, content, author, category, image_url, is_featured, status, views
  - `gallery`: id, created_at, title, description, category, image_url, photographer, views

## Security Implications:
- RLS Status: Enabled on both tables.
- Policy Changes: Yes, new policies are created for both tables to ensure proper data access control.
  - Public users can view published news and all gallery items.
  - Authenticated users can manage all news and gallery items.
- Auth Requirements: `authenticated` role required for management.

## Performance Impact:
- Indexes: Primary key indexes are automatically created for the `id` columns.
- Triggers: None.
- Estimated Impact: Low. The creation of new tables will not impact the performance of existing queries.
*/

-- Create the news table
CREATE TABLE public.news (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    title text NOT NULL,
    excerpt text,
    content text NOT NULL,
    author text DEFAULT 'Admin'::text,
    category text NOT NULL,
    image_url text,
    is_featured boolean DEFAULT false NOT NULL,
    status text DEFAULT 'draft'::text NOT NULL CHECK (status IN ('published', 'draft')),
    views integer DEFAULT 0 NOT NULL
);

COMMENT ON TABLE public.news IS 'Stores news articles and announcements for the website.';

-- Create the gallery table
CREATE TABLE public.gallery (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    title text NOT NULL,
    description text,
    category text NOT NULL,
    image_url text NOT NULL,
    photographer text,
    views integer DEFAULT 0 NOT NULL
);

COMMENT ON TABLE public.gallery IS 'Stores photos for the website gallery.';

-- Enable Row Level Security for both tables
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

-- RLS Policies for News Table
CREATE POLICY "Allow public read access for published articles" ON public.news
FOR SELECT USING (status = 'published');

CREATE POLICY "Allow admin users to manage all news articles" ON public.news
FOR ALL USING (auth.role() = 'authenticated');

-- RLS Policies for Gallery Table
CREATE POLICY "Allow public read access for all gallery items" ON public.gallery
FOR SELECT USING (true);

CREATE POLICY "Allow admin users to manage all gallery items" ON public.gallery
FOR ALL USING (auth.role() = 'authenticated');

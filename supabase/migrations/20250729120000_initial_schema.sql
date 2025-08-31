/*
  # Initial Schema for SSF Muhimmath Daawa Sector Website

  This script sets up the complete database structure for the website, including tables for results, news, gallery, contacts, about page content, and team members. It also enables Row Level Security (RLS) on all tables and creates policies for data access.

  ## Security and Data Integrity
  - **RLS Enabled**: All tables have Row Level Security enabled by default to ensure data is protected.
  - **Public Access**: Policies are in place to allow public read-only access to non-sensitive data like results, news, gallery, and about content.
  - **Authenticated Access**: Admin users (with the 'authenticated' role) have full CRUD (Create, Read, Update, Delete) permissions on all tables.
  - **Contact Form**: The contact form allows public insertion but restricts read access to admins only, protecting user privacy.
  - **Backups Recommended**: Before applying any schema changes to a production database, always ensure you have a recent backup.
*/

-- ----------------------------
-- Create Results Table
-- ----------------------------
/*
  # Table: results
  Stores competition results.

  ## Query Description:
  This operation creates the `results` table. It is a non-destructive, structural change. Existing data will not be affected as this is a new table.

  ## Metadata:
  - Schema-Category: "Structural"
  - Impact-Level: "Low"
  - Requires-Backup: false
  - Reversible: true (Can be dropped)

  ## Structure Details:
  - Columns: id, created_at, category, event, participant, school, position, points, year
  - Indexes: Primary key on id.

  ## Security Implications:
  - RLS Status: Enabled
  - Policy Changes: Yes (SELECT for public, ALL for admin)
  - Auth Requirements: Admin for write access.
*/
CREATE TABLE public.results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    category TEXT NOT NULL,
    event TEXT NOT NULL,
    participant TEXT NOT NULL,
    school TEXT NOT NULL,
    position INT NOT NULL,
    points INT NOT NULL,
    year TEXT NOT NULL
);

ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to results" ON public.results
FOR SELECT USING (true);

CREATE POLICY "Allow admin full access to results" ON public.results
FOR ALL USING (auth.role() = 'authenticated');


-- ----------------------------
-- Create News Table
-- ----------------------------
/*
  # Table: news
  Stores news articles and announcements.

  ## Query Description:
  This operation creates the `news` table. It is a non-destructive, structural change.

  ## Metadata:
  - Schema-Category: "Structural"
  - Impact-Level: "Low"
  - Requires-Backup: false
  - Reversible: true

  ## Structure Details:
  - Columns: id, created_at, title, excerpt, content, author, date, category, image, featured, status
  - Indexes: Primary key on id.

  ## Security Implications:
  - RLS Status: Enabled
  - Policy Changes: Yes (SELECT for public where status is 'published', ALL for admin)
  - Auth Requirements: Admin for write access.
*/
CREATE TABLE public.news (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    title TEXT NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    author TEXT,
    date DATE NOT NULL,
    category TEXT,
    image TEXT,
    featured BOOLEAN DEFAULT false,
    status TEXT NOT NULL DEFAULT 'draft' -- 'draft' or 'published'
);

ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to published news" ON public.news
FOR SELECT USING (status = 'published');

CREATE POLICY "Allow admin full access to news" ON public.news
FOR ALL USING (auth.role() = 'authenticated');


-- ----------------------------
-- Create Gallery Table
-- ----------------------------
/*
  # Table: gallery
  Stores information about photos in the gallery.

  ## Query Description:
  This operation creates the `gallery` table. It is a non-destructive, structural change.

  ## Metadata:
  - Schema-Category: "Structural"
  - Impact-Level: "Low"
  - Requires-Backup: false
  - Reversible: true

  ## Structure Details:
  - Columns: id, created_at, title, category, date, image, photographer, description
  - Indexes: Primary key on id.

  ## Security Implications:
  - RLS Status: Enabled
  - Policy Changes: Yes (SELECT for public, ALL for admin)
  - Auth Requirements: Admin for write access.
*/
CREATE TABLE public.gallery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    title TEXT NOT NULL,
    category TEXT,
    date DATE,
    image TEXT NOT NULL,
    photographer TEXT,
    description TEXT
);

ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to gallery" ON public.gallery
FOR SELECT USING (true);

CREATE POLICY "Allow admin full access to gallery" ON public.gallery
FOR ALL USING (auth.role() = 'authenticated');


-- ----------------------------
-- Create Contacts Table
-- ----------------------------
/*
  # Table: contacts
  Stores messages submitted through the contact form.

  ## Query Description:
  This operation creates the `contacts` table. This table contains potentially sensitive user information.

  ## Metadata:
  - Schema-Category: "Data"
  - Impact-Level: "Medium"
  - Requires-Backup: false
  - Reversible: true

  ## Structure Details:
  - Columns: id, created_at, name, email, phone, subject, message, status
  - Indexes: Primary key on id.

  ## Security Implications:
  - RLS Status: Enabled
  - Policy Changes: Yes (INSERT for public, ALL for admin). Public read is disabled.
  - Auth Requirements: Admin for read/update/delete access.
*/
CREATE TABLE public.contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'unread' -- 'unread', 'read', 'replied'
);

ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public to send messages" ON public.contacts
FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow admin full access to contacts" ON public.contacts
FOR ALL USING (auth.role() = 'authenticated');


-- ----------------------------
-- Create About Content Table
-- ----------------------------
/*
  # Table: about_content
  Stores key-value pairs for the About Us page content.

  ## Query Description:
  This operation creates the `about_content` table to store editable text sections like mission and vision.

  ## Metadata:
  - Schema-Category: "Structural"
  - Impact-Level: "Low"
  - Requires-Backup: false
  - Reversible: true

  ## Structure Details:
  - Columns: key, value
  - Indexes: Primary key on key.

  ## Security Implications:
  - RLS Status: Enabled
  - Policy Changes: Yes (SELECT for public, ALL for admin)
  - Auth Requirements: Admin for write access.
*/
CREATE TABLE public.about_content (
    key TEXT PRIMARY KEY,
    value TEXT
);

ALTER TABLE public.about_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to about content" ON public.about_content
FOR SELECT USING (true);

CREATE POLICY "Allow admin full access to about content" ON public.about_content
FOR ALL USING (auth.role() = 'authenticated');

-- Insert initial about content
INSERT INTO public.about_content (key, value) VALUES
('mission', 'To foster and promote the cultural and educational development of our community by providing a platform for students and enthusiasts to showcase their talents, exchange ideas, and celebrate our shared heritage. We aim to inspire creativity, preserve cultural values, and build bridges between different communities through the power of positive action.'),
('vision', 'To establish Muhimmath as a premier center for cultural and educational excellence in the region, creating a lasting impact on society. We envision a future where every young mind is inspired to learn, where cultural diversity is celebrated, and where the tradition of community service continues to thrive across generations.'),
('history', 'Muhimmath began in 2010 as a small gathering of enthusiasts in Badiadka, with the simple goal of encouraging young minds to explore and express themselves through various forms of cultural and educational arts. What started as a one-day event with just 50 participants has now evolved into a week-long celebration that attracts over 500 participants from across the district.');


-- ----------------------------
-- Create Team Members Table
-- ----------------------------
/*
  # Table: team_members
  Stores information about team members.

  ## Query Description:
  This operation creates the `team_members` table.

  ## Metadata:
  - Schema-Category: "Structural"
  - Impact-Level: "Low"
  - Requires-Backup: false
  - Reversible: true

  ## Structure Details:
  - Columns: id, created_at, name, position, bio, image
  - Indexes: Primary key on id.

  ## Security Implications:
  - RLS Status: Enabled
  - Policy Changes: Yes (SELECT for public, ALL for admin)
  - Auth Requirements: Admin for write access.
*/
CREATE TABLE public.team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    name TEXT NOT NULL,
    position TEXT,
    bio TEXT,
    image TEXT
);

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to team members" ON public.team_members
FOR SELECT USING (true);

CREATE POLICY "Allow admin full access to team members" ON public.team_members
FOR ALL USING (auth.role() = 'authenticated');

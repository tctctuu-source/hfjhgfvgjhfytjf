/*
# [Schema Correction] Fix `about_content` Table Structure
This migration corrects the schema for the `about_content` table, which was causing application errors.

## Query Description:
- **DROP TABLE `about_content`**: This operation will permanently delete the existing `about_content` table and all data within it. This is necessary to fix the structural error.
- **CREATE TABLE `about_content`**: This re-creates the table with the correct columns (`section`, `content`) that the application expects.
- **INSERT**: This adds the default placeholder content for the Mission, Vision, and History sections.

## Metadata:
- Schema-Category: "Dangerous"
- Impact-Level: "High"
- Requires-Backup: true
- Reversible: false

## Structure Details:
- **Table Dropped**: `public.about_content`
- **Table Created**: `public.about_content` with columns `id`, `section`, `content`, `updated_at`.

## Security Implications:
- RLS Status: Disabled (by default on new tables)
- Policy Changes: No
- Auth Requirements: None

## Performance Impact:
- Indexes: A `UNIQUE` index is added to the `section` column.
- Triggers: A trigger is added to automatically update the `updated_at` timestamp on changes.
- Estimated Impact: Low, as the table is expected to have very few rows.
*/

-- Step 1: Drop the old, incorrect table.
-- WARNING: This will delete any data you might have entered in the "About Us" admin section.
DROP TABLE IF EXISTS public.about_content;

-- Step 2: Create the new, correct table.
CREATE TABLE public.about_content (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    section TEXT UNIQUE NOT NULL,
    content TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 3: Insert the default sections so the page can be edited.
INSERT INTO public.about_content (section, content)
VALUES
    ('mission', 'This is the default mission statement. Please edit this in the admin panel.'),
    ('vision', 'This is the default vision statement. Please edit this in the admin panel.'),
    ('history', 'This is the default history content. Please edit this in the admin panel.');

-- Step 4: Add a trigger to automatically update the `updated_at` timestamp.
CREATE OR REPLACE FUNCTION public.handle_about_content_update()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_about_content_update
BEFORE UPDATE ON public.about_content
FOR EACH ROW
EXECUTE PROCEDURE public.handle_about_content_update();

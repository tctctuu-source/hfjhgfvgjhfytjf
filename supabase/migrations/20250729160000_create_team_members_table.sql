/*
# Create Team Members Table
This migration creates the `team_members` table to store information about the organization's team members.

## Query Description:
This is a non-destructive operation that adds a new table to the database. It does not affect any existing data. It is safe to run on a production database.

## Metadata:
- Schema-Category: "Structural"
- Impact-Level: "Low"
- Requires-Backup: false
- Reversible: true (can be dropped)

## Structure Details:
- Table: `public.team_members`
- Columns: `id`, `created_at`, `name`, `position`, `bio`, `image_url`

## Security Implications:
- RLS Status: Enabled
- Policy Changes: Yes
- Auth Requirements: Public read access, authenticated write access.

## Performance Impact:
- Indexes: Primary key index on `id`.
- Triggers: None.
- Estimated Impact: Low.
*/

-- Create the team_members table
CREATE TABLE public.team_members (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    name text NOT NULL,
    position text NOT NULL,
    bio text NOT NULL,
    image_url text NOT NULL,
    CONSTRAINT team_members_pkey PRIMARY KEY (id)
);

-- Add comments to the table and columns
COMMENT ON TABLE public.team_members IS 'Stores information about team members for the About Us page.';
COMMENT ON COLUMN public.team_members.name IS 'Name of the team member.';
COMMENT ON COLUMN public.team_members.position IS 'Position or role of the team member.';
COMMENT ON COLUMN public.team_members.bio IS 'A short biography of the team member.';
COMMENT ON COLUMN public.team_members.image_url IS 'URL for the team member''s profile picture.';


-- Enable Row Level Security
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Create policies for team_members table
CREATE POLICY "Allow public read access to team members"
ON public.team_members
FOR SELECT
USING (true);

CREATE POLICY "Allow authenticated users to insert team members"
ON public.team_members
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update team members"
ON public.team_members
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete team members"
ON public.team_members
FOR DELETE
TO authenticated
USING (true);

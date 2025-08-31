/*
# Create Results Table
This migration creates the `results` table to store competition results.

## Query Description: 
This operation creates a new table named `results`. It is a structural change and does not affect any existing data as the table is new. This is a safe operation.

## Metadata:
- Schema-Category: "Structural"
- Impact-Level: "Low"
- Requires-Backup: false
- Reversible: true (the table can be dropped)

## Structure Details:
- Table: `results`
- Columns:
  - `id`: uuid, primary key, default gen_random_uuid()
  - `created_at`: timestamp with time zone, default now()
  - `category`: text, not null
  - `event`: text, not null
  - `participant`: text, not null
  - `school`: text, nullable
  - `position`: integer, not null
  - `points`: integer, not null
  - `year`: text, not null

## Security Implications:
- RLS Status: Enabled
- Policy Changes: Yes. New policies are added for the `results` table.
  - Public read access is enabled.
  - Insert, update, delete operations are restricted to authenticated users.
- Auth Requirements: Read is public, Write requires authentication.

## Performance Impact:
- Indexes: A primary key index is added on the `id` column.
- Triggers: None.
- Estimated Impact: Low. This is a new table.
*/

-- Create the results table
CREATE TABLE public.results (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    category text NOT NULL,
    event text NOT NULL,
    participant text NOT NULL,
    school text, -- School/team name is optional
    position integer NOT NULL,
    points integer NOT NULL,
    year text NOT NULL,
    CONSTRAINT results_pkey PRIMARY KEY (id)
);

-- Enable Row Level Security
ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;

-- Add policies for the results table
-- 1. Allow public read access
CREATE POLICY "Allow public read access to results"
ON public.results
FOR SELECT
USING (true);

-- 2. Allow authenticated users to insert
CREATE POLICY "Allow insert for authenticated users"
ON public.results
FOR INSERT
TO authenticated
WITH CHECK (true);

-- 3. Allow authenticated users to update
CREATE POLICY "Allow update for authenticated users"
ON public.results
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- 4. Allow authenticated users to delete
CREATE POLICY "Allow delete for authenticated users"
ON public.results
FOR DELETE
TO authenticated
USING (true);

-- Add comments to columns
COMMENT ON TABLE public.results IS 'Stores competition results for various events.';
COMMENT ON COLUMN public.results.id IS 'Unique identifier for each result entry.';
COMMENT ON COLUMN public.results.created_at IS 'Timestamp when the result was added.';
COMMENT ON COLUMN public.results.category IS 'Category of the competition (e.g., General, High Zone).';
COMMENT ON COLUMN public.results.event IS 'Name of the competition event (e.g., Poetry, Debate).';
COMMENT ON COLUMN public.results.participant IS 'Name of the participant.';
COMMENT ON COLUMN public.results.school IS 'Name of the participant''s school or team (optional).';
COMMENT ON COLUMN public.results.position IS 'The rank achieved by the participant (1st, 2nd, etc.).';
COMMENT ON COLUMN public.results.points IS 'Points awarded for the position.';
COMMENT ON COLUMN public.results.year IS 'The year the competition was held.';

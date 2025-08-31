/*
  # [Operation] Create `results` Table
  This migration creates the `results` table to store competition outcomes.

  ## Query Description:
  - This script creates a new table named `results`.
  - It will not affect any existing data as the table is new.
  - Row Level Security (RLLS) is enabled with policies allowing public read access and full access for authenticated users.

  ## Metadata:
  - Schema-Category: "Structural"
  - Impact-Level: "Low"
  - Requires-Backup: false
  - Reversible: true (can be dropped)

  ## Structure Details:
  - Table: `public.results`
  - Columns: `id`, `created_at`, `category`, `event`, `participant`, `school`, `position`, `points`, `year`

  ## Security Implications:
  - RLS Status: Enabled
  - Policy Changes: Yes (new policies for `results` table)
  - Auth Requirements: Authenticated users for write operations.
*/

-- Create the results table
CREATE TABLE public.results (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    category text NOT NULL,
    event text NOT NULL,
    participant text NOT NULL,
    school text NOT NULL,
    position integer NOT NULL,
    points integer NOT NULL,
    year text NOT NULL,
    CONSTRAINT results_pkey PRIMARY KEY (id)
);

-- Add comments to the table and columns
COMMENT ON TABLE public.results IS 'Stores competition results, including participant details, event, and placement.';
COMMENT ON COLUMN public.results.category IS 'Category of the competition (e.g., General, High Zone).';
COMMENT ON COLUMN public.results.event IS 'Name of the competition or event.';
COMMENT ON COLUMN public.results.participant IS 'Name of the participant or team.';
COMMENT ON COLUMN public.results.school IS 'Name of the school or institution the participant represents.';
COMMENT ON COLUMN public.results.position IS 'The final position or rank of the participant (e.g., 1, 2, 3).';
COMMENT ON COLUMN public.results.points IS 'Points awarded for the position.';
COMMENT ON COLUMN public.results.year IS 'The year the competition took place.';

-- Enable Row Level Security
ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Allow public read access" ON public.results
FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to manage results" ON public.results
FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

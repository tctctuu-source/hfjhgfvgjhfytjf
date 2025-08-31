/*
          # [Operation Name]
          Update results table and create teams table

          ## Query Description: [This migration performs two main actions:
1. It removes the 'points' column from the 'results' table, simplifying the data structure for individual winners.
2. It creates a new 'teams' table to manage team names and their total scores independently. This change supports a new team-based leaderboard feature.]
          
          ## Metadata:
          - Schema-Category: "Structural"
          - Impact-Level: "Medium"
          - Requires-Backup: true
          - Reversible: false
          
          ## Structure Details:
          - Modifying table: 'results' (dropping 'points' column)
          - Creating table: 'teams' (with columns: id, created_at, name, points)
          
          ## Security Implications:
          - RLS Status: Enabled
          - Policy Changes: Yes (New policies for 'teams' table)
          - Auth Requirements: Authenticated users for write operations on 'teams'.
          
          ## Performance Impact:
          - Indexes: None
          - Triggers: None
          - Estimated Impact: Low. The operation should be fast on tables of small to medium size.
          */

-- Step 1: Remove the points column from the results table
ALTER TABLE public.results
DROP COLUMN IF EXISTS points;

-- Step 2: Create the new teams table
CREATE TABLE IF NOT EXISTS public.teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    name TEXT NOT NULL UNIQUE,
    points INT NOT NULL DEFAULT 0
);

-- Step 3: Add comments to the new table and columns for clarity
COMMENT ON TABLE public.teams IS 'Stores team names and their total accumulated points for competitions.';
COMMENT ON COLUMN public.teams.name IS 'The unique name of the team or school.';
COMMENT ON COLUMN public.teams.points IS 'The total points awarded to the team.';

-- Step 4: Enable Row Level Security on the new table
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

-- Step 5: Create policies for the teams table
-- Allow public read access to everyone
CREATE POLICY "Allow public read access to teams"
ON public.teams
FOR SELECT
USING (true);

-- Allow authenticated users (admins) to insert new teams
CREATE POLICY "Allow insert for authenticated users on teams"
ON public.teams
FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users (admins) to update teams
CREATE POLICY "Allow update for authenticated users on teams"
ON public.teams
FOR UPDATE
USING (auth.role() = 'authenticated');

-- Allow authenticated users (admins) to delete teams
CREATE POLICY "Allow delete for authenticated users on teams"
ON public.teams
FOR DELETE
USING (auth.role() = 'authenticated');

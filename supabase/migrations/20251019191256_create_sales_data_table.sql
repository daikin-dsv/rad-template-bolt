/*
  # Create sales data table

  1. New Tables
    - `sales_data`
      - `id` (uuid, primary key) - Unique identifier for each record
      - `sales_channel` (text) - Sales channel (e.g., RZA10GC2Y1, RZA10BC2Y1)
      - `category` (text) - Category (Total, Project, Route)
      - `fiscal_year` (integer) - Fiscal year
      - `q4` (integer) - Quarter 4 value
      - `q5` (integer) - Quarter 5 value
      - `q6` (integer) - Quarter 6 value
      - `q7` (integer) - Quarter 7 value
      - `q8` (integer) - Quarter 8 value
      - `q9` (integer) - Quarter 9 value
      - `q10` (integer) - Quarter 10 value
      - `q11` (integer) - Quarter 11 value
      - `q12` (integer) - Quarter 12 value
      - `q1` (integer) - Quarter 1 value
      - `q2` (integer) - Quarter 2 value
      - `q3` (integer) - Quarter 3 value
      - `q4_percent` (numeric) - Quarter 4 percentage
      - `q5_percent` (numeric) - Quarter 5 percentage
      - `q6_percent` (numeric) - Quarter 6 percentage
      - `q7_percent` (numeric) - Quarter 7 percentage
      - `q8_percent` (numeric) - Quarter 8 percentage
      - `q9_percent` (numeric) - Quarter 9 percentage
      - `q10_percent` (numeric) - Quarter 10 percentage
      - `q11_percent` (numeric) - Quarter 11 percentage
      - `q12_percent` (numeric) - Quarter 12 percentage
      - `q1_percent` (numeric) - Quarter 1 percentage
      - `q2_percent` (numeric) - Quarter 2 percentage
      - `q3_percent` (numeric) - Quarter 3 percentage
      - `created_at` (timestamptz) - Record creation timestamp
  
  2. Security
    - Enable RLS on `sales_data` table
    - Add policy for all users to read sales data (public read access)
*/

CREATE TABLE IF NOT EXISTS sales_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sales_channel text NOT NULL,
  category text NOT NULL,
  fiscal_year integer NOT NULL,
  q4 integer DEFAULT 0,
  q5 integer DEFAULT 0,
  q6 integer DEFAULT 0,
  q7 integer DEFAULT 0,
  q8 integer DEFAULT 0,
  q9 integer DEFAULT 0,
  q10 integer DEFAULT 0,
  q11 integer DEFAULT 0,
  q12 integer DEFAULT 0,
  q1 integer DEFAULT 0,
  q2 integer DEFAULT 0,
  q3 integer DEFAULT 0,
  q4_percent numeric(5,2),
  q5_percent numeric(5,2),
  q6_percent numeric(5,2),
  q7_percent numeric(5,2),
  q8_percent numeric(5,2),
  q9_percent numeric(5,2),
  q10_percent numeric(5,2),
  q11_percent numeric(5,2),
  q12_percent numeric(5,2),
  q1_percent numeric(5,2),
  q2_percent numeric(5,2),
  q3_percent numeric(5,2),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE sales_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for sales data"
  ON sales_data FOR SELECT
  TO anon, authenticated
  USING (true);

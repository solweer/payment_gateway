// lib/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tqehpnciecocuzuflhhp.supabase.co'; // Found in Supabase dashboard
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxZWhwbmNpZWNvY3V6dWZsaGhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg4NjQ2MjEsImV4cCI6MjA1NDQ0MDYyMX0.hHzpnmlMRrzvykwPfY5N7_JeO4HBMeVwpL1mxzkZszA'; // Found in Supabase dashboard

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;

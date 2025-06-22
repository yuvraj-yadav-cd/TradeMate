// lib/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rnghgbqluskgvissylao.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJuZ2hnYnFsdXNrZ3Zpc3N5bGFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0NTEyOTAsImV4cCI6MjA2NjAyNzI5MH0.DcrXunGLLkPHDi18aLkG76ZanFxph6yoJNWj0InTGso';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
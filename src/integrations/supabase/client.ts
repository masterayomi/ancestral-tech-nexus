import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://arcyccadasiehyselnow.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFyY3ljY2FkYXNpZWh5c2Vsbm93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3NTAyNTYsImV4cCI6MjA5ODMyNjI1Nn0.7OkT1FtmmD6NSvMZC6O1zZVYinxIsdJGEpPAIJ0pgBo'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://smnfhzbyrktmjgylguln.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtbmZoemJ5cmt0bWpneWxndWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwMjQzODcsImV4cCI6MjA5MjYwMDM4N30.iI-fsYze32FkHcXxjMNbC2WDqbHFVdt9y_gcl0Mf5pU'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

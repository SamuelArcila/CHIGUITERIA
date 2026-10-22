// Elige de dónde vienen los datos: Supabase si hay variables en .env, o datos de prueba si no.
import { supabase } from '../lib/supabase.js'
import * as simulado from './mock/auth.js'
import * as real from './supabase/auth.js'

export const { iniciarSesion, cerrarSesion, restaurarSesion } = supabase ? real : simulado

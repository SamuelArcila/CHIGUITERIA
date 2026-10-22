// Elige de dónde vienen los datos: Supabase si hay variables en .env, o datos de prueba si no.
import { supabase } from '../lib/supabase.js'
import * as simulado from './mock/equipo.js'
import * as real from './supabase/equipo.js'

export const { listarEquipo, crearCuenta, suscribir } = supabase ? real : simulado

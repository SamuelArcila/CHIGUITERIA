// Elige de dónde vienen los datos: Supabase si hay variables en .env, o datos de prueba si no.
import { supabase } from '../lib/supabase.js'
import * as simulado from './mock/inventario.js'
import * as real from './supabase/inventario.js'

export const { listarInventario, registrarEntrada, suscribir } = supabase ? real : simulado

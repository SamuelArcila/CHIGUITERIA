// Elige de dónde vienen los datos: Supabase si hay variables en .env, o datos de prueba si no.
import { supabase } from '../lib/supabase.js'
import * as simulado from './mock/menu.js'
import * as real from './supabase/menu.js'

export const { obtenerCategorias, obtenerProductos, obtenerAdicionesDe } = supabase ? real : simulado

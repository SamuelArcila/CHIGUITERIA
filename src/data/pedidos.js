// Elige de dónde vienen los datos: Supabase si hay variables en .env, o datos de prueba si no.
import { supabase } from '../lib/supabase.js'
import * as simulado from './mock/pedidos.js'
import * as real from './supabase/pedidos.js'

export const { crearPedido, listarPedidos, cambiarEstado, suscribir } = supabase ? real : simulado

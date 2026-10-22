const formatoPesos = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })
export const pesos = (valor) => formatoPesos.format(valor)

const formatoNumero = new Intl.NumberFormat('es-CO', { maximumFractionDigits: 2 })
export const cantidad = (valor) => formatoNumero.format(valor)

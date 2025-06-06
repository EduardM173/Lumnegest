import 'dotenv/config'
import listEndpoints from 'express-list-endpoints'
import app from './app'

/**
 * Render (y otras plataformas PaaS) inyectan la variable PORT en el entorno.
 * Si no existe, caerá a 3001 (útil para desarrollo local).
 */
const PORT = parseInt(process.env.PORT ?? '3001', 10)

console.log('🔍 RUTAS ACTIVAS:')
console.table(listEndpoints(app))

/**
 * Al omitir el segundo parámetro (host), Express se enlaza por defecto a 0.0.0.0,
 * que es lo que Render necesita para exponer el puerto públicamente.
 */
app.listen(PORT, () => {
  console.log(`🚀 Backend escuchando en el puerto ${PORT}`)
})

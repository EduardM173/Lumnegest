import 'dotenv/config'
import listEndpoints from 'express-list-endpoints'
import app from './app'

const PORT = process.env.PORT ?? 3001

// Imprime rutas montadas
console.log('🔍 RUTAS ACTIVAS:')
console.table(listEndpoints(app))

// Arranca
app.listen(PORT, () => 
  console.log(`🚀 Backend escuchando en http://localhost:${PORT}`)
)

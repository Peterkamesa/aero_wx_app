const { PrismaClient } = require('@prisma/client')
const Database = require('better-sqlite3')
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3')

try {
  const sqlite = new Database('./prisma/dev.db')
  const adapter = new PrismaBetterSqlite3(sqlite)
  const prisma = new PrismaClient({ adapter })
  prisma.weatherObservation.findMany().then(console.log).catch(e => {
    console.error("Query Error:")
    console.error(e)
  })
} catch (e) {
  console.error("Init Error:")
  console.error(e)
}

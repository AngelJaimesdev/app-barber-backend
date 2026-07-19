import { DataSource } from 'typeorm'
import * as bcrypt from 'bcrypt'
import * as dotenv from 'dotenv'

dotenv.config()

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: false,
})

async function seed() {
  await AppDataSource.initialize()

  const userRepo = AppDataSource.getRepository('users')

  // ─── SUPER ADMIN (único usuario por defecto) ───────────────────
  let admin = await userRepo.findOne({ where: { email: 'admin@barberpro.com' } })
  if (!admin) {
    admin = await userRepo.save(userRepo.create({
      email: 'admin@barberpro.com',
      password: await bcrypt.hash('Admin123!', 10),
      firstName: 'Super', lastName: 'Admin',
      role: 'SUPER_ADMIN', isActive: true,
    }))
    console.log('✅ Super Admin creado')
  } else {
    console.log('⏭  Super Admin ya existe')
  }

  console.log('\n🚀 Seed completado. Credenciales:')
  console.log('   Super Admin → admin@barberpro.com     / Admin123!')

  await AppDataSource.destroy()
}

seed().catch((err) => { console.error(err); process.exit(1) })

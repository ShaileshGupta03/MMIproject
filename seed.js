import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const user = await prisma.batteryDealer.create({
    data: {
      battery_id:"BE-100",
      qr_code_file:'file-path1',
      // dealer_id
      is_active: true,
      is_deleted: false,
      created_by:1,
      updated_by:1,
      },
  })
  console.log(user)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

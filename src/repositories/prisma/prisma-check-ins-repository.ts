import { prisma } from '@/lib/prisma'
import { Checkin, Prisma } from '@prisma/client'
import { CheckInsRepository } from '../check-ins-repository'
import dayjs from 'dayjs'

export class PrismaCheckInsRepository implements CheckInsRepository {
  async create(data: Prisma.CheckinUncheckedCreateInput) {
    const checkIn = await prisma.checkin.create({
      data,
    })

    return checkIn
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf('day').toDate()
    const endOfTheDay = dayjs(date).endOf('day').toDate()

    const checkIn = await prisma.checkin.findFirst({
      where: {
        user_id: userId,
        created_at: {
          gte: startOfTheDay,
          lte: endOfTheDay,
        },
      },
    })

    return checkIn
  }

  async findManyByUserId(userId: string, page: number) {
    const checkIns = await prisma.checkin.findMany({
      where: {
        user_id: userId,
      },
      skip: (page - 1) * 20,
      take: 20,
    })

    return checkIns
  }

  async findById(id: string) {
    const checkIn = await prisma.checkin.findUnique({
      where: {
        id,
      },
    })

    return checkIn
  }

  async countByUserId(userId: string) {
    const count = await prisma.checkin.count({
      where: {
        user_id: userId,
      },
    })

    return count
  }

  async save(data: Checkin) {
    const checkInUpdated = await prisma.checkin.update({
      where: {
        id: data.id,
      },
      data,
    })

    return checkInUpdated
  }
}

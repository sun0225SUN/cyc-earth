import { createTRPCRouter, publicProcedure } from '@/server/api/trpc'

export const athleteRouter = createTRPCRouter({
  getAthlete: publicProcedure.query(async ({ ctx }) => {
    const athlete = await ctx.db.query.athletes.findFirst()
    return athlete
  }),
})

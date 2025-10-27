import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc'

export const activitiesRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const activities = await ctx.db.query.activities.findMany({
      orderBy: (activities, { desc }) => [desc(activities.startDate)],
    })
    return activities
  }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const activity = await ctx.db.query.activities.findFirst({
        where: (activities, { eq }) => eq(activities.id, input.id),
      })
      return activity
    }),

  getByAthlete: publicProcedure
    .input(z.object({ athleteId: z.number() }))
    .query(async ({ ctx, input }) => {
      const activities = await ctx.db.query.activities.findMany({
        where: (activities, { eq }) =>
          eq(activities.athleteId, input.athleteId),
        orderBy: (activities, { desc }) => [desc(activities.startDate)],
      })
      return activities
    }),

  getWithTracks: publicProcedure.query(async ({ ctx }) => {
    const activities = await ctx.db.query.activities.findMany({
      orderBy: (activities, { desc }) => [desc(activities.startDate)],
    })

    const tracks = await ctx.db.query.tracks.findMany()

    return activities.map((activity) => {
      const track = tracks.find((t) => t.id === activity.id)
      return {
        ...activity,
        track: track || null,
      }
    })
  }),

  getTrack: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const track = await ctx.db.query.tracks.findFirst({
        where: (tracks, { eq }) => eq(tracks.id, input.id),
      })
      return track
    }),
})

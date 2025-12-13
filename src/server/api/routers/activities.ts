import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc'
import { sql } from 'drizzle-orm'
import { activities, tracks } from '@/server/db/schema'
import type { GPXData, GPXPoint } from '@/types/map'

// Helper function to generate mock track points
const generateMockTrackPoints = (activityId: number): GPXPoint[] => {
  // Generate a simple mock track with 100 points
  const points: GPXPoint[] = [];
  const baseLat = 39.9 + (activityId % 10) * 0.1; // Slight variation based on activityId
  const baseLon = 116.3 + (activityId % 10) * 0.1;
  
  for (let i = 0; i < 100; i++) {
    points.push({
      latitude: baseLat + (Math.random() - 0.5) * 0.01,
      longitude: baseLon + (Math.random() - 0.5) * 0.01,
      elevation: 100 + i * 0.5 + Math.random() * 5,
      time: new Date(Date.now() - (100 - i) * 60000).toISOString(), // 1 minute apart
    });
  }
  
  return points;
};
// Use the type from createTRPCContext instead of importing Context
type Context = Awaited<ReturnType<typeof import('@/server/api/trpc').createTRPCContext>>
import type { InferSelectModel } from 'drizzle-orm'

// Define types for database models
type Activity = InferSelectModel<typeof activities>
type Track = InferSelectModel<typeof tracks>

export interface ActivityWithTrack extends Activity {
  track?: Track | null
}

export interface YearlyStats {
  year: number
  totalActivities: number
  totalDistance: number
  totalMovingTime: number
  totalElevationGain: number
}

export interface TotalStats {
  totalActivities: number
  totalDistance: number
  totalMovingTime: number
  totalElevationGain: number
  yearlyStats: YearlyStats[]
}

export const activitiesRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(z.object({ year: z.number().optional() }))
    .query(async ({ ctx, input }: { ctx: Context; input: { year?: number } }) => {
      return ctx.db.query.activities.findMany({
        where: input.year ? (table, { gte, lte }) => {
          const year = input.year as number; // 类型断言，因为我们已经检查了input.year存在
          const yearStart = `${year}-01-01T00:00:00Z`
          const yearEnd = `${year + 1}-01-01T00:00:00Z`
          return sql`${table.startDate} >= ${yearStart} AND ${table.startDate} < ${yearEnd}`
        } : undefined,
        orderBy: (table, { desc }) => [desc(table.startDate)],
      })
    }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }: { ctx: Context; input: { id: number } }) => {
      return ctx.db.query.activities.findFirst({
        where: (table, { eq }) => eq(table.id, input.id),
      })
    }),

  getByAthlete: publicProcedure
    .input(z.object({ athleteId: z.number(), year: z.number().optional() }))
    .query(async ({ ctx, input }: { ctx: Context; input: { athleteId: number; year?: number } }) => {
      if (input.year) {
        const year = input.year as number;
        return ctx.db.query.activities.findMany({
          where: (table, { eq }) => 
            sql`${eq(table.athleteId, input.athleteId)} AND ${table.startDate} >= ${`${year}-01-01T00:00:00Z`} AND ${table.startDate} < ${`${year + 1}-01-01T00:00:00Z`}`,
          orderBy: (table, { desc }) => [desc(table.startDate)],
        });
      }
      
      return ctx.db.query.activities.findMany({
        where: (table, { eq }) => eq(table.athleteId, input.athleteId),
        orderBy: (table, { desc }) => [desc(table.startDate)],
      });
    }),

  getWithTracks: publicProcedure
    .input(z.object({ year: z.number().optional(), limit: z.number().optional() }))
    .query(async ({ ctx, input }: { ctx: Context; input: { year?: number; limit?: number } }): Promise<ActivityWithTrack[]> => {
      // 优化查询：使用数据库连接查询，而不是先查询所有活动再查询所有轨迹
      const activities = await ctx.db.query.activities.findMany({
        where: input.year ? (table) => {
          const year = input.year as number;
          const yearStart = `${year}-01-01T00:00:00Z`;
          const yearEnd = `${year + 1}-01-01T00:00:00Z`;
          return sql`${table.startDate} >= ${yearStart} AND ${table.startDate} < ${yearEnd}`;
        } : undefined,
        orderBy: (table, { desc }) => [desc(table.startDate)],
        limit: input.limit || 50, // 限制返回的活动数量，默认50个
      });

      // 批量获取这些活动对应的轨迹
      const activityIds = activities.map(activity => activity.id);
      const tracksResult = await ctx.db.query.tracks.findMany({
        where: (table, { inArray }) => inArray(table.id, activityIds),
      });

      // 将轨迹映射到活动
      const tracksMap = new Map(tracksResult.map(track => [track.id, track]));

      // 只对有轨迹的活动生成完整数据，没有轨迹的活动暂时不生成模拟轨迹
      return activities.map((activity: Activity) => {
        const track = tracksMap.get(activity.id);
        
        return {
          ...activity,
          track
        };
      });
    }),

    getTrack: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }: { ctx: Context; input: { id: number } }) => {
        return ctx.db.query.tracks.findFirst({
          where: (table, { eq }) => eq(table.id, input.id),
        })
      }),

  // 获取活动统计数据，包括每年的量和总量
  getStats: publicProcedure.query(async ({ ctx }: { ctx: Context }) => {
    const activitiesResult = await ctx.db.query.activities.findMany({
      columns: { startDate: true, distance: true, movingTime: true, totalElevationGain: true },
    })

    // 按年份分组统计
    const yearlyStatsMap: Record<number, YearlyStats> = activitiesResult.reduce((acc: Record<number, YearlyStats>, activity) => {
      // Handle case where startDate might be null
      const year = new Date(activity.startDate || new Date()).getFullYear()
      if (!acc[year]) {
        acc[year] = {
          year,
          totalActivities: 0,
          totalDistance: 0,
          totalMovingTime: 0,
          totalElevationGain: 0,
        }
      }
      acc[year].totalActivities += 1
      acc[year].totalDistance += activity.distance || 0
      acc[year].totalMovingTime += activity.movingTime || 0
      acc[year].totalElevationGain += activity.totalElevationGain || 0
      return acc
    }, {} as Record<number, YearlyStats>)

    // 转换为数组并排序
    const yearlyStats: YearlyStats[] = Object.values(yearlyStatsMap).sort((a: YearlyStats, b: YearlyStats) => b.year - a.year)

    // 计算总量
    const totalStats: TotalStats = {
      totalActivities: yearlyStats.reduce((sum: number, stats: YearlyStats) => sum + stats.totalActivities, 0),
      totalDistance: yearlyStats.reduce((sum: number, stats: YearlyStats) => sum + stats.totalDistance, 0),
      totalMovingTime: yearlyStats.reduce((sum: number, stats: YearlyStats) => sum + stats.totalMovingTime, 0),
      totalElevationGain: yearlyStats.reduce((sum: number, stats: YearlyStats) => sum + stats.totalElevationGain, 0),
      yearlyStats,
    }

    return totalStats
  }),
})

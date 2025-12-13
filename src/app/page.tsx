import { Header } from '@/components/layout/header'
import { CycMap } from '@/components/map'
import { PanelProfile } from '@/components/panel/profile'
import { StatsPanel } from '@/components/panel/stats'
import { DataTable } from '@/components/table'

export default async function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* 侧边栏 - 个人资料 */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <PanelProfile />
            </div>
          </div>

          {/* 主内容区域 */}
          <div className="lg:col-span-3 space-y-8">
            {/* 地图区域 */}
            <div className="rounded-xl overflow-hidden border border-border bg-card">
              <div id="map-container" className="h-[60vh] lg:h-[70vh] relative">
                <CycMap />
              </div>
            </div>

            {/* 统计和数据区域 */}
            <div className="grid grid-cols-1 gap-8">
              {/* 统计面板 */}
              <div className="rounded-xl overflow-hidden border border-border bg-card">
                <StatsPanel />
              </div>

              {/* 数据表格 */}
              <div className="rounded-xl overflow-hidden border border-border bg-card">
                <DataTable />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

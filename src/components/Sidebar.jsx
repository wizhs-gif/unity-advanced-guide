import { useState } from 'react'

export default function Sidebar({ pages, activePage, onNavigate, isUnlocked, isComplete, getModuleProgress, overall }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <nav className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        {!collapsed && (
          <div className="sidebar-brand">
            <h1 className="sidebar-title">Unity 进阶</h1>
            <span className="sidebar-subtitle">高级开发指南</span>
          </div>
        )}
        <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)} title={collapsed ? '展开' : '收起'}>
          {collapsed ? '»' : '«'}
        </button>
      </div>

      {!collapsed && (
        <div className="sidebar-progress">
          <div className="overall-progress-label">
            <span>总体进度</span>
            <span className="overall-percent">{overall.percent}%</span>
          </div>
          <div className="overall-progress-bar">
            <div className="overall-progress-fill" style={{ width: `${overall.percent}%` }} />
          </div>
          <div className="overall-stats">{overall.completed}/{overall.total} 任务完成</div>
        </div>
      )}

      <div className="sidebar-nav">
        {Object.entries(pages).map(([key, { label, icon }]) => {
          const unlocked = isUnlocked(key)
          const complete = isComplete(key)
          const modProgress = getModuleProgress(key)
          const isActive = activePage === key

          return (
            <button
              key={key}
              className={`nav-item ${isActive ? 'active' : ''} ${!unlocked ? 'locked' : ''} ${complete ? 'completed' : ''}`}
              onClick={() => unlocked && onNavigate(key)}
              title={unlocked ? label : '完成前置模块后解锁'}
              disabled={!unlocked}
            >
              <span className="nav-icon">{unlocked ? icon : ' '}</span>
              {!collapsed && (
                <>
                  <span className="nav-label">{label}</span>
                  {unlocked && modProgress.total > 0 && (
                    <span className={`nav-badge ${complete ? 'badge-complete' : ''}`}>
                      {complete ? ' ' : `${modProgress.done}/${modProgress.total}`}
                    </span>
                  )}
                </>
              )}
            </button>
          )
        })}
      </div>

      {!collapsed && (
        <div className="sidebar-footer">
          <div className="footer-text">Unity 高级开发技术栈</div>
        </div>
      )}
    </nav>
  )
}

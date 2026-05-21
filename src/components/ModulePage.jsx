import { useState } from 'react'
import { moduleConfig } from '../data/moduleConfig'

export default function ModulePage({ moduleKey, progress, toggleTask, children }) {
  const [tasksOpen, setTasksOpen] = useState(false)
  const config = moduleConfig[moduleKey]
  if (!config) return children
  const tasks = config.tasks
  if (tasks.length === 0) return children

  const done = tasks.filter(t => progress[t.id]).length
  const percent = Math.round((done / tasks.length) * 100)
  const isComplete = done === tasks.length

  return (
    <div className="module-wrapper">
      <div className="module-content-area">{children}</div>

      <div className={`task-bar ${tasksOpen ? 'open' : ''}`}>
        <button className="task-bar-toggle" onClick={() => setTasksOpen(!tasksOpen)}>
          <span className="task-bar-left">
            <span className="task-bar-icon">{isComplete ? ' ' : ' '}</span>
            <span className="task-bar-label">学习任务</span>
          </span>
          <span className="task-bar-right">
            <span className={`task-progress-badge ${isComplete ? 'complete' : ''}`}>
              {done}/{tasks.length}
            </span>
            <span className="task-bar-arrow">{tasksOpen ? '▲' : '▼'}</span>
          </span>
        </button>
        <div className="task-bar-progress">
          <div className="task-progress-fill" style={{ width: `${percent}%` }} />
        </div>
        {tasksOpen && (
          <div className="task-bar-body">
            <div className="task-bar-grid">
              {tasks.map(task => (
                <label key={task.id} className={`task-chip ${progress[task.id] ? 'done' : ''}`}>
                  <input type="checkbox" checked={!!progress[task.id]} onChange={() => toggleTask(task.id)} />
                  <span className="task-chip-check" />
                  <span className="task-chip-text">{task.title}</span>
                </label>
              ))}
            </div>
            {isComplete && (
              <div className="module-complete-banner">
                <span className="complete-icon"> </span>
                <span>模块完成！下一个模块已解锁</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

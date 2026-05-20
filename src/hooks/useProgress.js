import { useState, useEffect, useCallback, useMemo } from 'react'
import { moduleConfig, moduleOrder } from '../data/moduleConfig'

const STORAGE_KEY = 'unity-advanced-progress'

function loadProgress() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : {}
  } catch {
    return {}
  }
}

export function useProgress() {
  const [progress, setProgress] = useState(loadProgress)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  }, [progress])

  const toggleTask = useCallback((taskId) => {
    setProgress(prev => ({ ...prev, [taskId]: !prev[taskId] }))
  }, [])

  const resetProgress = useCallback(() => {
    setProgress({})
  }, [])

  const isComplete = useCallback((moduleKey) => {
    const config = moduleConfig[moduleKey]
    if (!config || config.tasks.length === 0) return false
    return config.tasks.every(t => progress[t.id])
  }, [progress])

  const isUnlocked = useCallback((moduleKey) => {
    const config = moduleConfig[moduleKey]
    if (!config) return false
    if (config.alwaysUnlocked) return true
    if (!config.unlockAfter) return true
    return isComplete(config.unlockAfter)
  }, [isComplete])

  const getModuleProgress = useCallback((moduleKey) => {
    const config = moduleConfig[moduleKey]
    if (!config || config.tasks.length === 0) return { done: 0, total: 0 }
    const done = config.tasks.filter(t => progress[t.id]).length
    return { done, total: config.tasks.length }
  }, [progress])

  const overall = useMemo(() => {
    const allTasks = moduleOrder.flatMap(k => moduleConfig[k]?.tasks || [])
    const total = allTasks.length
    const completed = allTasks.filter(t => progress[t.id]).length
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0
    const completedModules = moduleOrder.filter(k => isComplete(k)).length
    return { total, completed, percent, completedModules, totalModules: moduleOrder.length }
  }, [progress, isComplete])

  return { progress, toggleTask, resetProgress, isUnlocked, isComplete, getModuleProgress, overall }
}

import { useState } from 'react'
import Sidebar from './components/Sidebar'
import ModulePage from './components/ModulePage'
import TutorialPage from './components/TutorialPage'
import { useProgress } from './hooks/useProgress'

import { luaChapters } from './data/lua'
import { shaderChapters } from './data/shader'
import { dotsChapters } from './data/dots'
import { optimizationChapters } from './data/optimization'
import { hotupdateChapters } from './data/hotupdate'
import { networkingChapters } from './data/networking'
import { editorChapters } from './data/editor'
import { animationChapters } from './data/animation'
import { interviewChapters } from './data/interview'

const pages = {
  lua: { label: 'Lua 脚本', icon: ' ', chapters: luaChapters, title: 'Lua 脚本教程', subtitle: '热更新必备语言，从零开始学 Lua' },
  shader: { label: 'Shader 编程', icon: ' ', chapters: shaderChapters, title: 'Shader 编程', subtitle: '掌握 ShaderLab、HLSL 和 Shader Graph' },
  dots: { label: 'DOTS & ECS', icon: ' ', chapters: dotsChapters, title: 'DOTS & ECS', subtitle: '高性能数据导向开发技术栈' },
  optimization: { label: '性能优化', icon: ' ', chapters: optimizationChapters, title: '性能优化', subtitle: 'Profiler 分析、内存管理、渲染优化' },
  hotupdate: { label: '热更新', icon: ' ', chapters: hotupdateChapters, title: '热更新方案', subtitle: 'IL2CPP、Addressables、资源热更新' },
  networking: { label: '网络编程', icon: ' ', chapters: networkingChapters, title: '网络编程', subtitle: 'Unity Netcode、状态同步、RPC' },
  editor: { label: '编辑器扩展', icon: ' ', chapters: editorChapters, title: '编辑器扩展', subtitle: '自定义 Inspector、EditorWindow、工具开发' },
  animation: { label: '动画进阶', icon: ' ', chapters: animationChapters, title: '动画进阶', subtitle: 'Timeline、Cinemachine、程序化动画' },
  interview: { label: '面试与就业', icon: ' ', chapters: interviewChapters, title: '面试与就业', subtitle: 'Unity 进阶岗位常见面试题' },
}

export default function App() {
  const [activePage, setActivePage] = useState('lua')
  const { progress, toggleTask, resetProgress, isUnlocked, isComplete, getModuleProgress, overall } = useProgress()

  const pageConfig = pages[activePage]

  return (
    <div className="app">
      <Sidebar
        pages={pages}
        activePage={activePage}
        onNavigate={setActivePage}
        isUnlocked={isUnlocked}
        isComplete={isComplete}
        getModuleProgress={getModuleProgress}
        overall={overall}
      />
      <main className="main-content">
        <div className="page-transition" key={activePage}>
          <ModulePage moduleKey={activePage} progress={progress} toggleTask={toggleTask}>
            <TutorialPage
              title={pageConfig.title}
              subtitle={pageConfig.subtitle}
              chapters={pageConfig.chapters}
            />
          </ModulePage>
        </div>
      </main>
    </div>
  )
}

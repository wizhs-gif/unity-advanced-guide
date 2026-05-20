export const moduleConfig = {
  lua: {
    label: 'Lua 脚本',
    icon: ' ',
    alwaysUnlocked: true,
    unlockAfter: null,
    tasks: [
      { id: 'lua1', title: '掌握 Lua 基础语法（变量、控制流）' },
      { id: 'lua2', title: '理解 table 的数组和字典用法' },
      { id: 'lua3', title: '掌握 metatable 面向对象写法' },
      { id: 'lua4', title: '理解 coroutine 协程机制' },
      { id: 'lua5', title: '配置 xLua 并实现 C# 调用 Lua' },
      { id: 'lua6', title: '实现一个简单的热更新流程' },
    ]
  },
  shader: {
    label: 'Shader 编程',
    icon: ' ',
    alwaysUnlocked: false,
    unlockAfter: 'lua',
    tasks: [
      { id: 'sh1', title: '理解渲染管线和 Shader 类型' },
      { id: 'sh2', title: '写一个 Surface Shader' },
      { id: 'sh3', title: '写一个 Vertex/Fragment Shader' },
      { id: 'sh4', title: '用 Shader Graph 制作一个效果' },
    ]
  },
  dots: {
    label: 'DOTS & ECS',
    icon: ' ',
    alwaysUnlocked: false,
    unlockAfter: 'shader',
    tasks: [
      { id: 'dots1', title: '理解 ECS 的核心概念（Entity/Component/System）' },
      { id: 'dots2', title: '用 Jobs System 实现多线程计算' },
      { id: 'dots3', title: '了解 Burst Compiler 的作用' },
    ]
  },
  optimization: {
    label: '性能优化',
    icon: ' ',
    alwaysUnlocked: false,
    unlockAfter: 'dots',
    tasks: [
      { id: 'opt1', title: '使用 Profiler 分析 CPU/GPU 瓶颈' },
      { id: 'opt2', title: '实现一个对象池系统' },
      { id: 'opt3', title: '理解并减少 GC Alloc' },
      { id: 'opt4', title: '掌握 Draw Call 优化方法' },
    ]
  },
  hotupdate: {
    label: '热更新',
    icon: ' ',
    alwaysUnlocked: false,
    unlockAfter: 'optimization',
    tasks: [
      { id: 'hot1', title: '理解 IL2CPP 和 Mono 的区别' },
      { id: 'hot2', title: '使用 Addressables 加载资源' },
      { id: 'hot3', title: '实现 Addressables 远程更新' },
    ]
  },
  networking: {
    label: '网络编程',
    icon: ' ',
    alwaysUnlocked: false,
    unlockAfter: 'hotupdate',
    tasks: [
      { id: 'net1', title: '理解 Unity Netcode 的核心概念' },
      { id: 'net2', title: '实现 NetworkVariable 状态同步' },
      { id: 'net3', title: '实现 ServerRpc 和 ClientRpc' },
    ]
  },
  editor: {
    label: '编辑器扩展',
    icon: ' ',
    alwaysUnlocked: false,
    unlockAfter: 'networking',
    tasks: [
      { id: 'ed1', title: '创建一个 Custom Inspector' },
      { id: 'ed2', title: '创建一个 EditorWindow 工具' },
      { id: 'ed3', title: '理解 PropertyDrawer 的用法' },
    ]
  },
  animation: {
    label: '动画进阶',
    icon: ' ',
    alwaysUnlocked: false,
    unlockAfter: 'editor',
    tasks: [
      { id: 'anim1', title: '使用 Timeline 制作过场动画' },
      { id: 'anim2', title: '配置 Cinemachine 相机系统' },
    ]
  },
  interview: {
    label: '面试与就业',
    icon: ' ',
    alwaysUnlocked: false,
    unlockAfter: 'animation',
    tasks: [
      { id: 'i1', title: '能回答性能优化常见问题' },
      { id: 'i2', title: '能解释 IL2CPP vs Mono' },
      { id: 'i3', title: '能描述热更新方案和实现' },
      { id: 'i4', title: '准备一个进阶项目的介绍' },
    ]
  }
};

export const moduleOrder = [
  'lua', 'shader', 'dots', 'optimization',
  'hotupdate', 'networking', 'editor', 'animation', 'interview'
];

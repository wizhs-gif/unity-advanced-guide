export const interviewChapters = [
  {
    id: "interview-basics",
    title: "1. Unity 进阶面试题",
    sections: [
      {
        title: "性能优化面试题",
        content: `以下是 Unity 进阶岗位最常见的面试题，涵盖性能优化、架构设计、热更新等方向。`,
        code: `// Q: 如何减少 Draw Call？
// A:
// 1. 静态合批（Static Batching）：标记 Static
// 2. 动态合批（Dynamic Batching）：小网格自动合批
// 3. GPU Instancing：相同材质的大量物体
// 4. SRP Batcher：URP/HDRP 的高效合批
// 5. 图集（Atlas）：将小图合并为大图

// Q: 如何定位内存泄漏？
// A:
// 1. Profiler → Memory → Detailed
// 2. 检查 Texture/Mesh/Material 的引用
// 3. Addressables 用完要 Release
// 4. 事件订阅要取消（OnDestroy 中 -=）
// 5. 协程未完成不会自动停止

// Q: MonoBehaviour 生命周期？
// A:
// Awake → OnEnable → Start → FixedUpdate →
// Update → LateUpdate → OnDisable → OnDestroy

// Q: 协程的原理？
// A:
// 协程是 C# 编译器生成的状态机（IEnumerator）
// 每次 yield return 后记录当前状态
// Unity 的 PlayerLoop 在每帧末尾恢复执行

// Q: IL2CPP 和 Mono 的区别？
// A:
// Mono：JIT 编译，开发快，支持反射
// IL2CPP：AOT 编译为 C++，性能好 20-50%
// iOS 必须用 IL2CPP（Apple 禁止 JIT）
// IL2CPP 不支持运行时加载 C# 代码`,
        notes: [
          "Draw Call 优化：合批、图集、减少材质种类",
          "内存泄漏：资源引用未释放、事件未取消",
          "生命周期顺序必须熟记",
          "协程本质是编译器生成的状态机",
          "IL2CPP vs Mono 是必考题"
        ]
      }
    ]
  }
];

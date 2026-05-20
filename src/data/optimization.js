export const optimizationChapters = [
  {
    id: "opt-profiler",
    title: "1. Profiler 性能分析",
    sections: [
      {
        title: "Unity Profiler 使用",
        content: `Profiler 是 Unity 内置的性能分析工具，可以查看 CPU、GPU、内存、渲染等详细数据。

**打开方式：** Window → Analysis → Profiler

**核心模块：**
- CPU Usage：各函数耗时
- GPU Usage：渲染耗时
- Memory：内存分配
- Rendering：Draw Call 数量`,
        code: `// ===== 代码中添加 Profiler 标记 =====
using Unity.Profiling;

public class MyComponent : MonoBehaviour
{
    // 定义 Profiler Marker
    static readonly ProfilerMarker s_UpdateMarker =
        new ProfilerMarker("MyComponent.Update");

    static readonly ProfilerMarker s_PhysicsMarker =
        new ProfilerMarker(ProfilerCategory.Physics,
                           "MyPhysicsCalc");

    void Update()
    {
        // 标记一段代码
        s_UpdateMarker.Begin();
        // ... 你的代码 ...
        s_UpdateMarker.End();

        // 或者用 using 语法
        using (s_PhysicsMarker.Auto())
        {
            // ... 物理计算 ...
        }
    }
}

// ===== 常用 Profiler 命令 =====
// 控制台命令（Development Build 中可用）

// 显示帧率
Application.targetFrameRate = 60;

// 统计信息
Debug.Log($"Draw Calls: {UnityStats.drawCalls}");
Debug.Log($"Triangles: {UnityStats.triangles}");
Debug.Log($"SetPass Calls: {UnityStats.setPassCalls}");`,
        notes: [
          "Profiler 在 Editor 和 Development Build 中可用",
          "Deep Profile 可以看到每个函数的详细耗时",
          "CPU Usage 中关注 GC.Alloc（内存分配）",
          "GPU 模块可以看到每个 Pass 的耗时",
          "用 ProfilerMarker 自定义标记关键代码段"
        ]
      },
      {
        title: "常见性能瓶颈",
        content: `Unity 项目中最常见的性能问题及解决方案：

**CPU 瓶颈：**
- Update 中做太多计算 → 降低频率、用 Job
- 大量 Instantiate/Destroy → 对象池
- 过多 GetComponent → 缓存引用

**GPU 瓶颈：**
- 过多 Draw Call → 合批（Batching）
- Shader 复杂度 → 降低指令数
- 过大纹理 → 压缩、降低分辨率

**内存问题：**
- GC Alloc → 避免每帧分配
- 纹理未压缩 → 使用压缩格式`,
        code: `// ===== 对象池（避免 Instantiate/Destroy）=====
public class ObjectPool<T> where T : Component
{
    private Queue<T> pool = new Queue<T>();
    private T prefab;

    public ObjectPool(T prefab, int initialSize)
    {
        this.prefab = prefab;
        for (int i = 0; i < initialSize; i++)
        {
            var obj = Object.Instantiate(prefab);
            obj.gameObject.SetActive(false);
            pool.Enqueue(obj);
        }
    }

    public T Get()
    {
        var obj = pool.Count > 0 ? pool.Dequeue()
            : Object.Instantiate(prefab);
        obj.gameObject.SetActive(true);
        return obj;
    }

    public void Return(T obj)
    {
        obj.gameObject.SetActive(false);
        pool.Enqueue(obj);
    }
}

// ===== 避免 GC Alloc =====
// 错误：每帧分配新数组
void BadUpdate()
{
    var enemies = FindObjectsOfType<Enemy>(); // GC!
}

// 正确：缓存或用 List
private List<Enemy> enemies = new List<Enemy>();
void GoodUpdate()
{
    enemies.Clear();
    // 用 OverlapSphereNonAlloc 避免分配
    var cols = new Collider[100];
    int count = Physics.OverlapSphereNonAlloc(
        transform.position, 10f, cols);
}`,
        notes: [
          "Instantiate/Destroy 有 GC，用对象池替代",
          "FindObjectOfType 每次调用都很慢，缓存结果",
          "GetComponent 也有开销，Start 中缓存到变量",
          "字符串拼接用 StringBuilder 或 $\"\" 格式化",
          "foreach 在某些情况会产生 GC，用 for 替代"
        ]
      }
    ]
  }
];

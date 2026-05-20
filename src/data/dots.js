export const dotsChapters = [
  {
    id: "dots-ecs",
    title: "1. ECS 核心概念",
    sections: [
      {
        title: "什么是 DOTS？",
        content: `DOTS（Data-Oriented Technology Stack）是 Unity 的高性能技术栈，包含三个核心组件：

**ECS（Entity Component System）：** 数据和逻辑分离的架构
**Jobs System：** 多线程任务调度
**Burst Compiler：** 高性能编译器

**为什么需要 DOTS？**
传统 MonoBehaviour 是面向对象的，每个 GameObject 都有独立的内存，CPU 缓存命中率低。DOTS 用连续内存存储数据，CPU 可以批量处理，性能提升 10-100 倍。

**适合场景：**
- 大量同类型实体（子弹、NPC、粒子）
- 需要高帧率的模拟（RTS、弹幕、物理）`,
        code: `// ===== 传统 MonoBehaviour =====
public class Bullet : MonoBehaviour
{
    public float Speed = 10f;
    public Vector3 Direction;

    void Update()
    {
        transform.position += Direction * Speed * Time.deltaTime;
    }
}
// 10000 个子弹 = 10000 个 Update 调用，很慢

// ===== ECS 写法 =====
using Unity.Entities;
using Unity.Transforms;
using Unity.Mathematics;

// Component：纯数据
public struct BulletData : IComponentData
{
    public float Speed;
    public float3 Direction;
}

// System：纯逻辑
public partial class BulletSystem : SystemBase
{
    protected void OnUpdate()
    {
        float deltaTime = Time.DeltaTime;

        // 批量处理所有有 BulletData 的实体
        Entities.ForEach((ref Translation translation,
                          in BulletData bullet) =>
        {
            translation.Value += bullet.Direction
                                 * bullet.Speed
                                 * deltaTime;
        }).ScheduleParallel();  // 多线程并行执行
    }
}`,
        notes: [
          "Entity 只是一个 ID，不包含任何数据",
          "Component 是纯数据结构（struct），没有方法",
          "System 处理逻辑，批量操作所有匹配的实体",
          "ScheduleParallel 自动分配到多个线程",
          "ECS 数据在内存中连续排列，缓存命中率极高"
        ]
      },
      {
        title: "Jobs System 多线程",
        content: `Jobs System 是 Unity 的多线程任务框架，可以安全地将工作分配到多个 CPU 核心。

**Job 类型：**
- IJob：单个任务
- IJobParallelFor：并行处理数组
- IJobEntity：并行处理 ECS 实体`,
        code: `using Unity.Jobs;
using Unity.Collections;
using Unity.Burst;
using Unity.Mathematics;

// 普通 Job
[BurstCompile]
public struct CalculateJob : IJobParallelFor
{
    [ReadOnly] public NativeArray<float3> Positions;
    [ReadOnly] public NativeArray<float> Speeds;
    public NativeArray<float3> Results;
    public float DeltaTime;

    public void Execute(int index)
    {
        Results[index] = Positions[index]
            + new float3(0, Speeds[index] * DeltaTime, 0);
    }
}

// 使用 Job
public class JobExample : MonoBehaviour
{
    void Update()
    {
        var positions = new NativeArray<float3>(1000, Allocator.TempJob);
        var speeds = new NativeArray<float>(1000, Allocator.TempJob);
        var results = new NativeArray<float3>(1000, Allocator.TempJob);

        // 填充数据...

        var job = new CalculateJob
        {
            Positions = positions,
            Speeds = speeds,
            Results = results,
            DeltaTime = Time.deltaTime
        };

        // 调度 Job（自动分配到多线程）
        JobHandle handle = job.Schedule(1000, 64);
        handle.Complete();  // 等待完成

        // 使用 results...

        positions.Dispose();
        speeds.Dispose();
        results.Dispose();
    }
}`,
        notes: [
          "[BurstCompile] 让 Burst 编译器优化此 Job",
          "NativeArray 是线程安全的数组（非托管内存）",
          "[ReadOnly] 标记只读数据，允许并行访问",
          "Allocator.TempJob 用于临时分配，用完必须 Dispose",
          "Schedule 的第二个参数是批处理大小"
        ]
      }
    ]
  }
];

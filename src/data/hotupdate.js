export const hotupdateChapters = [
  {
    id: "hot-il2cpp",
    title: "1. IL2CPP 与 Mono",
    sections: [
      {
        title: "Mono vs IL2CPP",
        content: `Unity 有两种脚本后端：Mono 和 IL2CPP。理解它们的区别对热更新方案选择至关重要。

**Mono：**
- 使用 JIT（即时编译）
- 支持反射和动态加载
- iOS 不支持 JIT，只能用 AOT 模式
- 开发时更快（增量编译）

**IL2CPP：**
- 将 C# 编译为 C++，再编译为原生代码
- 性能更好（约提升 20-50%）
- 不支持 JIT，不支持动态加载 DLL
- iOS 必须用 IL2CPP`,
        code: `// ===== IL2CPP 的限制 =====

// 不能做的事：
// 1. 运行时加载新的 C# DLL
// 2. System.Reflection.Emit
// 3. 动态生成代码

// ===== 应对方案 =====

// 方案一：Lua 热更新（推荐）
// 业务逻辑写 Lua，C# 只做框架
// 通过 xLua/ToLua 执行 Lua 脚本

// 方案二：HybridCLR（新方案）
// 支持在 IL2CPP 下加载新的 C# 代码
// 原理：修改 IL2CPP 运行时，支持 AOT 补充

// 方案三：Addressables + AssetBundle
// 资源热更新（不涉及代码）
// 适合美术资源更新

// ===== 构建设置 =====
// Player Settings → Other Settings → Scripting Backend
// - Mono：开发阶段
// - IL2CPP：发布（特别是 iOS）`,
        notes: [
          "iOS 强制使用 IL2CPP，不能用 Mono",
          "IL2CPP 性能比 Mono 好 20-50%",
          "IL2CPP 不支持 JIT，不能运行时加载 C# 代码",
          "Lua 热更新是绕过 IL2CPP 限制的经典方案",
          "HybridCLR 是新兴方案，支持 IL2CPP 下热更 C#"
        ]
      }
    ]
  },
  {
    id: "hot-addressables",
    title: "2. Addressables 资源管理",
    sections: [
      {
        title: "Addressables 基础",
        content: `Addressables 是 Unity 推荐的资源管理系统，替代了旧的 AssetBundle。它简化了资源的加载、打包和远程更新。

**核心概念：**
- Addressable Asset：标记为可寻址的资源
- AssetReference：资源的引用（不直接引用）
- AddressableAssetGroup：资源分组（打包策略）`,
        code: `using UnityEngine;
using UnityEngine.AddressableAssets;
using UnityEngine.ResourceManagement.AsyncOperations;

public class AddressablesExample : MonoBehaviour
{
    // 方式一：AssetReference（编辑器中拖拽赋值）
    public AssetReference prefabRef;

    // 方式二：Address（通过字符串加载）
    public string address = "Prefabs/Enemy";

    async void Start()
    {
        // 方式一：通过 AssetReference 加载
        var op = prefabRef.InstantiateAsync();
        await op.Task;

        // 方式二：通过地址加载
        var op2 = Addressables.LoadAssetAsync<GameObject>(address);
        GameObject prefab = await op2.Task;

        // 异步加载场景
        Addressables.LoadSceneAsync("Level_02");

        // 释放资源
        Addressables.Release(op2);
    }
}

// ===== 远程更新 =====
// 1. 在 AddressableAssetSettings 中设置 Build Remote Catalog
// 2. 打包时上传到 CDN
// 3. 客户端检查更新：
async void CheckForUpdates()
{
    var checkHandle = Addressables.CheckForCatalogUpdates(false);
    var updates = await checkHandle.Task;

    if (updates.Count > 0)
    {
        Debug.Log($"发现 {updates.Count} 个更新");
        var updateHandle = Addressables.UpdateCatalogs(updates);
        await updateHandle.Task;
    }
}`,
        notes: [
          "AssetReference 避免了直接引用导致的资源冗余",
          "Address 字符串加载更灵活，适合动态场景",
          "InstantiateAsync 自动实例化+加载",
          "用完资源要 Release，否则内存泄漏",
          "CheckForCatalogUpdates 检查远程资源更新"
        ]
      }
    ]
  }
];

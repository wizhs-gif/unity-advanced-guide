export const networkingChapters = [
  {
    id: "net-basics",
    title: "1. 网络基础",
    sections: [
      {
        title: "Unity 网络方案选择",
        content: `Unity 有多种网络方案，选择取决于项目类型：

**Unity Netcode for GameObjects：**
- Unity 官方方案
- 适合中小规模多人游戏
- 基于 RPC 和状态同步

**Photon：**
- 第三方方案，最成熟
- 有 PUN（简单）和 Fusion（高级）两个版本
- 有免费额度，适合独立开发者

**Mirror：**
- 开源社区方案
- UNet 的继承者，API 类似
- 适合中等规模项目`,
        code: `// ===== Unity Netcode 基础 =====
using Unity.Netcode;
using UnityEngine;

// 同步的变量
public class PlayerController : NetworkBehaviour
{
    // 同步变量：服务器修改，自动同步到客户端
    private NetworkVariable<int> Health =
        new NetworkVariable<int>(100,
            NetworkVariableReadPermission.Everyone,
            NetworkVariableWritePermission.Server);

    // 同步变量变化回调
    public override void OnNetworkSpawn()
    {
        Health.OnValueChanged += OnHealthChanged;
    }

    void OnHealthChanged(int oldVal, int newVal)
    {
        Debug.Log($"HP: {oldVal} -> {newVal}");
        UpdateHealthUI(newVal);
    }

    // Server RPC：客户端请求服务器执行
    [ServerRpc(RequireOwnership = false)]
    public void TakeDamageServerRpc(int amount)
    {
        Health.Value -= amount;
        if (Health.Value <= 0)
        {
            DieClientRpc();
        }
    }

    // Client RPC：服务器通知所有客户端
    [ClientRpc]
    void DieClientRpc()
    {
        // 播放死亡特效
        Instantiate(deathEffect, transform.position,
                    Quaternion.identity);
    }

    void Update()
    {
        if (!IsOwner) return;  // 只处理本地玩家

        float h = Input.GetAxis("Horizontal");
        float v = Input.GetAxis("Vertical");
        transform.Translate(new Vector3(h, 0, v) * 5f * Time.deltaTime);
    }
}`,
        notes: [
          "NetworkBehaviour 替代 MonoBehaviour（需要 NetworkObject）",
          "NetworkVariable 自动同步变量到所有客户端",
          "[ServerRpc] 客户端调用，服务器执行",
          "[ClientRpc] 服务器调用，所有客户端执行",
          "IsOwner 判断是否是本地玩家"
        ]
      }
    ]
  }
];

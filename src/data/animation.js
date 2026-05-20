export const animationChapters = [
  {
    id: "anim-timeline",
    title: "1. Timeline 与 Cinemachine",
    sections: [
      {
        title: "Timeline 基础",
        content: `Timeline 是 Unity 的过场动画系统，可以精确控制动画、音频、粒子、相机等的时间线。

**核心概念：**
- Track（轨道）：控制某一类对象
- Clip（片段）：轨道上的时间片段
- Playable Director：控制 Timeline 的播放`,
        code: `// ===== Timeline 代码控制 =====
using UnityEngine;
using UnityEngine.Playables;

public class CutsceneTrigger : MonoBehaviour
{
    public PlayableDirector director;

    void OnTriggerEnter(Collider other)
    {
        if (other.CompareTag("Player"))
        {
            director.Play();
            director.stopped += OnCutsceneEnd;
        }
    }

    void OnCutsceneEnd(PlayableDirector d)
    {
        // 过场动画结束
        Debug.Log("过场动画播放完毕");
        d.stopped -= OnCutsceneEnd;
    }
}

// ===== Cinemachine 相机 =====
using Cinemachine;

public class CameraManager : MonoBehaviour
{
    public CinemachineFreeLook freeLookCam;
    public CinemachineVirtualCamera combatCam;

    public void EnterCombat()
    {
        // 切换到战斗相机
        combatCam.Priority = 20;
        freeLookCam.Priority = 10;
    }

    public void ExitCombat()
    {
        // 切换回自由相机
        freeLookCam.Priority = 20;
        combatCam.Priority = 10;
    }
}`,
        notes: [
          "Timeline 可以混合动画、音频、粒子、激活/反激活",
          "Playable Director 控制 Timeline 的播放/暂停/停止",
          "Cinemachine 相机通过 Priority 自动切换",
          "CinemachineFreeLook 实现第三人称自由视角",
          "Timeline Clip 支持 Animation、Activation、Audio 等类型"
        ]
      }
    ]
  }
];

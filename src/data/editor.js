export const editorChapters = [
  {
    id: "editor-custom",
    title: "1. 自定义编辑器",
    sections: [
      {
        title: "Custom Editor 和 PropertyDrawer",
        content: `Unity 编辑器本身是用 C# 写的，你也可以扩展它。自定义编辑器可以改善工作流程、创建工具、加速开发。

**两种扩展方式：**
- Custom Inspector：自定义组件的 Inspector 面板
- PropertyDrawer：自定义单个字段的显示方式`,
        code: `// ===== 自定义 Inspector =====
using UnityEngine;
using UnityEditor;

[CustomEditor(typeof(Enemy))]
public class EnemyEditor : Editor
{
    public override void OnInspectorGUI()
    {
        // 获取目标组件
        Enemy enemy = (Enemy)target;

        // 绘制默认属性
        DrawDefaultInspector();

        EditorGUILayout.Space();

        // 自定义按钮
        if (GUILayout.Button("重置 HP"))
        {
            enemy.Health = enemy.MaxHealth;
            EditorUtility.SetDirty(enemy);
        }

        if (GUILayout.Button("造成 50 伤害"))
        {
            enemy.TakeDamage(50);
            EditorUtility.SetDirty(enemy);
        }

        // 显示血条
        EditorGUILayout.Space();
        float hpPercent = (float)enemy.Health / enemy.MaxHealth;
        Rect rect = GUILayout.GetControlRect(false, 20);
        EditorGUI.ProgressBar(rect, hpPercent,
            $"HP: {enemy.Health}/{enemy.MaxHealth}");
    }
}

// ===== PropertyDrawer =====
[CustomPropertyDrawer(typeof(ClampFloatAttribute))]
public class ClampFloatDrawer : PropertyDrawer
{
    public override void OnGUI(Rect position,
        SerializedProperty property, GUIContent label)
    {
        var attr = (ClampFloatAttribute)attribute;
        EditorGUI.Slider(position, property,
            attr.Min, attr.Max, label);
    }
}

// 使用
public class MyComponent : MonoBehaviour
{
    [ClampFloat(0, 100)]
    public float Health;  // Inspector 中显示为滑动条
}`,
        notes: [
          "[CustomEditor(typeof(Enemy))] 绑定到特定组件",
          "DrawDefaultInspector() 绘制默认属性",
          "EditorUtility.SetDirty() 标记数据已修改",
          "PropertyDrawer 绑定到自定义 Attribute",
          "EditorGUILayout 提供便捷的布局方法"
        ]
      },
      {
        title: "编辑器窗口和工具",
        content: `EditorWindow 可以创建完全自定义的编辑器窗口，用于构建工具和工作流。`,
        code: `using UnityEngine;
using UnityEditor;

public class BatchRenameTool : EditorWindow
{
    private string prefix = "Enemy_";
    private int startNumber = 1;

    [MenuItem("Tools/Batch Rename")]
    public static void ShowWindow()
    {
        GetWindow<BatchRenameTool>("批量重命名");
    }

    void OnGUI()
    {
        GUILayout.Label("批量重命名工具", EditorStyles.boldLabel);

        prefix = EditorGUILayout.TextField("前缀", prefix);
        startNumber = EditorGUILayout.IntField("起始编号", startNumber);

        EditorGUILayout.Space();

        if (GUILayout.Button("重命名选中对象"))
        {
            RenameSelected();
        }
    }

    void RenameSelected()
    {
        var selected = Selection.gameObjects;
        Undo.RecordObjects(selected, "Batch Rename");

        for (int i = 0; i < selected.Length; i++)
        {
            selected[i].name = prefix + (startNumber + i);
        }
    }
}

// ===== Editor 扩展：菜单命令 =====
public static class EditorTools
{
    [MenuItem("Tools/选中所有 Enemy %e")]
    static void SelectAllEnemies()
    {
        var enemies = GameObject.FindGameObjectsWithTag("Enemy");
        Selection.objects = enemies;
    }

    // 验证函数：没有 Enemy 时禁用菜单
    [MenuItem("Tools/选中所有 Enemy %e", true)]
    static bool ValidateSelectAllEnemies()
    {
        return GameObject.FindGameObjectsWithTag("Enemy").Length > 0;
    }
}`,
        notes: [
          "EditorWindow.GetWindow 创建编辑器窗口",
          "[MenuItem(\"路径\")] 添加菜单项",
          "Selection.gameObjects 获取选中的对象",
          "Undo.RecordObjects 支持撤销操作",
          "%e 表示 Ctrl+E 快捷键"
        ]
      }
    ]
  }
];

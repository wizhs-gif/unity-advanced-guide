export const shaderChapters = [
  {
    id: "shader-basics",
    title: "1. Shader 基础",
    sections: [
      {
        title: "什么是 Shader？",
        content: `Shader（着色器）是运行在 GPU 上的程序，负责计算物体的最终颜色。Unity 中的 Shader 用 ShaderLab + HLSL/Cg 编写。

**渲染管线：**
顶点数据 → 顶点着色器 → 图元装配 → 光栅化 → 片元着色器 → 输出

**Unity 的 Shader 类型：**
- Surface Shader：最简单，自动处理光照
- Vertex/Fragment Shader：最灵活，完全控制
- Compute Shader：通用 GPU 计算`,
        code: `// 最简单的 Unity Shader
Shader "Custom/BasicColor"
{
    Properties
    {
        _Color ("Main Color", Color) = (1, 0, 0, 1)
    }
    SubShader
    {
        Tags { "RenderType"="Opaque" }

        CGPROGRAM
        #pragma surface surf Standard

        fixed4 _Color;

        struct Input
        {
            float2 uv_MainTex;
        };

        void surf(Input IN, inout SurfaceOutputStandard o)
        {
            o.Albedo = _Color.rgb;
        }
        ENDCG
    }
    FallBack "Diffuse"
}`,
        notes: [
          "Shader \"路径\" 定义 Shader 在菜单中的位置",
          "Properties 定义材质面板中显示的参数",
          "SubShader 是渲染方案，可以有多个（降级用）",
          "CGPROGRAM/ENDCG 包裹 Cg/HLSL 代码",
          "Surface Shader 用 #pragma surface 声明"
        ]
      },
      {
        title: "ShaderLab 语法",
        content: `ShaderLab 是 Unity Shader 的外壳语法，定义了 Shader 的结构。内部可以嵌入 Cg/HLSL 代码。

**ShaderLab 结构：**
Shader "Name" {
    Properties { ... }    // 材质面板参数
    SubShader {
        Tags { ... }      // 渲染标签
        Pass { ... }      // 渲染通道
    }
    Fallback "..."        // 降级 Shader
}`,
        code: `Shader "Custom/TextureShader"
{
    // 材质面板参数
    Properties
    {
        _MainTex ("Texture", 2D) = "white" {}
        _Color ("Tint", Color) = (1, 1, 1, 1)
        _Glossiness ("Smoothness", Range(0, 1)) = 0.5
        _Metallic ("Metallic", Range(0, 1)) = 0.0
    }

    SubShader
    {
        // 渲染标签
        Tags
        {
            "RenderType" = "Opaque"
            "Queue" = "Geometry"
        }

        // LOD（细节层次）
        LOD 200

        CGPROGRAM
        // Surface Shader 声明
        #pragma surface surf Standard fullforwardshadows
        #pragma target 3.0

        sampler2D _MainTex;
        fixed4 _Color;
        half _Glossiness;
        half _Metallic;

        struct Input
        {
            float2 uv_MainTex;
        };

        // Surface 函数：计算表面属性
        void surf(Input IN, inout SurfaceOutputStandard o)
        {
            // 采样纹理
            fixed4 c = tex2D(_MainTex, IN.uv_MainTex) * _Color;
            o.Albedo = c.rgb;        // 基础颜色
            o.Metallic = _Metallic;   // 金属度
            o.Smoothness = _Glossiness; // 光滑度
            o.Alpha = c.a;           // 透明度
        }
        ENDCG
    }

    // 如果当前硬件不支持，降级到 Diffuse
    FallBack "Diffuse"
}`,
        notes: [
          "Properties 中 _Name(\"显示名\", Type) = 默认值",
          "2D 是纹理类型，Range(0,1) 是滑动条",
          "tex2D 函数采样纹理",
          "SurfaceOutputStandard 包含 PBR 属性",
          "fullforwardshadows 让物体接收所有阴影类型"
        ]
      }
    ]
  },
  {
    id: "shader-vf",
    title: "2. 顶点与片元着色器",
    sections: [
      {
        title: "Vertex/Fragment Shader",
        content: `当 Surface Shader 无法满足需求时，需要写顶点/片元着色器。这是最底层的 Shader 编程方式。

**流程：**
1. 顶点着色器：处理每个顶点（位置变换、法线变换）
2. 光栅化：GPU 自动将三角形转为像素
3. 片元着色器：计算每个像素的最终颜色`,
        code: `Shader "Custom/VertexFragment"
{
    Properties
    {
        _Color ("Color", Color) = (1, 1, 1, 1)
        _MainTex ("Texture", 2D) = "white" {}
    }
    SubShader
    {
        Tags { "RenderType"="Opaque" }

        Pass
        {
            CGPROGRAM
            #pragma vertex vert
            #pragma fragment frag

            #include "UnityCG.cginc"

            // 应用传给顶点着色器的数据
            struct appdata
            {
                float4 vertex : POSITION;  // 顶点位置
                float2 uv : TEXCOORD0;     // UV 坐标
                float3 normal : NORMAL;    // 法线
            };

            // 顶点着色器传给片元着色器的数据
            struct v2f
            {
                float2 uv : TEXCOORD0;
                float4 vertex : SV_POSITION; // 裁剪空间位置
                float3 worldNormal : TEXCOORD1;
            };

            sampler2D _MainTex;
            float4 _Color;

            // 顶点着色器
            v2f vert(appdata v)
            {
                v2f o;
                // 将顶点从模型空间变换到裁剪空间
                o.vertex = UnityObjectToClipPos(v.vertex);
                o.uv = v.uv;
                // 将法线从模型空间变换到世界空间
                o.worldNormal = UnityObjectToWorldNormal(v.normal);
                return o;
            }

            // 片元着色器
            fixed4 frag(v2f i) : SV_Target
            {
                // 简单的漫反射光照
                float3 lightDir = normalize(_WorldSpaceLightPos0.xyz);
                float NdotL = saturate(dot(i.worldNormal, lightDir));

                fixed4 texColor = tex2D(_MainTex, i.uv);
                fixed4 col = texColor * _Color;
                col.rgb *= NdotL;  // 乘以光照
                return col;
            }
            ENDCG
        }
    }
}`,
        notes: [
          "POSITION/SV_POSITION 语义：顶点位置",
          "TEXCOORD0 语义：UV 坐标（可传任意数据）",
          "NORMAL 语义：法线方向",
          "UnityObjectToClipPos 将顶点变换到裁剪空间",
          "SV_Target 表示输出到渲染目标"
        ]
      }
    ]
  },
  {
    id: "shader-graph",
    title: "3. Shader Graph 可视化",
    sections: [
      {
        title: "Shader Graph 基础",
        content: `Shader Graph 是 Unity 的可视化 Shader 编辑器，不用写代码就能创建 Shader。适合美术和不熟悉代码的开发者。

**创建步骤：**
1. Project 右键 → Create → Shader Graph → URP/HDRP → Lit Shader Graph
2. 双击打开编辑器
3. 拖拽节点连线
4. Save Asset，在材质中选择你的 Shader`,
        code: `// Shader Graph 中常用的节点（概念说明）

// === 输入节点 ===
// Time        → 当前时间（用于动画）
// UV          → UV 坐标（用于纹理采样）
// Normal Vector → 法线方向
// Position    → 顶点位置

// === 数学节点 ===
// Add         → 加法
// Multiply    → 乘法
// Lerp        → 线性插值（混合两个值）
// Remap       → 重映射范围
// Saturate    → 钳制到 0-1

// === 纹理节点 ===
// Sample Texture 2D → 采样 2D 纹理
// Tiling And Offset → 控制纹理平铺和偏移

// === 常见效果示例（节点连接逻辑）==

// 溶解效果：
// Noise → Step(阈值) → Alpha Clip
// 阈值从 0 到 1 渐变 = 溶解动画

// 流光效果：
// UV.x + Time → 采样渐变纹理 → 叠加到颜色

// 水面波纹：
// UV + Sin(Time + UV * 频率) → 扰动采样`,
        notes: [
          "Shader Graph 适合 URP 和 HDRP 管线",
          "所有操作都是节点连线，所见即所得",
          "Blackboard 面板管理外部暴露的参数",
          "可以导出为代码查看生成的 HLSL",
          "复杂的 Shader 效果（如毛发、布料）还是需要手写"
        ]
      }
    ]
  }
];

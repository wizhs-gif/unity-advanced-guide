export const luaChapters = [
  {
    id: "lua-basics",
    title: "1. Lua 基础语法",
    sections: [
      {
        title: "Lua 是什么？为什么 Unity 要用 Lua？",
        content: `Lua 是一门轻量级的脚本语言，诞生于巴西里约热内卢大学。它以小巧、高效、易嵌入著称。

**为什么 Unity 项目要用 Lua？**
核心原因是**热更新**。Unity 的 C# 代码编译后是 IL 代码，在 iOS 上无法动态加载新的 IL（Apple 禁止 JIT）。但 Lua 是解释型语言，可以随时从服务器下载新的 Lua 脚本并执行。

**国内主流方案：**
- xLua（腾讯开源，最活跃）
- ToLua（以前很流行，维护较少）
- SLua（较少使用）

**Lua 的特点：**
- 语法极简，关键字只有 21 个
- 动态类型，不需要声明变量类型
- 垃圾回收，不需要手动管理内存
- 一等公民函数，支持闭包和协程
- 只有一种数据结构：table（表）`,
        code: `-- 你的第一个 Lua 程序
print("Hello, Unity!")

-- 变量（不需要声明类型）
local name = "Player"
local health = 100
local isAlive = true

-- 函数
local function greet(name)
    print("Hello, " .. name)
end

greet("Unity Developer")

-- 表（Lua 唯一的数据结构）
local player = {
    name = "Hero",
    health = 100,
    attack = function(self, target)
        target.health = target.health - 10
    end
}

print(player.name)  -- 输出: Hero
player:attack(enemy) -- 调用方法用 : 语法`,
        notes: [
          "Lua 的 .. 是字符串连接运算符，类似 C# 的 +",
          "local 关键字声明局部变量（推荐总是用 local）",
          "表（table）既是字典又是数组，万能数据结构",
          "用 : 调用方法时会自动传入 self 参数",
          "Lua 索引从 1 开始，不是 0！"
        ]
      },
      {
        title: "变量与数据类型",
        content: `Lua 是动态类型语言，变量不需要声明类型。有 8 种基本类型：nil、boolean、number、string、table、function、userdata、thread。

**number：** Lua 5.3 之前只有 double，5.3+ 支持 integer 和 float。
**string：** 不可变字符串，用单引号或双引号都可以。
**table：** 唯一的数据结构，当字典用也当数组用。
**nil：** 表示"没有值"，类似 C# 的 null。`,
        code: `-- 数字
local age = 25            -- 整数
local pi = 3.14           -- 浮点数
local hex = 0xFF          -- 十六进制

-- 字符串
local name = "Unity"
local msg = 'Hello'
local multi = [[
  多行字符串
  可以直接换行
]]

-- 字符串操作
local len = #name         -- 长度: 5
local upper = string.upper(name)  -- "UNITY"
local sub = string.sub(name, 1, 3) -- "Uni"
local format = string.format("HP: %d/%d", 80, 100)

-- 布尔
local isAlive = true
local isDead = false

-- nil
local nothing = nil       -- 没有值
print(nothing)            -- 输出: nil

-- 类型检查
print(type(age))          -- "number"
print(type(name))         -- "string"
print(type(isAlive))      -- "boolean"`,
        notes: [
          "Lua 的 number 默认是双精度浮点，5.3+ 区分整数和浮点",
          "字符串用 # 获取长度，不是 .length",
          "string.format 用 %d(整数) %s(字符串) %f(浮点)",
          "nil 是一个特殊值，表示变量未赋值",
          "type() 函数返回变量的类型名"
        ]
      },
      {
        title: "控制流",
        content: `Lua 的控制流语法和 C 系列语言差异较大，用 then/end 代替花括号。`,
        code: `-- if/elseif/else（注意是 elseif 不是 else if）
local health = 75

if health > 80 then
    print("健康")
elseif health > 30 then
    print("受伤")
else
    print("危险")
end

-- while 循环
local count = 0
while count < 5 do
    count = count + 1
    print(count)
end

-- repeat/until（类似 do/while，至少执行一次）
local num = 0
repeat
    num = num + 1
until num >= 5

-- 数字 for 循环
for i = 1, 10 do
    print(i)  -- 1 到 10
end

for i = 10, 1, -1 do
    print(i)  -- 10 到 1（倒序）
end

-- 泛型 for（遍历表）
local player = {name = "Hero", hp = 100, mp = 50}

for key, value in pairs(player) do
    print(key .. " = " .. tostring(value))
end

-- 遍历数组
local fruits = {"apple", "banana", "cherry"}
for i, fruit in ipairs(fruits) do
    print(i .. ": " .. fruit)
end

-- break 跳出循环（Lua 没有 continue）
for i = 1, 100 do
    if i > 10 then
        break
    end
end`,
        notes: [
          "if 后面必须加 then，结尾必须加 end",
          "Lua 用 elseif（连写），不是 else if",
          "for i = start, end, step 三参数格式",
          "pairs 遍历所有键值对，ipairs 遍历数组部分",
          "Lua 没有 continue，需要用 goto 或条件嵌套替代"
        ]
      },
      {
        title: "函数与闭包",
        content: `Lua 的函数是一等公民，可以赋值给变量、作为参数传递、作为返回值。闭包是 Lua 最强大的特性之一。`,
        code: `-- 基本函数
local function add(a, b)
    return a + b
end

print(add(3, 5))  -- 8

-- 多返回值
local function swap(a, b)
    return b, a
end

local x, y = swap(1, 2)
print(x, y)  -- 2  1

-- 可变参数
local function sum(...)
    local args = {...}
    local total = 0
    for _, v in ipairs(args) do
        total = total + v
    end
    return total
end

print(sum(1, 2, 3, 4))  -- 10

-- 闭包（函数捕获外部变量）
local function counter()
    local count = 0
    return function()
        count = count + 1
        return count
    end
end

local c = counter()
print(c())  -- 1
print(c())  -- 2
print(c())  -- 3

-- 函数作为参数（回调）
local function do_twice(fn, value)
    fn(value)
    fn(value)
end

do_twice(function(x)
    print("Hello " .. x)
end, "World")

-- 表中的方法
local Player = {}
Player.__index = Player

function Player.new(name)
    local self = setmetatable({}, Player)
    self.name = name
    self.hp = 100
    return self
end

function Player:take_damage(amount)
    self.hp = self.hp - amount
    print(self.name .. " HP: " .. self.hp)
end

local hero = Player.new("Hero")
hero:take_damage(20)  -- Hero HP: 80`,
        notes: [
          "函数用 function 定义，end 结束",
          "Lua 支持多返回值，用逗号分隔",
          "... 是可变参数，用 {...} 转为表",
          "闭包可以捕获外部的 local 变量",
          "setmetatable 是 Lua 实现面向对象的方式"
        ]
      }
    ]
  },
  {
    id: "lua-table",
    title: "2. Lua 表（Table）深入",
    sections: [
      {
        title: "表的基础操作",
        content: `表（table）是 Lua 唯一的数据结构，它既是数组又是字典。理解表是掌握 Lua 的关键。

**当数组用：** 索引从 1 开始，用 ipairs 遍历
**当字典用：** 键可以是任意类型（除了 nil），用 pairs 遍历`,
        code: `-- 当数组用
local fruits = {"apple", "banana", "cherry"}
print(fruits[1])        -- "apple"（索引从 1 开始！）
print(#fruits)          -- 3（长度）

table.insert(fruits, "date")     -- 末尾插入
table.insert(fruits, 2, "fig")   -- 在索引 2 插入
table.remove(fruits, 1)          -- 移除索引 1

-- 当字典用
local player = {
    name = "Hero",
    hp = 100,
    ["attack power"] = 25,  -- 键有空格用方括号
}

print(player.name)           -- "Hero"
print(player["attack power"]) -- 25

player.shield = 50           -- 动态添加字段
player.hp = nil              -- 删除字段

-- 嵌套表
local inventory = {
    weapons = {"sword", "bow", "staff"},
    potions = {health = 5, mana = 3},
    gold = 1000
}

print(inventory.weapons[1])     -- "sword"
print(inventory.potions.health) -- 5

-- 遍历
for i, v in ipairs(inventory.weapons) do
    print(i, v)
end

for k, v in pairs(inventory) do
    print(k, type(v))
end`,
        notes: [
          "Lua 数组索引从 1 开始，不是 0！",
          "table.insert 插入，table.remove 移除",
          "# 获取表的长度（只计算连续整数键部分）",
          "用 pairs 遍历字典，ipairs 遍历数组",
          "删除字段：将值设为 nil"
        ]
      },
      {
        title: "面向对象（Metatable）",
        content: `Lua 没有 class 关键字，用 metatable（元表）实现面向对象。这是 Lua 最独特的特性。`,
        code: `-- 定义类
local Enemy = {}
Enemy.__index = Enemy

-- 构造函数
function Enemy.new(name, hp, damage)
    local self = setmetatable({}, Enemy)
    self.name = name
    self.hp = hp or 100
    self.damage = damage or 10
    return self
end

-- 方法（用 : 自动传 self）
function Enemy:take_damage(amount)
    self.hp = self.hp - amount
    if self.hp <= 0 then
        self:die()
    end
end

function Enemy:die()
    print(self.name .. " 被击败了！")
end

function Enemy:attack(target)
    print(self.name .. " 攻击了 " .. target.name)
    target:take_damage(self.damage)
end

-- 继承
local Boss = setmetatable({}, {__index = Enemy})
Boss.__index = Boss

function Boss.new(name, hp, damage, phase)
    local self = setmetatable(Enemy.new(name, hp, damage), Boss)
    self.phase = phase or 1
    return self
end

function Boss:enrage()
    self.phase = self.phase + 1
    self.damage = self.damage * 2
    print(self.name .. " 进入狂暴阶段 " .. self.phase)
end

-- 使用
local slime = Enemy.new("Slime", 50, 5)
local dragon = Boss.new("Dragon", 500, 30, 1)

slime:attack(dragon)    -- Slime 攻击了 Dragon
dragon:enrage()          -- Dragon 进入狂暴阶段 2
dragon:attack(slime)     -- Dragon 攻击了 Slime`,
        notes: [
          "setmetatable(obj, mt) 设置元表",
          "__index 元方法：访问不存在的字段时触发",
          "Enemy.__index = Enemy 是标准的面向对象写法",
          "用 : 定义方法自动传入 self",
          "继承通过 setmetatable(Child, {__index = Parent}) 实现"
        ]
      }
    ]
  },
  {
    id: "lua-coroutine",
    title: "3. Lua 协程",
    sections: [
      {
        title: "协程基础",
        content: `Lua 内置了协程（coroutine），这是 Lua 最适合游戏开发的特性之一。协程可以暂停和恢复执行，非常适合实现游戏中的异步逻辑。

**协程 vs 线程：**
- 协程是协作式的，由程序员控制切换
- 线程是抢占式的，由操作系统控制切换
- 协程不需要锁，不会有竞态条件`,
        code: `-- 创建协程
local co = coroutine.create(function()
    print("协程开始")
    coroutine.yield()        -- 暂停
    print("协程恢复")
    coroutine.yield()        -- 再次暂停
    print("协程结束")
end)

print(coroutine.status(co))  -- "suspended"

coroutine.resume(co)         -- 输出: 协程开始
print(coroutine.status(co))  -- "suspended"

coroutine.resume(co)         -- 输出: 协程恢复
coroutine.resume(co)         -- 输出: 协程结束
print(coroutine.status(co))  -- "dead"

-- 协程传递数据
local co2 = coroutine.create(function(a, b)
    local sum = a + b
    coroutine.yield(sum)     -- 返回中间结果
    return sum * 2           -- 返回最终结果
end)

local ok, result = coroutine.resume(co2, 3, 5)
print(result)  -- 8（yield 的值）

ok, result = coroutine.resume(co2)
print(result)  -- 16（return 的值）

-- 生产者-消费者模式
local function producer()
    return coroutine.create(function()
        for i = 1, 5 do
            coroutine.yield(i)
        end
    end)
end

local function consumer(prod)
    local _, value = coroutine.resume(prod)
    while value do
        print("消费: " .. value)
        _, value = coroutine.resume(prod)
    end
end

consumer(producer())`,
        notes: [
          "coroutine.create 创建协程，coroutine.resume 恢复执行",
          "coroutine.yield 暂停协程，可以传递数据给 resume",
          "协程状态：suspended(暂停)、running(运行)、dead(结束)",
          "Lua 协程是单线程的，不会并行执行",
          "Unity 的 StartCoroutine 底层也是协程机制"
        ]
      }
    ]
  },
  {
    id: "lua-xlua",
    title: "4. xLua 集成实战",
    sections: [
      {
        title: "xLua 基础配置",
        content: `xLua 是腾讯开源的 Lua 解决方案，是目前 Unity 项目中最主流的热更新方案。

**xLua 的核心功能：**
- C# 调用 Lua
- Lua 调用 C#
- 热更新：修复 C# Bug 而不重新打包
- 生成代码绑定，性能接近原生

**安装步骤：**
1. 从 GitHub 下载 xLua 的 Unity Package
2. 导入到项目
3. 生成绑定代码（Generate Code）`,
        code: `// ===== C# 端配置 =====

using XLua;
using UnityEngine;

// 标记需要热更新的类
[LuaCallCSharp]
public class Player : MonoBehaviour
{
    public int Health = 100;
    public string PlayerName = "Hero";

    public void TakeDamage(int amount)
    {
        Health -= amount;
        Debug.Log($"{PlayerName} HP: {Health}");
    }

    // 虚方法，Lua 可以覆盖
    public virtual void OnDeath()
    {
        Debug.Log("Player died");
    }
}

// ===== Lua 端使用 =====

-- 加载 Lua 脚本
local luaEnv = CS.XLua.LuaEnv()
luaEnv:DoString(require('player_controller'))

-- Lua 访问 C# 对象
local player = CS.UnityEngine.GameObject.Find("Player")
local comp = player:GetComponent(typeof(CS.Player))

comp:TakeDamage(25)
print(comp.Health)  -- 75

-- Lua 覆盖 C# 方法
function comp:OnDeath()
    print("Lua: Player died! Restarting...")
    -- 热更新的逻辑写在这里
end`,
        notes: [
          "[LuaCallCSharp] 标记 C# 类让 Lua 可以访问",
          "[CSharpCallLua] 标记 Lua 回调的委托/接口",
          "Generate Code 生成绑定代码（编辑器菜单）",
          "luaEnv:DoString 执行 Lua 代码字符串",
          "require 加载 Lua 模块文件"
        ]
      },
      {
        title: "热更新实战",
        content: `热更新的核心流程：将需要热更的逻辑写在 Lua 中，C# 只做壳。发布后通过服务器下发新的 Lua 脚本来修复 Bug 或添加功能。

**热更新架构：**
- C# 层：框架代码、不常变的逻辑
- Lua 层：业务逻辑、UI、游戏玩法
- 资源层：AssetBundle，Addressables`,
        code: `// ===== C#：热更新入口 =====

using XLua;
using System.IO;
using UnityEngine;

public class HotFixManager : MonoBehaviour
{
    private LuaEnv luaEnv;

    void Start()
    {
        luaEnv = new LuaEnv();

        // 从 AB 或 Resources 加载 Lua 脚本
        luaEnv.AddLoader(CustomLoader);
        luaEnv.DoString("require 'main'");
    }

    // 自定义加载器：从文件或 AB 加载 Lua
    private byte[] CustomLoader(ref string filepath)
    {
        string path = Application.dataPath + "/Lua/" + filepath + ".lua";
        if (File.Exists(path))
        {
            return File.ReadAllBytes(path);
        }
        return null;
    }

    void OnDestroy()
    {
        luaEnv.Dispose();
    }
}

-- ===== Lua：main.lua（热更入口）=====

-- 加载游戏逻辑模块
local UIManager = require("ui_manager")
local BattleSystem = require("battle_system")
local QuestSystem = require("quest_system")

-- 初始化
UIManager.init()
BattleSystem.init()
QuestSystem.init()

print("热更新脚本加载完成！版本: 1.2.3")

-- 修复 Bug 示例：原来的伤害计算有误
function BattleSystem.calculate_damage(attacker, defender)
    -- 新的伤害公式
    local base_damage = attacker.attack - defender.defense * 0.5
    local crit = math.random() < attacker.crit_rate
    if crit then
        base_damage = base_damage * 1.5
    end
    return math.max(1, math.floor(base_damage))
end`,
        notes: [
          "C# 做框架，Lua 做业务逻辑",
          "CustomLoader 可以从文件系统或 AB 加载 Lua",
          "热更新时只需下载新的 Lua 文件，不需要重新打包",
          "版本号要管理好，避免新旧脚本混用",
          "iOS 平台只能用 Lua 热更新，不能用 IL2CPP + 反射"
        ]
      }
    ]
  }
];

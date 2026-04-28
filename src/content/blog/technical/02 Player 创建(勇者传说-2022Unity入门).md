---
title: 02 Player 创建(勇者传说-2022Unity入门)
date: 2026-02-01
updatedDate: 2026-02-01
description: 通过M_studio的勇者传说学习Unity入门基础
tags:
  - 游戏引擎
  - 入门学习
category: technical
collection: Unity
cover: https://i.ibb.co/tPc502kT/20260428152256.jpg
coverAlt: 预训练语言模型文章头图
coverSource: https://www.pixiv.net/artworks/143864385
coverColor: "#f389bc"
draft: false
---
[M_Studio的勇者传说-2022Unity入门](https://space.bilibili.com/370283072/lists/1187255?type=season) 主要是知识点整理笔记
# 02 Player 创建
## 2.1 设置人物与基本组件

### 2.1.1 人物组件的添加

给人物添加Rigidbody 2D(重力)和CapsuleCollider 2D(碰撞体积)组件.
点击CapsuleCollider 2D组件下的"Edit Collider2D"编辑.按住Shift可以以中心为标准来调整碰撞箱的范围.

调整Offset以调整人物碰撞箱锚点的位置.

在Rigidbody下的Constrains里冻结z轴的旋转.
Collision Detection设为continuous,以保证以后写代码方便进行探测.
![[Pasted image 20260219181838.png|300]]

### 2.1.2 平台组件的添加
给Platform添加Composite Collider 2D组件 (若Platform没有Rigidbody2D组件,unity会为你自动添加),使每一个瓦片的碰撞箱结合成一体,并将Rigidboay2D的Body Type设为Static来防止平台掉落。
![[Pasted image 20260219181927.png|300]]

## 2.2 创建及配置新输入系统

### 2.2.1 升级Input System

Edit/Project Settings/Player/Other Settings
修改如图所示两个选项
![[Pasted image 20260220211815.png]]

然后去PackageManager搜索input,下载如下package.
![[Pasted image 20260220211843.png]]

为Player添加Player Input组件并创建Input Actions.创建完毕删掉Player Input组件。![[Pasted image 20260220212002.png]]
在PlayerInputControl中勾选如图所示方框,然后点击Apply.就会生成同名C#脚本.
![[Pasted image 20260220212032.png|375]]


### 2.2.2 PlayerController脚本

```c#
using JetBrains.Annotations;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.InputSystem;

public class PlayerController : MonoBehaviour
{
    // Start is called before the first frame update
    public PlayerInputControl inputControl;
    public Vector2 inputDirection;
    private void Awake()
    {
        inputControl = new PlayerInputControl();
    }
    private void OnEnable()
    {
        inputControl.Enable();
    }
    private void OnDisable()
    {
        inputControl.Disable();
    }
    private void Update()
    {
        inputDirection = inputControl.GamePlay.Move.ReadValue<Vector2>();
    }
}

```

大概思路是创建一个 PlayerInputControl 的实例 inputControl，然后读取其中Gameplay.Move中的移动相关的向量.

  
下面的这个ReadValue<>方法可以单独拿出来记一记.
```c#
private void Update()
    {
        inputDirection = inputControl.GamePlay.Move.ReadValue<Vector2>();
    }
```

##  2.3 实现人物行为

### 2.3.1 人物移动与翻转
 使用速度来驱动物体，创建变量speed并输入值
![[Pasted image 20260221202457.png]]

在FixedUpdate() (持续性的按键情况，而如jump则是当作触发性的事件，减少性能开销) 中执行函数Move()，修改刚体速度，获取刚体组件 
```c#
 private void FixedUpdate()
 {
     Move();    
 }
public void Move()
{
     rb.velocity = new Vector2(speed * Time.deltaTime * inputDirection.x , rb.velocity.y);
     transform.localScale = new Vector3(inputDirection.x < 0 ? -1 : 1, 1, 1);
 }
```
在Unity编辑器中使用变量,以及如何通过修改变量来控制游戏角色的移动。获得自身组件的速度，修改速度。

在Unity中如何实现人物的左右移动和反转，包括使用transform组件和sprite renderer组件(只改变图层，不涉及刚体和碰撞体积)两种方法。
```
transform.localScale
```
使用localScale的方法需要注意人物图片的锚点位置和localScale的数值。

### 2.3.2 人物跳跃
实现人物跳跃，编辑按键，添加跳跃方法
![[Pasted image 20260221205023.png]]

施加力，纵轴跳跃，编写跳跃代码，注意按键状态和执行时机 
```c#
public float JumpForce;

   private void Awake()
   {
       inputControl = new PlayerInputControl();
       rb = GetComponent<Rigidbody2D>();
       inputControl.GamePlay.Jump.started += jump;
   }
   
    private void jump(InputAction.CallbackContext context)
 {
     // Debug.Log("Jump");
     rb.AddForce(transform.up * JumpForce, ForceMode2D.Impulse);
 }

```
将跳跃函数放在Awake()中执行，即给Jump.started注册一个jump事件函数,并且使用force mode的瞬时力方法实现跳跃 

修改gravity scale为4，测试舒适的手感
![[Pasted image 20260221205318.png|350]]

## 2.4 环境物理检测
实现人物跳跃的连续动作，以及如何检测人物周围的物理环境，包括地面和墙面等。同时，还介绍了如何写物理检查代码。

创建一个通用脚本，检测周围的物理环境 
![[Pasted image 20260223165717.png]]

使用2D物理检测方法实现物理检测，通过使用overlap circle方法，圆形检测范围判断碰撞箱之间是否接触，赋值给变量。
```c#
public void check()
{
   isGround = Physics2D.OverlapCircle((Vector2)transform.position + transform.localScale*bottomOffset, checkRadius, groundLayer);
}
```
其中设置选取合适的layer
![[Pasted image 20260223170011.png]]


选择人物脚底中心点作为坐标点，并设置检测范围，通过创建变量来访问组件，限制跳跃次数。 
```c#
private void jump(InputAction.CallbackContext context)
{
    // Debug.Log("Jump");
    if(physicsCheck.isGround)
        rb.AddForce(transform.up * JumpForce, ForceMode2D.Impulse);
}
```

限制人物的跳跃，通过改变脚底的位移差值来实现检测范围的绘制，并使用内置方法在窗口中绘制出球形检测范围，以便直接改动范围。
```c#
private void OnDrawGizmosSelected()
{
    Gizmos.DrawWireSphere((Vector2)transform.position + transform.localScale*bottomOffset, checkRadius);
}
```
![[Pasted image 20260223170232.png|156]]![[Pasted image 20260223170246.png|400]]

创建物理材质和避免人物粘在墙上。
![[Pasted image 20260223170345.png]]
## 2.5 创建人物动画
### 2.5.1 人物基本动画
 
制作人物的动画，也就是制作帧动画。创建新的文件夹保存所有的动画和动画控制器，给它起名叫做animations 
![[Pasted image 20260224183645.png]]
创建animator控制器，并打开界面
![[Pasted image 20260224183734.png]]

将人物动画并添加到animator中，并且调整采样率和播放速度
![[Pasted image 20260225145815.png]]
在这里可以显示采样率，并且改为帧显示。 

创建人物跑动动画并设置播放状态
![[Pasted image 20260225150333.png]]

在animator中可以连接各个animation，并且设置不同的条件进行状态切换
![[Pasted image 20260225150414.png]]
而使用exit time实现动画切换，不需要任何条件 
![[Pasted image 20260225150439.png]]
在parameters创建条件，以速度条件来切换跑步动画，
![[Pasted image 20260225151100.png|329]]![[Pasted image 20260225151117.png|350]]
创建新的C#脚本 PlayerAnimation，获得animator组件的使用权，控制人物动画切换
![[Pasted image 20260225151242.png|450]]

区分animator和animation的概念，要在脚本中获取animator的组件权限，要创建变量，animator的变量命名为animal缩写。 

```c#
private Animator anim;
private Rigidbody2D rb;
private void Awake()
{
    anim = GetComponent<Animator>(); 
    rb = GetComponent<Rigidbody2D>();
}
```

设置float变量值，同时创建一个函数来执行所有的动画切换，并输入set float括号中的变量名和具体值。在翻转时存在负值，使用绝对值函数来赋值
```c#
 private Animator anim;
 private Rigidbody2D rb;
 private void Awake()
 {
     anim = GetComponent<Animator>(); 
     rb = GetComponent<Rigidbody2D>();
 }
 private void Update()
 {
     SetAnimation();
 }
 public void SetAnimation()
 {
     anim.SetFloat("velocityX", Mathf.Abs(rb.velocity.x));  
 }
```
完成绑定和相互的操作
![[Pasted image 20260225152906.png]]

可以创建走路和跑步的动画，通过条件切换实现
![[Pasted image 20260225153952.png]]

### 2.5.2 跳跃动画

 使用Blend tree混合来创建多个阶段的动画
 ![[Pasted image 20260225163347.png]]
 
  在动画制作中使用float值和列表来添加动画片段和控制其转换速度，创建一个新的float值，名为velocityY。

跳跃的状态转换通过 velocityY 切换
![[Pasted image 20260225164724.png|400]]
使用代码填入控制动画的切换条件变量
```c#
public class PlayerAnimation : MonoBehaviour
{
    private Animator anim;
    private Rigidbody2D rb;
    private PhysicsCheck physicsCheck;
    private void Awake()
    {
        anim = GetComponent<Animator>(); 
        rb = GetComponent<Rigidbody2D>();
        physicsCheck = GetComponent<PhysicsCheck>();
    }
    private void Update()
    {
        SetAnimation();
    }
    public void SetAnimation()
    {
        anim.SetFloat("velocityX", Mathf.Abs(rb.velocity.x));
        anim.SetFloat("velocityY", rb.velocity.y);
        anim.SetBool("isGround",physicsCheck.isGround);
    }
}
```
并且设置animator中的转换过程，其中land可以设置为有速度就强制停止，避免细节落地后的蹲起的时候在跑步。
![[Pasted image 20260225164848.png]]

## 2.6 人物属性与伤害计算

添加敌人，即野猪的不同状态
![[Pasted image 20260227171557.png]]
调整野猪的Sorting Layer和Layer，使其与玩家在同一层中,但是优先级小于player

Sorting Layer
![[Pasted image 20260227171655.png]]

Layer
![[Pasted image 20260227171702.png]]

设置触发器，实现野猪和玩家互相穿越和穿过过程中发生事情的具体逻辑，即通过触发器检测实现攻击和伤害判定。
![[Pasted image 20260227171909.png]]\

给野猪设置两个不同的碰撞体，一个是矩形，一个是胶囊形，调整胶囊大小和方向。
![[Pasted image 20260227171925.png]]

同时添加碰撞剔除层，将角色之间的碰撞取消，避免堵塞。 
![[Pasted image 20260227173208.png|425]]

在脚本中，使用on trigger state2D方法检测碰撞触发器
```c#
 private void OnTriggerStay2D(Collider2D collision)
 {
     collision.GetComponent<Character>()?.TakeDamage(this);
 }
```

游戏性中需要计算血量增减、受伤和无敌，创建character代码,而在attack代码中使用on trigger state访问被攻击者，调用take damage函数计算伤害值 
```c#
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Character : MonoBehaviour
{
    [Header("基本属性")]
    public float maxHealth;
    public float currentHealth;

    [Header("受伤无敌")]
    public float invulnerableDuration;
    private float invulnerableCounter;
    public bool invulnerable;

    private void Start()
    {
        currentHealth = maxHealth;
    }
    private void Update()
    {
        if(invulnerable) { 
            invulnerableCounter -= Time.deltaTime;
            if(invulnerableCounter < 0 )
            {
                invulnerable = false;
            }
        }
    }
    public void TakeDamage(Attack attacker)
    {
        if (invulnerable)
            return;
        if(currentHealth - attacker.damage > 0)
        {
            currentHealth -= attacker.damage;
            TriggerInvulnerable();
        }
        else
        {
            currentHealth = 0;
        }
    }
    private void TriggerInvulnerable()
    {
        if(!invulnerable)
        {
            invulnerable = true;
            invulnerableCounter = invulnerableDuration;
        }
    }
}

```

在游戏中要实现碰撞后的单次伤害以及受伤无敌的判断算法，其中包括计时器的使用和状态的改变。

首先计算当前应该有的血量，先输出伤害值 
```c#
private void Start()
    {
        currentHealth = maxHealth;
    }
```
在游戏开始时，将当前血量设为max血量，减去受到的伤害
```c#
			 currentHealth -= attacker.damage;
            TriggerInvulnerable();
```
创建无敌时间和计时器变量，触发无敌状态，判断是否需要减少血量，通过在受到伤害后触发无敌，并在update中计时来缩减无敌时间。 

默认是false，一旦受到一次伤害就会触发无敌，无敌时间可以通过update计时器来缩减。而计时器计时结束后，将受伤无敌状态改回为false，再次接受伤害。最后判断当前血量是否足以触发受伤无敌，避免出现负数。
```c#
    private void Update()
    {
        if(invulnerable) { 
            invulnerableCounter -= Time.deltaTime;
            if(invulnerableCounter < 0 )
            {
                invulnerable = false;
            }
        }
    }
    public void TakeDamage(Attack attacker)
    {
        if (invulnerable)
            return;
        if(currentHealth - attacker.damage > 0)
        {
            currentHealth -= attacker.damage;
            TriggerInvulnerable();
        }
        else
        {
            currentHealth = 0;
        }
    }
    private void TriggerInvulnerable()
    {
        if(!invulnerable)
        {
            invulnerable = true;
            invulnerableCounter = invulnerableDuration;
        }
    }
```

## 2.7 角色动画逻辑实现与判定实装

### 2.7.1 受伤和死亡的逻辑和动画

1.受伤2种动画表现
在animation中创建受伤与死亡的动画效果
![[Pasted image 20260320111929.png]]
由于在任何动作情况下，角色都可能受伤，因此在Layer创建新的单独层可以覆盖到上一层的各个动作；
![[Pasted image 20260320112141.png|291]]

为给角色添加闪烁的受伤效果，在animation可以添加新的 property(性质)；修改如rgb值，并且在时间轴挑选时间点改动，过渡段就能创造出闪烁的效果
![[Pasted image 20260320112731.png]]
之后在animator中，重新在hurt layer创建并且标好条件
![[Pasted image 20260320113643.png]]

2.UnityEvent 使用方法
创建trigger触发器的功能，在 PlayerAnimation.cs 中,加入代码
```c#
public void PlayHurt()
{
    anim.SetTrigger("hurt");//触发hurt后执行
}
```
在character.cs中，使用unityevent的方法
```c#
 public UnityEvent<Transform> OnTakeDamage;
```
这样就能实现将各种想要实现的功能集成起来，只需要传入所需的参数
![[Pasted image 20260320114803.png]]
在代码中，执行unityevent需要使用固定的invoke方法，?. 能避免空值时候的错误，是一种固定写法。

3.受伤和死亡的函数
为了实现受伤就会反弹的效果，需要在PlayerController.cs中实现函数功能
```c#
public void GetHurt(Transform attacker)
{
    isHurt = true;  
    rb.velocity = Vector2.zero;
    Vector2 dir = new Vector2((transform.position.x - attacker.position.x), 0).normalized;
    rb.AddForce(dir*hurtForce, ForceMode2D.Impulse);

}
```
同时在animator中也可以创建用于控制人物状态的代码
![[Pasted image 20260320171222.png]]

同样，人物死亡也有事件方法，即 public UnityEvent onDie ; 并且触发 onDie?.Invoke();
在PlayerController.cs中，死亡即执行
```c#
public void PlayerDead()
{
    isDead = true;
    inputControl.GamePlay.Disable();
}
```

### 2.7.2 三段攻击动画
创建三段的攻击动画，为attack1、2、3；并且在animation中单独创建attack layer，权重也设置为1
![[Pasted image 20260320171831.png]]

创建布尔值 isattack，和用于触发多段攻击的触发器attack；设置对应的条件
![[Pasted image 20260320172102.png]]
在inputsystem中也加入攻击相关的输入，同时在playercontroller.cs和playeranimation中添加对应的代码
![[Pasted image 20260320173229.png]]

animator中，攻击退出后，将isattack也设置回去，也在动画状态上添加脚本
![[Pasted image 20260320173714.png]]

### 2.7.3 攻击效果实装
在攻击动画中，出现剑影的动画片段实装攻击效果，单独在角色的下面创建子集gameobject，添加上碰撞体还有触发器
![[Pasted image 20260320174619.png]]

添加多边形碰撞体
![[Pasted image 20260320174731.png|465]]
，并且勾选触发器
![[Pasted image 20260320174718.png|475]]

为防止攻击时的判定范围覆盖人物，伤到角色，在layers override中将人物本身进行排除；
![[Pasted image 20260320181140.png]]
同时，修改野猪也就是敌人身上碰撞体的优先级
![[Pasted image 20260320191323.png|375]]

使用光滑材质会导致人物移动距离位移，需要修改材质，避免这种情况，重新创建不一样的物理材质并且在代码中加变量来控制材质
```c#
[Header("物理材质")]
public PhysicsMaterial2D normal;
public PhysicsMaterial2D wall;

private void Update()
{
    inputDirection = inputControl.GamePlay.Move.ReadValue<Vector2>();
    CheckState();
}

public void CheckState()
{
    coll.sharedMaterial = physicsCheck.isGround ? normal : wall;
}
```

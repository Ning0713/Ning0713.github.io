---
title: 01 Unity 基本设置(勇者传说-2022Unity入门)
date: 2025-10-31
updatedDate: 2025-10-31
description: 通过M_studio的勇者传说学习Unity入门基础
tags:
  - 游戏引擎
  - 入门学习
category: technical
collection: Unity
cover: https://i.ibb.co/NQbFKCd/20260428190838.png
coverAlt: 空洞骑士
coverSource: https://wall.alphacoders.com/big.php?i=1361079
coverColor: "#284892"
draft: false
---
[M_Studio的勇者传说-2022Unity入门](https://space.bilibili.com/370283072/lists/1187255?type=season) 主要是知识点整理笔记
# 01 Unity 基本设置
## 1.1 Unity界面介绍

通过这个小图标可以开启/关闭 Gizmos的显示,下拉箭头可以调整Gizmos的相关参数.

![](https://i.ibb.co/KcJxY2G6/20260428183700.png) 
使创建物体起始坐标为(0,0,0)的设置.

![](https://i.ibb.co/vC9gmzDL/20260428183700-1.png)
将游戏"测试运行"时候改变窗口颜色设置,这样可以提示自己游戏正在测试中,这时候修改游戏参数是没用的.

## 1.2 素材导入

1.像素大小修改

对不一样的像素大小设计的图片修改每个单元内像素的大小。
![](https://i.ibb.co/21H7hpf2/20260428183700-2.png)
"Pixels Per Unit"改为16;"Filter Mode"改为"Point(no filter)";"Compression"改为"None".

﻿2.人物素材切片
﻿
打开Sprite Editor,Slice下的Type由"Automatic"改为"Grid By Cell Size",Pivot改为"Bottom",以将图片分切割成8X11的格子.点"应用",然后你的图片就会按照上面的大小被分成若干sprite图片文件了.
![](https://i.ibb.co/dszhySD4/20260428183700-3.png)

## 1.3 场景绘制和叠层设置

### 1.3.1 Tile Palette面板
![](https://i.ibb.co/ZzDgYpFb/20260428183700-4.png)
打开瓦片调色盘 Window->2D->Tile Palette.
Create一个新的Palette保存在Tile Map文件夹下.然后将之前切好的图片素材拖入到调色盘内,将新生成的瓦片存在Tiles文件夹下.

从下图中添加Tilemap.
![](https://i.ibb.co/PvvBCY3L/20260428183700-5.png)

之后会生成一个Grid和一个TileMap,TileMap是Grid的子集.之后你可以在Grid的子集下不断创建TileMap.

### 1.3.2 图层

调整Renderer下的Sorting Layer以调整图层的排序(与常规绘图软件不同的是Unity中的图层是越往下的图层越靠前)

调整Renderer下的Ordering Layer可以调整本图层中的图片的排序.

PS:前面两个杠可以手调图层顺序
![](https://i.ibb.co/84dSpTQM/20260428183700-6.png)
﻿
创建并整理Grid下的7个TileMap.
之后会发现可以在TilePalette界面选择对应的TileMap来进行绘制.
![](https://i.ibb.co/7dxP53D5/20260428183700-7.png)

另外将Focus On设置为Tilemap,这样预览界面就只会显示你正在绘制的Tilemap.
![](https://i.ibb.co/S4K9RhMK/20260428183700-8.png)

## 1.4 有规则和动态瓦片

### 1.4.1 规则瓦片
Rule Tile，可以制定带有规则的瓦片地图，便于模块化制作地图。
![](https://i.ibb.co/XxvRwLX4/20260428183700-9.png)

在上图位置创建Rule Tile.然后拖进palette即可.
![](https://i.ibb.co/9kyJjYKs/20260428183700-10.png)
关于Rule Tile的使用其实很简单，观察场景中每个瓦片与周围八格瓦片的规律,然后勾表示"有",叉表示"无"。给rule tile每个瓦片加上其对应的"规律"即可。

若存在一个位置,同时满足2个或以上瓦片的规律,则该位置unity会优先放置rule tile中位于上方的瓦片。

### 1.4.2 动态瓦片
Animated Tile，动态瓦片，可以制作带有帧变化效果的瓦片地图。
创建方式与rule tile相同.
![](https://i.ibb.co/LdBbKb7C/20260428183700-11.png)
可以在Animated Tile中为画出的瓦片产生动画效果
![](https://i.ibb.co/35fMZymD/20260428183700-12.png)

Tips:实际过程中由于对资产图片的分片，可能导致边缘划分的错误，出现瓦片间存在缝隙，露出背景的颜色，可以使用Sprite Atlas解决。

### 1.4.3 精灵图集
创建 Sprite Atlas（精灵图集）ps:在最后一章打包时会介绍，这里提前学了一下
这个方法会强制 Unity 重新生成一张大图，并在每个小瓦片周围自动填充一圈颜色(Padding)，这样就算**GPU**读偏了一点点，读到的也是填充的颜色，而不是透明缝隙。
1. **创建图集：**
    - 在 **Project** 窗口任意位置，右键点击 -> **Create** -> **2D** -> **Sprite Atlas**。
    - 命名为 `TileAtlas`。
2. **配置图集：**
    - 选中这个新文件，在右侧 **Inspector** 面板里设置：
    - **Filter Mode**: 改为 **Point (no filter)**。
    - **Compression**: 改为 **None**。
    - **Objects for Packing**: 点击列表右下角的 `+` 号，把贴图文件直接拖进去。
3. **生成：**
    - 点击最下方的 **Pack Preview** 按钮。
4. **不需要修改代码或场景：**
    - Unity 会在后台自动用这个新图集替换你场景里的旧贴图。回到场景看一眼，缝隙应该消失了。
![](https://i.ibb.co/FkHyV9jY/20260428183700-13.png)

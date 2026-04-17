# 组件文档

> 📖 本文档详细描述每个组件的公式、参数和使用方法。
>
> 🎯 基于 [math-curve-loaders](https://github.com/Paidax01/math-curve-loaders) 开源项目

## 目录

- [玫瑰线系列](#玫瑰线系列)
  - [RoseOrbit](#roseorbit)
  - [RoseCurve](#rosecurve)
  - [RoseTwo](#rosetwo)
- [螺旋线系列](#螺旋线系列)
  - [ThreePetalSpiral](#threepetalspiral)
  - [FourPetalSpiral](#fourpetalspiral)
  - [SpiralSearch](#spiralsearch)
- [心形线系列](#心形线系列)
  - [CardioidGlow](#cardioidglow)
  - [CardioidHeart](#cardioidheart)
  - [HeartWave](#heartwave)
- [其他曲线](#其他曲线)
  - [LemniscateBloom](#lemniscatebloom)
  - [OriginalThinking](#originalthinking)
  - [LissajousDrift](#lissajousdrift)
  - [HypotrochoidLoop](#hypotrochoidloop)
  - [ButterflyPhase](#butterflyphase)
  - [FourierFlow](#fourierflow)

---

## 示例

<demo vue="./math-curve-loaders.vue" title="MathCurveLoaders" />

## 玫瑰线系列

### RoseOrbit

玫瑰轨道曲线，产生动态的玫瑰形状动画。

**公式：**

```
r(t) = orbitRadius - detailAmplitude * detailScale * cos(petalCount * t)
x(t) = 50 + cos(t) * r(t) * curveScale
y(t) = 50 + sin(t) * r(t) * curveScale
```

**参数：**

| 参数              | 类型     | 默认值 | 说明                   |
| ----------------- | -------- | ------ | ---------------------- |
| `orbitRadius`     | `number` | `7`    | 轨道基础半径           |
| `detailAmplitude` | `number` | `2.7`  | 细节振幅，控制花瓣深度 |
| `petalCount`      | `number` | `7`    | 花瓣数量               |
| `curveScale`      | `number` | `3.9`  | 曲线缩放比例           |

**示例：**

```vue
<RoseOrbit :petalCount="5" :orbitRadius="10" />
```

---

### RoseCurve

经典玫瑰线，k=5 时产生五瓣玫瑰形状。

**公式：**

```
r(t) = (roseA + roseABoost * s) * (roseBreathBase + roseBreathBoost * s) * cos(roseK * t)
x(t) = 50 + cos(t) * r(t) * roseScale
y(t) = 50 + sin(t) * r(t) * roseScale
```

**参数：**

| 参数              | 类型     | 默认值 | 说明         |
| ----------------- | -------- | ------ | ------------ |
| `roseA`           | `number` | `9.2`  | 基础振幅     |
| `roseABoost`      | `number` | `0.6`  | 振幅增强系数 |
| `roseBreathBase`  | `number` | `0.72` | 呼吸基础值   |
| `roseBreathBoost` | `number` | `0.28` | 呼吸增强系数 |
| `roseK`           | `number` | `5`    | 花瓣数量     |
| `roseScale`       | `number` | `3.25` | 曲线缩放比例 |

**示例：**

```vue
<RoseCurve :roseK="7" :roseA="10" />
```

---

### RoseTwo

玫瑰线变体，k=2 时产生双瓣形状。复用 RoseCurve 组件。

**公式：** 同 RoseCurve，设置 roseK=2

**使用：**

```vue
<RoseCurve :roseK="2" />
```

---

## 螺旋线系列

### ThreePetalSpiral

三瓣螺旋曲线，R=3, r=1, d=3 时产生三瓣效果。

**公式：**

```
u(t) = ((R-r) cos t + d cos((R-r)t/r), (R-r) sin t - d sin((R-r)t/r))
m(t) = spiralScale + spiralBreath * detailScale
(x, y) = 50 + u(t) * m(t)
```

**参数：**

| 参数           | 类型     | 默认值 | 说明         |
| -------------- | -------- | ------ | ------------ |
| `spiralR`      | `number` | `3.0`  | 外圆半径     |
| `spiralr`      | `number` | `1.0`  | 内圆半径     |
| `spirald`      | `number` | `3.0`  | 偏移距离     |
| `spiralScale`  | `number` | `2.2`  | 基础缩放比例 |
| `spiralBreath` | `number` | `0.45` | 缩放增强系数 |

**示例：**

```vue
<ThreePetalSpiral :spiralR="4" /> <!-- 四瓣效果 -->
```

---

### FourPetalSpiral

四瓣螺旋曲线。复用 ThreePetalSpiral 组件，设置 spiralR=4。

**使用：**

```vue
<ThreePetalSpiral :spiralR="4" />
```

---

### SpiralSearch

阿基米德螺旋线变体，产生搜索雷达般的扫描效果。

**公式：**

```
θ(t) = searchTurns * t
r(t) = searchBaseRadius + (1 - cos t)(searchRadiusAmp + searchPulse * s)
x(t) = 50 + cos(θ) * r(t) * searchScale
y(t) = 50 + sin(θ) * r(t) * searchScale
```

**参数：**

| 参数               | 类型     | 默认值 | 说明         |
| ------------------ | -------- | ------ | ------------ |
| `searchTurns`      | `number` | `4`    | 旋转圈数     |
| `searchBaseRadius` | `number` | `8`    | 基础半径     |
| `searchRadiusAmp`  | `number` | `8.5`  | 半径振幅     |
| `searchPulse`      | `number` | `2.4`  | 半径脉冲系数 |
| `searchScale`      | `number` | `1`    | 整体缩放比例 |

**示例：**

```vue
<SpiralSearch :searchTurns="6" />
```

---

## 心形线系列

### CardioidGlow

标准心形线，心尖朝右。

**公式：**

```
r(t) = a(1 - cos t)
x(t) = 50 + cos(t) * r(t) * cardioidScale
y(t) = 50 + sin(t) * r(t) * cardioidScale
```

**参数：**

| 参数            | 类型     | 默认值 | 说明         |
| --------------- | -------- | ------ | ------------ |
| `cardioidA`     | `number` | `8.4`  | 基础振幅     |
| `cardioidPulse` | `number` | `0.8`  | 振幅脉冲系数 |
| `cardioidScale` | `number` | `2.15` | 整体缩放比例 |

**示例：**

```vue
<CardioidGlow />
```

---

### CardioidHeart

旋转心形线，心尖朝上。

**公式：**

```
r(t) = a(1 + cos t)
x(t) = 50 - sin(t) * r(t) * cardioidScale
y(t) = 50 - cos(t) * r(t) * cardioidScale
```

**参数：** 同 CardioidGlow

**示例：**

```vue
<CardioidHeart />
```

---

### HeartWave

心形波浪函数图像，产生动态的心跳效果。

**公式：**

```
f(x) = |x|^(2/3) + heartWaveAmp * √(heartWaveRoot - x²) * sin(heartWaveB * π * x)
screenX = 50 + x * heartWaveScaleX
screenY = 18 + (1.75 - f(x)) * (heartWaveScaleY + 1.5 * detailScale)
```

**参数：**

| 参数              | 类型     | 默认值 | 说明             |
| ----------------- | -------- | ------ | ---------------- |
| `heartWaveB`      | `number` | `6.4`  | 波形频率系数     |
| `heartWaveRoot`   | `number` | `3.3`  | 根号范围         |
| `heartWaveAmp`    | `number` | `0.9`  | 波形振幅         |
| `heartWaveScaleX` | `number` | `23.2` | X 轴缩放比例     |
| `heartWaveScaleY` | `number` | `24.5` | Y 轴基础缩放比例 |

**示例：**

```vue
<HeartWave :heartWaveB="8" />
```

---

## 其他曲线

### LemniscateBloom

双纽线（伯努利双纽线），产生无限符号形状。

**公式：**

```
scale = lemniscateA + detailScale * lemniscateBoost
denom = 1 + sin²(t)
x = 50 + scale * cos(t) / denom
y = 50 + scale * sin(t) * cos(t) / denom
```

**参数：**

| 参数              | 类型     | 默认值 | 说明             |
| ----------------- | -------- | ------ | ---------------- |
| `lemniscateA`     | `number` | `19`   | 双纽线参数 A     |
| `lemniscateBoost` | `number` | `7`    | 双纽线参数 Boost |

**示例：**

```vue
<LemniscateBloom />
```

---

### OriginalThinking

花瓣线变体，产生复杂的花瓣图案。

**公式：**

```
x = baseRadius * cos(t) - detailAmplitude * detailScale * cos(petalCount * t)
y = baseRadius * sin(t) - detailAmplitude * detailScale * sin(petalCount * t)
(x, y) = 50 + (x, y) * curveScale
```

**参数：**

| 参数              | 类型     | 默认值 | 说明     |
| ----------------- | -------- | ------ | -------- |
| `baseRadius`      | `number` | `7`    | 基础半径 |
| `detailAmplitude` | `number` | `3`    | 细节振幅 |
| `petalCount`      | `number` | `7`    | 花瓣数量 |
| `curveScale`      | `number` | `3.9`  | 曲线缩放 |

**示例：**

```vue
<OriginalThinking :petalCount="5" />
```

---

### LissajousDrift

利萨如曲线，X/Y 轴使用不同频率。

**公式：**

```
A = lissajousAmp + lissajousAmpBoost * detailScale
x(t) = 50 + sin(lissajousAX * t + lissajousPhase) * A
y(t) = 50 + sin(lissajousBY * t) * A * lissajousYScale
```

**参数：**

| 参数                | 类型     | 默认值 | 说明            |
| ------------------- | -------- | ------ | --------------- |
| `lissajousAmp`      | `number` | `24`   | 基础振幅        |
| `lissajousAmpBoost` | `number` | `6`    | 振幅增强系数    |
| `lissajousAX`       | `number` | `3`    | X 轴频率        |
| `lissajousBY`       | `number` | `4`    | Y 轴频率        |
| `lissajousPhase`    | `number` | `1.57` | 相位偏移 (弧度) |
| `lissajousYScale`   | `number` | `0.92` | Y 轴缩放比例    |

**示例：**

```vue
<LissajousDrift :lissajousAX="5" :lissajousBY="6" />
```

---

### HypotrochoidLoop

内摆线（Spirograph），产生复杂的花瓣状循环图案。

**公式：**

```
r = spiror + spirorBoost * detailScale
d = spirod + spirodBoost * detailScale
x(t) = 50 + ((spiroR - r) * cos(t) + d * cos((spiroR - r)/r * t)) * spiroScale
y(t) = 50 + ((spiroR - r) * sin(t) - d * sin((spiroR - r)/r * t)) * spiroScale
```

**参数：**

| 参数          | 类型     | 默认值 | 说明             |
| ------------- | -------- | ------ | ---------------- |
| `spiroR`      | `number` | `8.2`  | 固定外圆半径     |
| `spiror`      | `number` | `2.7`  | 内圆基础半径     |
| `spirorBoost` | `number` | `0.45` | 内圆半径增强系数 |
| `spirod`      | `number` | `4.8`  | 偏移距离基础值   |
| `spirodBoost` | `number` | `1.2`  | 偏移距离增强系数 |
| `spiroScale`  | `number` | `3.05` | 整体缩放比例     |

**示例：**

```vue
<HypotrochoidLoop :spiroR="10" />
```

---

### ButterflyPhase

蝴蝶曲线（Temple H. Fay），产生逼真的蝴蝶形状。

**公式：**

```
u = butterflyTurns * t
B(u) = e^{cos u} - butterflyCosWeight * cos 4u - sin^butterflyPower(u/12)
scale = butterflyScale + butterflyPulse * detailScale
x(t) = 50 + sin(u) * B(u) * scale
y(t) = 50 + cos(u) * B(u) * scale
```

**参数：**

| 参数                 | 类型     | 默认值 | 说明         |
| -------------------- | -------- | ------ | ------------ |
| `butterflyTurns`     | `number` | `12`   | 旋转圈数     |
| `butterflyScale`     | `number` | `4.6`  | 基础缩放比例 |
| `butterflyPulse`     | `number` | `0.45` | 缩放脉冲系数 |
| `butterflyCosWeight` | `number` | `2`    | cos 项权重   |
| `butterflyPower`     | `number` | `5`    | sin 幂次     |

**示例：**

```vue
<ButterflyPhase :butterflyTurns="10" />
```

---

### FourierFlow

傅里叶曲线，多频率三角函数叠加产生复杂图案。

**公式：**

```
m = fourierMixBase + fourierMixPulse * detailScale
x(t) = fourierX1 * cos(t) + fourierX3 * cos(3t + 0.6m) + fourierX5 * sin(5t - 0.4)
y(t) = fourierY1 * sin(t) + fourierY2 * sin(2t + 0.25) - fourierY4 * cos(4t - 0.5m)
```

**参数：**

| 参数              | 类型     | 默认值 | 说明              |
| ----------------- | -------- | ------ | ----------------- |
| `fourierX1`       | `number` | `17`   | X 轴 cos(t) 振幅  |
| `fourierX3`       | `number` | `7.5`  | X 轴 cos(3t) 振幅 |
| `fourierX5`       | `number` | `3.2`  | X 轴 sin(5t) 振幅 |
| `fourierY1`       | `number` | `15`   | Y 轴 sin(t) 振幅  |
| `fourierY2`       | `number` | `8.2`  | Y 轴 sin(2t) 振幅 |
| `fourierY4`       | `number` | `4.2`  | Y 轴 cos(4t) 振幅 |
| `fourierMixBase`  | `number` | `1`    | 混合参数基础值    |
| `fourierMixPulse` | `number` | `0.16` | 混合参数脉冲系数  |

**示例：**

```vue
<FourierFlow :fourierX1="20" :fourierY1="18" />
```

---

## 复用组件总结

以下组件可以通过设置参数复用：

| 目标组件        | 复用方式                            |
| --------------- | ----------------------------------- |
| RoseTwo         | `<RoseCurve :roseK="2" />`          |
| FourPetalSpiral | `<ThreePetalSpiral :spiralR="4" />` |
| FivePetalSpiral | `<ThreePetalSpiral :spiralR="5" />` |

---

## 致谢

本文档基于 [Paidax01/math-curve-loaders](https://github.com/Paidax01/math-curve-loaders) 项目。

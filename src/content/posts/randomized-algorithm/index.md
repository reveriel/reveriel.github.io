---
title: "randomized algorithm"
date: 2017-12-11
stage: 1
tags: []
summary: "总结"
---

## 概率算法

总结



## 基本概念

- 确定算法的平均执行时间: 一定输入规模的所有输入实例等概率出现时, 平均时间.
- 概率算法期望执行时间: 在某一个输入实例上的期望时间
- 概率算法的平均期望时间: 所有输入实例等概率的期望时间
- 概率算法的最坏期望时间: 最坏的输入实例上的期望时间

## 概率算法分类

* Numerical
  * 数值积分
* Monte Carlo
  * 给出一个答案，未必正确
* Las Vegas
  * 答案必定正确，耗时任意长, 可能_没有答案_. 比如吧 MenteCarlo 算法反复执行, 直至正确.
* Sherwood
  * 总是给出正确的答案, 把一个确定性算法随机化, 可以降低算法的最坏时间复杂度

## 数值积分

* HitorMiss 算法
  * 面积法, 长方形下函数面积
  * 在长方形区域取样, 计算有多少比例的点在函数下.
* Crude 算法
  * 积分区间函取值的平均.
* 梯形积分

## 概率計数

### 求集合的勢

设 $|X| = n$ , 有放回地随机抽元素, 设 $k$ 是出现第一次重复之前所选的元素数目. 则当 $n$ 足够大时, $k$ 的期望趋近于 $\beta \sqrt{n}$ ,

$\beta = \sqrt{\pi / 2} \approx 1.253$

$\beta\sqrt{n} = k$,  

时间复杂度 $\Theta(\sqrt{n})$ , 空间复杂度 $\Theta(\sqrt{n})$.

### 向量中不同对象数目的估计

例如,磁带上记录有莎士比亚全集, 统计其中使用了多少不同的单词. $N$ 是总单词书, $n$ 是不同词个数.

设 $U$ 是单词序列的集合, 设 $m = 5 + \lceil lg M \rceil$

let $h : U \mapsto \{0,1\}^m$ be a hash function. 将单词映射为长度为 $m$ 的串.

$y \in \{0,1\}^k$,  $y[i]$ denotes the $i$th bit.

Define $ \pi(y, b), b\in \{0,1\}$  表示满足 $y[i] = b$ 的最小的 $i$, 如果不存在, 返回 $k+1$

算法 WordCount() 用一个长为 $m+1$ 的向量 $y$ 统计所有单词的哈希.
单词 $x$,  set $y[\pi(h(x), 1)]$ to 1

==TODO==

时间 $O(n)$ , 空间 $O(\lg{}n)$

## Sherwood 算法

Sherwood 算法, 平滑不同输入实例的执行时间. 把一个确定性算法随机化, 可以降低算法的最坏时间复杂度.

一般 Sherwood 算法的组成:

1. 将输入变换到一个随机实例
2. 用确定算法得到随机实例的解
3. 将随机实例的解变换回原输入的解

例如快排 , 在特定输入下时间复杂度$O(n^2)$, 可以吧把输入变换到一个随机实例上.

**例**: 离散对数的计算.

​	 $ a = g^x \mod p$ , 已知p, g, a, 求 x,  记为 $\log_{g,p} a$

确定算法:  $\forall x \in \mathbb{Z}_p$ 计算所有的 $g^x$ 与 a 比较. 最坏为 $O(p)$



**例**: 搜索有序表.找x

随机找一个开始. 如果大于 x, 重来, 如果小于 x, 从这里开始顺序查找.

找 (前) $\sqrt{n}$ 个元素, 从小于 x 且最接近 x 的开始顺序查找. (对有序表的数据结构有要求)

## Las Vegas 算法

时间上界可能不存在, (像扔硬币, 如果结果不是正面就再扔).

假设 try(x) 成功的概率为 p(x), 成功的期望时间s(x), 失败时期望时间e(x)

```c
obstinate() {
  while (!try(x))
}
```

obstinate(x) 一定会成功, 设期望时间为t(x)

$t = ps + (1-p)(e+t)$

$t = s + \frac{1-p}{p}e$

### 八皇后



### 模 p 平方根

说实话, 课程PPT 实在是太糟糕了.

定义 $p$ is an (odd?, in course PPT, no problem, only '2' is even) prime,
 if $x \in [1, p-1]$, and for some y,

$$ x = y^2 \mod p$$

x is a *quadratic residue* modulo $p$, and y is the square root of x.

> wiki: an interger $q$ is called a *quadratic reside* modulo $n$ if it is congruent
> to a perfect square module $n$

**Theorem**: every quadratic residue module $p$ has at least two different square
root.

proof: easy, if $x_0^2 = y \mod p$ then $(p-x_0)^2 = y \mod p$.

**Theorem**: every quadratic residue module $p$ has at most two different square root.

proof:

$$
\begin{align} 
a^2 = b^2 \mod p \\
a^2 - b^2 \mod p \\
 p | (a+b) (a-b) \\
 \end{align}
$$
**Theorem**:  half of $\{1,2,\ldots, p-1\}$, is quadratic residue module $p$.

proof: every quadratic residue modulo $p$ has two square root,

[1, p-1]  (f x : x*x maps two from range to one in the image, and no overlap)

> I'll just write $=_p$ instead of $\mod p$

**Theorem**  $p$ is an odd prime, $x^{(p-1)/2} =_p \pm 1$ and $x$ is a
quadratic residue modulo $p$ iff  !!! PPT error!!

Maybe its:  $x^{(p-1)/2} =_p \pm 1$ iff $x$ is a quadratic residue modulo $p$?
I think so. proof by  $x^{(p-1)} =_p 1$, the Fermat Theorem

This can be used to check if a number is a quadratic residue.

**Question**: How to compute $x$'s square roots given it is a quadratic residue?

* if $p = 3 \mod 4$, they are $\pm x^{(p+1)/4}$
* if $p = 1 \mod 4$, there is no effeient determinat algorithm

Las Vegas algorithm:

We use $\sqrt{x}$ to denotes the smaller one of its square roots

<p style="color:red">TODO</p>



### 整数因数分解

$n$,   求 $n = p_1^{m_1} p_2^{m_2} \ldots p_k^{m_k}$

首先是素数判定, prime(n), 如果是合数, split(n), 找到 $n$ 的一个非平凡因数.

#### naive way to to split.

test all number from 2 to $\sqrt{x}$.

#### Dixon

这里我们把 二次剩余, quadratic residue 推广到合数.

一个模 $p$ 的二次剩余, 当 $p$ 为素数时, 恰好有两个不同的平方根; 当 $p$ 为合数, 且至少有**两个奇素数因子时, 不是这样. 例如 $8^2 = 13^2 = 22^2 =  27^2 = 29 \mod 35$


**Theorem**: If $x$ is a quadratic residue of $q$, then  $x$ and $q$ are
relatively prime

**Theorem**: If $n= pq$, $p$ and $q$ are two different primes, then every quadratic
residue of $n$ has exactly 4 square roots.

### 素数测定



* ​




## Monte Carlo 算法

Monte Carlo 算法偶尔会犯错, 但无论对何实例都能以高概率找到正确解(?), 当算法出错时, 没有警告信息.

**Def**  设 $p \in (\frac{1}{2}, 1)$ if an MC algorithm 以不小于 p 的概率返回一个正确解, 则该MC算法称为 p-正确. 算法的优势(advantage) 为 $p - \frac{1}{2}$

**Def** 若一个MC 算法对同一个实例不会给出两个不同的正确解, 则称该算法为 consistent.

**Def** **偏真算法**, 设 MC(x) 为一个解判定问题的算法. 对于任何 x, 如果 MC(x) 返回 true 时 永远是正确的, 返回 false 时 可能是错的.

**Def** **偏$y_0$算法**, 更一般的, 返回结果是 $y_0$ 就肯定是对的.



### 主元素问题





## 参考

[中科大算法分析与设计的总结 | 百度文库](https://wenku.baidu.com/view/26caaadb50e2524de5187ed0.html)

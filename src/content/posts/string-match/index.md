---
title: "string match"
date: 2017-12-13
stage: 1
tags: []
summary: "问题, Pattern, , Text  , 找 P 在 T 中的位置. Hash 函数  , 求 ,  与  的所有长度  的子串.
先比较 Hash, 如果 hash 值相等, 再精确比较."
---

问题, Pattern, $P : \Sigma^m$, Text $T : \Sigma^n$

$n \ge m$, 找 P 在 T 中的位置.

Hash 函数 $hash$ , 求 $hash(P)$,  与 $T$ 的所有长度 $m$ 的子串.
先比较 Hash, 如果 hash 值相等, 再精确比较.



要求是 hash 计算得快, 最好是 $hash(T[i, i+m-1])$ 可以从 $hash(T[i-1, i+m-2])$
在 $O(1)$ 的时间内算出来.

一种是 Rabin-Karp 的, hash 是多项式, $p$ 是一个素数.

$hash([a_1, a_2, \ldots, a_m]) = a_1 + a_2 \cdot p + a_3 \cdot p^2 + \ldots +
a_m \cdot p^{m-1}$

并行课本上的算法如下. 假设 $\Sigma = \{0, 1\}$,

> $$ f(0) = \begin{bmatrix} 1 & 0 \\ 1 & 1 \end{bmatrix},
> f(1) = \begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix}$$

> 取一个小于 $M$ 的素数$p$, $\mathbb{Z}_p$ 是整数环.
> $f_p(X) = f(X) \mod p$,

求 $f_p(T[i, i+m-1])$ ? 说实话, 书上根本没写清楚怎么算.

猜测应该是矩阵相乘.
$f([a_1, a_2, \ldots, a_m]) = f(a_1) \times f(a_2) \times \ldots \times f(a_m)$

试一下

``` python
import numpy as np
from functools import reduce

f = [np.empty((2,2), dtype=np.int64)] * 2
f[0] = np.array([(1,0), (1,1)])
f[1] = np.array([(1,1), (0,1)])

def hash(t):
    return reduce(lambda x,y: x.dot(y), map(lambda x: f[x], t))

print(hash([0,1,0,1]))
print(hash([1,1,0,1]))
```

``` log
[[2 3]
 [3 5]]
[[3 5]
 [1 2]]
```

而且我们知道 $f(0)^{-1} = \begin{bmatrix} 1& 0\\ -1& 1\end{bmatrix}$
$f(1)^{-1} = \begin{bmatrix} 1& -1\\0&1\end{bmatrix}$

串行执行的话, 使用这个hash, 算法复杂度是  $O$(Text的长度) , 我没有看出来上面的
$f_p$ 模 $p$ 的必要性. 暂且认为 $\mod p$ 的目的是防止结果溢出.

> 课本接下来说, 为了并行处理. 希望 hash算法也并行化. 这要求 hash 函数(对于字符串
> 连接操作)满足*同态*, 即 $hash([T, S]) = hash(X)\cdot hash(Y)$

显然上面的 $hash$ 是满足的要求的, 看书上又给出了什么吧:

> 定义
>
> $$g_p(0) = f_p(0)^{-1} \begin{bmatrix} 1& 0\\ p-1& 1\end{bmatrix},
g_p(1) = f_p(1)^{-1} \begin{bmatrix} 1& p-1\\ 0& 1\end{bmatrix}$$


因为 $\mathbb{Z}_p$ 中$p = -1$, 其实上面定义的$g_p$ 就是

$$g_p(0) = f_p(0)^{-1} \cdot f_p(0)^{-1},
 g_p(1) = f_p(1)^{-1} \cdot f_p(1)^{-1}$$

> $N_i = f_p(T[1,i])$
>
> $R_i = g_p(T[i]) g_p(T[i-1])\ldots g_p(T(1))$
>
> 容易看到 $f_p(T[i, i+m-1]) = R_{i-1} N_{i+m-1}$

得出的结论就是..课本少写了一个等号(无语), 实际上$g_p(\cdot) = f_p(\cdot)^{-1}$

并行算法就是先计算出所有的 $R_i$ and $N_i$, 这两个都类似前缀和, 可以并行计算.

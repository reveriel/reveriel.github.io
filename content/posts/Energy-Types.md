---
title: Energy Types
date: 2018-05-08 21:04:32
tags:
mathjax: true
---

# ENT language

<!--more-->
## Abstract Syntax

symbol 上的横线用来表示 这是个 list, 类似 BNF 里面 asterisk 的作用. (第一次见到这种写法)

**Terms**

$$P ::= D \, \overline{C}$$

Program is made of *mode declaration*s and  *classes*.  This is because ENT is derived from Java.

$$D ::= \overline{\mathtt{m} \le \mathtt{m}}$$

*mode declaration*s are an order relation on *mode*s.   $mathtt{m}$ is a mode's name.
A mode can used to represent an energy state. high energy mode, middle energy mode, low energy mode.

$$C ::= \mathbf{class}\; \mathtt{c}\; \Delta\; \mathbf{extends}\; \mathtt{c} \; \{\overline{F}\; \overline{M} \; A\}$$

*class*es  extends other classes. A class's body consists of *field*, *methods* and *attributor*. $\mathtt{c}$ is the name of some class.

$$F ::= T \; \mathtt{fd} = e$$

*field* is *Type* and *expression*,  $\mathtt{fd}$ is the field's name. These are Java things,
but the Type can be tagged with energy modes.

$$M ::= T \; \mathtt{md}(\overline{T}\; \overline{x}) \{e\}$$

*method*, $\mathtt{md}$ is the method's name.

$$A ::= e$$

*attributor*.  In ENT, if a class is declared to be dynamic (has type $?$), it must be associated with an attributor.
An atributor can be arbitrary Java code, allowing the object to inspect the class information at run time, and get the
runtime mode of the object.

$$\begin{aligned}e ::= & \; x \;|\; e.\mathtt{fd} \;|\; \mathbf{new}\; \mathtt{c}\langle \iota \rangle \;|\; e.\mathtt{md}(\overline{e}) \;|\; (T)e
\\| &  \; \mathbf{snapshot}\;e\;[\eta,\eta'] \;|\; \mathbf{mcase}\langle T\rangle\{\overline{m:e}\} \;|\; e \rhd \eta\end{aligned}$$

*expression*

$\mathbf{snapshot}$ take the mode of an expression $e$ and check if it in range $[\eta, \eta']$.

$\mathbf{mcase}$ 类似函数式编程里的 match 语句, 把 mode 映射到 expression.

$e \rhd \eta$ "the mode case elimination expression".
>In the concrete syntax, mode case elimination for local field access is implicitly represented as $\mathtt{depth \rhd X}$

???, 大概是说 class 的 field 的 mode 默认为 enclosing class 的 mode.

**Types**

$$T ::= \mathtt{c} \langle\iota\rangle \;|\; \mathbf{mcase}\langle T\rangle$$
*programmer type*,

$$\iota ::= \eta \;|\; ?, \eta$$
*object parameter list*.  $?$ is a dynamic type, its real type must(?) be determined by an attributor.


$$\eta ::= \mathtt{m} \;|\; \mathtt{md} \;|\; \top \;|\; \bot$$
*static mode* , $\mathtt{m}$ is mode name , $\mathtt{md}$ is method name.

$$\omega ::= \eta \le \mathtt{mt} \le \eta'$$
*constrained mode*,  $\mathtt{mt}$ is mode type variable.

$$\Delta ::= ? \to \omega, \Omega \;|\; \Omega$$
*class parameter list*

$$\Omega ::= \overline{\omega}$$
*constrained mode list*

**Type System Elements**

$$\mu ::= \eta \;|\; ?$$
*mode*

$$\tau ::= T \;|\; \exists \omega .\tau \;|\; \mathtt{modev}$$
*type*.  $\mathtt{modev}$ is  for typing attributor.

$$\Gamma ::= \overline{\mathtt{x} : \tau}$$
*typing environment*

$$\mathtt{K} ::= \overline{\eta \le \eta'}$$
*constraints*.



**Functions**

$\mathtt{mtype}(\mathtt{md}, T)$ return the signature for method $\mathtt{md}$ of object of type $T$.
This is Java, a method also belongs to some object or class.

$\mathtt{mtype}$ 这符号没必要. This can be expressed like this : $e : T \land e.\mathtt{md} : T_0$.
$\quad T_0$ is what $\mathtt{mtype}()$ returns.

$$\mathtt{omode}(\mathtt{c}\langle \iota \rangle ) \triangleq \mu \text{ if } \iota = \mu, \overline{\eta}$$

$\mathtt{omode}$ get the mode of an object of type $\mathtt{c}\langle \iota \rangle$,
it simply get the first mode in the mode list.


$$\begin{aligned} \mathtt{cmode} & (? \to \omega, \Omega)  \triangleq ? \\
\mathtt{cmode} & (\omega, \Omega)  \triangleq \omega
\end{aligned}$$

$\mathtt{cmode}$ gets the mode from a class parameter list. Return the first constrained mode.

Note the difference between a object's mode and a class's mode. an object's mode is a specific value.
but a class's mode is a range.

$\mathtt{mode}(P)$ represents all modes in the Program $P$.


**Expression Typing**

Definition: Judgment $\Gamma;\mathtt{K} \vdash e : \tau$, says expression
 $e$ has type $\tau$ under *typing environment* and *constraint set* $\mathtt{K}$.

Definition: $\Gamma(\mathtt{x})$ is the $\mathtt{x}$'s type in $\Gamma$.  这个也很没必要, $\Gamma \vdash \mathtt{x} : T$
不就能表示了么, 明明用大家熟悉的 relation 能够表达的, 偏要自己定义一个函数. 严格来说, 函数并不是能够随便定义的, 还要
先证明 $\forall x, y.\; x = y \Rightarrow f(x) = f(y)$.

Definition: $\mathtt{K}  \looparrowright \mathtt{K}'$, iff the reflexive and
transitive closure of $\mathtt{K}' \cup D$ is a subset of that of
 $\mathtt{K} \cup D$  .

What ???

$$
\begin{aligned}
&\mathtt{cons}(\overline{\eta \le \mathtt{mt} \le \eta'}) \triangleq
\cup \{\eta \le \mathtt{mt}, \mathtt{mt} \le \eta'\} \\
&\mathtt{cons}(? \to \omega, \Omega) \triangleq
\{\eta \le \mathtt{mt}, \mathtt{mt} \le \eta'\} \cup \mathtt{cons}(\Omega)
\quad\text{ if } \omega = \eta \le \mathtt{mt} \le \eta'
\end{aligned}
$$

cons 操作类似于格上求 join 或 meet.

Definition: Static Water fall Invariant
$$
\mathtt{sfall}(T, T', \mathtt{K})  \text{ iff }  \mathtt{K} \looparrowright \{\mathtt{omode}(T) \le \mathtt{omode}(T')\}
$$

不理解 $\looparrowright$ 就没法继续了.

**Typing Rules**

$$(\text{T-New})
 \frac{\iota = ?,\iota' \text{ iff }\mathbf{class}\ \mathtt{c}\ \Delta \cdots \in P \text{ and } \mathtt{cmode}(\Delta) = ?
 \qquad \mathtt{K} \looparrowright \mathtt{cons}(\Delta)}
{\Gamma;\mathtt{K} \vdash \mathbf{new}\;\mathtt{c} \langle \iota \rangle : \mathtt{c} \langle \iota \rangle}$$

$P$ ?, $P$ is implicit. We could write
$${\Gamma;\mathtt{K};P \vdash \mathbf{new}\;\mathtt{c} \langle \iota \rangle : \mathtt{c} \langle \iota \rangle}$$

So, how to interpreter this ? Why is there an $\text{iff}$ in the predicate?
Did the author put it in the wrong place?

<del>Maybe it says two things, a definition and a rule. </del> Not a definition. There's nothing new. 使用 $\text{iff}$
时, 如果一个左边引入新的符号, 则是一个定义; 如果没有新的符号, 看成一个逻辑连接符就行了.

$\text{iff}$ means, two judgements must both be true of false at the same time.


<!-- $$\iota = ?,\iota' \text{ iff } \mathbf{class}\ \mathtt{c}\ \Delta \cdots \in P \text{ and } \mathtt{cmode}(\Delta) = ?$$

$$(\text{T-New})
 \frac{\iota = ?,\iota' \qquad \mathtt{K} \looparrowright \mathtt{cons}(\Delta)}
{\Gamma;\mathtt{K} \vdash \mathbf{new}\;\mathtt{c} \langle \iota \rangle : \mathtt{c} \langle \iota \rangle}$$ -->


$\iota = ?,\iota'$ means that the first mode in the class's parameter list is $?$. This is a static type and is specified
in this new statement.

$\mathbf{class}\;\mathtt{c}\;\Delta \cdots \in P \text{ and } \mathtt{cmode}(\Delta) = ?$ means that the first mode in the class's
 definition's parameter list is $?$. This is a constraint type and is specified in the definition of the class.

This rule 说明  $\mathbf{new}\;\mathtt{c}\langle\iota\rangle : \mathtt{c}\langle\iota\rangle$ 也是有条件的.
$\looparrowright$ ???


$$(\text{T-Msg})\frac
{\Gamma;\mathtt{K} \vdash e : T_0 \qquad
\mathtt{mtype}(\mathtt{md}, T_0) = \overline{T} \to T \qquad
\Gamma;\mathtt{K} \vdash \overline{e} : \overline{T} \qquad
\mathtt{sfall}(T_0, \Gamma(\mathbf{this}), \mathtt{K})
}
{\Gamma;\mathtt{K} \vdash e.\mathtt{md}(\overline{e}) : T}
$$

函数调用.


$$
(\text{T-Snapshot}) \frac
{\Gamma;\mathtt{K} \vdash e : \mathtt{c}\langle?, \iota\rangle \qquad
\omega = \eta_1 \le \eta_2
}
{\Gamma;\mathtt{K}\vdash \mathbf{snapshot}\;e\;[\eta_1,\eta_2] : \exists\omega.\mathtt{c}\langle\mathtt{mt},\iota\rangle}
$$


Snapshot

最大疑点, 用 existential type 表示 dynamic type. 我从来就没见过 动态语言的 类型系统..


$$
(\text{T-MCase}) \frac
{\overline{\mathtt{m}} = \mathtt{modes}(P) \qquad
\Gamma;\mathtt{K} \vdash e_i : T \text{ for all } i
}
{\Gamma;\mathtt{K} \vdash \mathbf{mcase}\langle T \rangle \{\overline {\mathtt{m} : e}\} :  \mathbf{mcase} \langle T \rangle
}
$$

mcase

$$
(\text{T-ElimCase}) \frac
{\Gamma;\mathtt{K} \vdash e:\mathbf{mcase}\langle T\rangle\qquad
\eta \in \mathtt{modes}(P) \text{ or }\eta \text{ appears in } \mathtt{K}
}
{\Gamma;\mathtt{K} \vdash e \rhd \eta : T}
$$






## Reference


[1] [2] [3] 都是一个组做的工作.

[1] has phase and mode, while [3] only has mode. 虽然说 [3] 是基于 [1] 但是还是有很多不同的.


[[1] Energy Types -- OOPSLA'12](https://dl.acm.org/citation.cfm?id=2384676)

[[2] Understanding Energy Behaviors of Concurrent Programs -- OOPSLA'14](https://dl.acm.org/citation.cfm?id=2660235)
and [a short video (1min)](https://www.youtube.com/watch?v=rJxeHyjNeSA)

[[3] Proactive and Adaptive Energy-Aware Programming with Mixed Typechecking -- PLDI'17](dl.acm.org/citation.cfm?id=3062356)


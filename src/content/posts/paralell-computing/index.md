---
title: "paralell computing"
date: 2018-01-05
stage: 1
prerequisites: []
concepts: [paralell]
tags: []
summary: "data dependency statement S, T, **define** :
 depends on ,  must be executed before   if and only if one of the cases are true.  is a variable"
---

## paralell

data dependency

statement S, T,

**define** $S \,\delta\, T$:
$T$ depends on $S$, $S$ must be executed before $T$

$S\,\delta\,T$ if and only if one of the cases are true.

$x$ is a variable



1. **flow dependency**: $S\,\delta^f\,T$, if $x \in OUT(S)$, and $x \in IN(T)$.
    and $x$ is readed in $T$

    S: x = a + b

    T: y = x

    Read after wrtie.

2. **reverse dependency**: $S\,\delta^a\,T$, if $x \in IN(S)$ and $x \in OUT(T)$.
    and $S$ read $x$ before $T$ write to $x$

    S: r = x

    T: x = a + b

    Write after read.

3. **output dependency**: $S\,\delta^o\,T$, if $x \in OUT(S)$ and $x \in OUT(T)$.
    $S$ write to $x$ before $T$ write to $x$.

    S: x = a

    T: x = b

    Write after write.

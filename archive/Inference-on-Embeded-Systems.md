---
title: Inference on Embeded Systems
date: 2018-03-14 22:45:29
tags:
- paper-reading
---

# Sparsification and Separation.

key Contributions:
 * A sparse coding-based approach to optimize depp learning
inference execution.
 * Convolution kernel separation technique
 * The first to do Deep Learning Model on severely constrained wearable hardware.
 * implement a prototype,
 * experiment with for CNN and DNN models, 11.3x improvements in memory and 13.3x inexecution time. accuracy loss 5%

 <!--more-->

background:
DNN,  CNN(DNN with some convolutional layers)

local computation: privacy, independent of network condition.

Design Goals:
* No re-training
* No Cloud Offloading
* Low-resource platforms. only a few MBs of RAM.
* Minimize Model Changes

Three technique:
* Layer Compression Compiler, for Fully-connected layers
* Sparse Inference Runtime, load active layers only
* Convolution Separation Runtime, for Convolutional layers.


Fully-connected layers:

$f(\mathbf{b} + \mathbf{W} \cdot \mathbf{x})$

Convolutional Layers:

$f(\sum\mathbf{x} \ast \mathcal{K} + \mathbf{b} )$

Weight Factorization:

$W \cdot x$ , $W$ is m x n, if we factorize $M = U \cdot V$, $U$ and $V$ is
m x k, then compressed. Previous work use SVD.

This paper improved this by using Dictionary Learning. factorized
$M = B \cdot A$, $A$ is a sparse matrix.

Convolutional Layers:

d x d convolutional kernels factorized to d x k and k x d, use SVD.

choose k for specified accuracy, memory, and computation time:
  for each layer, use binary search to find one.

evaluation: ...















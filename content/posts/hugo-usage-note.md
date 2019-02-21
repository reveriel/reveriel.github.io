---
title: "Hugo Usage Note"
date: 2019-02-21T16:09:53+08:00
draft: true
---

Notes about how to use hugo.

<!--more-->
## Basics

Create a new post.

``` shell
hugo new posts/my-first-post.md
```

run server

``` shell
hugo server -D
```



`-D` for draft

## MathJax

$$\frac{a}{b}$$

在需要用到的 markdown 页面加上这个 :

``` html
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-AMS-MML_HTMLorMML">
</script>
```
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-AMS-MML_HTMLorMML">
</script>
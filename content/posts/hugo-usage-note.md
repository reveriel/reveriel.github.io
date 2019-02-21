---
title: "Hugo Usage Note"
date: 2019-02-21T16:09:53+08:00
draft:
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

## deploy

```
./deploy.sh
```

## MathJax

$$\frac{a}{b}$$

在需要用到的 markdown 页面加上这个 :

``` html
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-AMS-MML_HTMLorMML">
</script>
```
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-AMS-MML_HTMLorMML">
</script>

## javascript

```html
<p id = "count">  </p>

<script>
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    var pp = document.getElementById("count");

    async function b(){
        var a;
        for (a = 0; a < 100000; a++) {
            pp.textContent = a + ""
            await sleep(320)
        }
    }
    b();
</script>
```

<p id = "count">  </p>

<script>
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    var pp = document.getElementById("count");

    async function b(){
        var a;
        for (a = 0; a < 100000; a++) {
            pp.textContent = a + ""
            await sleep(320)
        }
    }
    b();
</script>

# Others

设置时的记录, 可以忘记了.

## 安装 hugo

``` shell
go get -v github.com/gohugoio/hugo
go install github.com/gohugoio/hugo
```

## 创建 site

``` shell
hugo new site quickstart
```

在 `~/site/quickstart` 创建目录.

## theme

adapted from https://themes.gohugo.io/hugo-primer/,
这个超简洁, 像我这样的前端白痴也敢动手改.

## host on GitHub

[doc](https://gohugo.io/hosting-and-deployment/hosting-on-github/)


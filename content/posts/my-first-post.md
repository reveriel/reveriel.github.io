---
title: "My First Post"
date: 2018-12-29T11:05:28+08:00
draft: true
---

Hugo 基础
<!--more-->

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



## 其他

### javascript

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
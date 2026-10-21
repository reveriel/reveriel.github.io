---
title: "始まりの物語"
date: 2017-03-01
stage: 1
tags: []
summary: "原来的文章写得毫无意义，而且更新了 hexo 之后连编译都过不了了。于是从零开始。 其实我更喜欢 LaTeX 的，这里只能用 MarkDown 和 <i
style=\"background-color:rgb(180, 40, 40);color:white;font-size:300%;\">HTML</i>)。 等等"
---

## 新的开始
原来的文章写得毫无意义，而且更新了 hexo 之后连编译都过不了了。于是从零开始。

其实我更喜欢 LaTeX 的，这里只能用 MarkDown 和 <i
style="background-color:rgb(180, 40, 40);color:white;font-size:300%;">HTML</i>)。

等等！如果能够使用 HTML, 那么 Javascript 。。。。

<button type="button" style="border:none;background-color:rgb(126,45,
176);padding:15px 32px;text-align:center; text-decoration: none; display:
inline-block; font-size 16px; margin: 4px 2px; cursor: pointer; color:white;"
onclick="document.getElementById('demo').innerHTML = Date()"> Click?</button>

<p id="demo" style="background-color:black;color:white;padding:10px;">O__O \\(^o^)/~  (ノಠ益ಠ)ノ彡┻━┻  ( ⊙ o ⊙ )  (ˇˍˇ)   ┑(￣Д ￣)┍ </p>

厉害了，图灵完备! 可以在这里放 JS 游戏了。。。

## 打算写些什么

日记有 OneNote，笔记和实验室做的事情用 Latex 记着，这里要写的话，就剩下课程和实
验室工作以外的东西了，比如个人兴趣之类的。

## 博客



### 引擎
[Hexo](https://hexo.io), markdown 生成静态网页，轻松部署到 Github。

### 主题
[NexT](http://theme-next.iissnan.com)

### 评论
[disqus](https://disqus.com), 多说评论挂了，Disqus 需要翻墙。



## Markdown 功能测试

### H3
#### H4
##### H5
###### H6

### 基本 markup
normal *ita* _ita_  **bold**  __underscores__, ~~strikethrough~~

[jump to google](https://google.com)

* item
* item

1. li
2. li

a * b,  a_b , a\\b

### 数学公式

[MathJax Ref](https://math.meta.stackexchange.com/questions/5020/mathjax-basic-tutorial-and-quick-reference)

新版本需要在frontmatter 里面加上 `mathjax: true` 才会加载 mathjax.

inline formulas:  `$a = \sum_{i=1}^{n} x_i$`
$a = \sum_{i=1}^{n} x_i$

displayed formulas:  `$$ \alpha ::= \tau \times \lambda $$`
$$ \alpha ::= \tau \times \lambda $$


### Warning!
默认 markdown 编译器是 hexo-renderer-marked, 对于`\\` `*` `_` 的翻译有 bug,

BUG:
混合 `_` and `$`

```
$a_1,  a_2$
```
$a_1,  a_2$


```
$a_0 a_{n-1}$
```
$a_0 a_{n-1}$


换一个renderer，在 [hexo 插件页](https://hexo.io/plugins/)上有几个选择。
 hexo-renderer-pandoc,  没问题了。

还有一个 [hexo-renderer-markdown-it](https://github.com/hexojs/hexo-renderer-markdown-it/), 没试.



```
$a\_0 a\_{n - 1} $
```

$a\_0 a\_{n - 1} $

$a\_0$


### Tables

| Tables        | Are             | Cool   |
| ------------- | :-------------: | -----: |
| col 3 is      | right-aligned   | $1600  |
| col 2 is      | centered        | $12    |
| zebra stripes | are neat        | $1     |


### 代码

incline `code`

``` ocaml
(*  invariant:          *)
(*  x,y = exgcd(a,b)    *)
(*  ax + by = gcd(a,b)  *)
let rec exgcd(a,b) : int * int =
  if a mod b = 0
  then 0, 1
  else let x,y = exgcd(b, a mod b) in
  y, x - y * (a/b);;
```

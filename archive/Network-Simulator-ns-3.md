---
title: 'Network Simulator: ns-3'
date: 2018-03-14 13:21:21
tags:
---

ns-3 is a Network simulator,

<!--more-->

working directory: `nico:workspace/ns3`

# preparation
Normally you need to download the source and build it. Compile failed on MacOS,
So I have to use Ubuntu.

Download `ns-allinone-3.27.tar.bz2`. Then `tar xf` it, and build it:

```
./build.py --enable-examples --enable-tests
```

or

    ./waf -d optimized --enable-examples --enable-tests configure

run example

    ./waf --run hello-simulator

in example/tutorial

# Concepts

four basic Concepts:

* `Node`: a machine, pc, router, switch
* `Application`: program
* `Channel`: between nodes
    * csma, p2p, wifi
* `NetDevice`: Network interface Card and driver.
* `Topology Helper`: attach NetDevice to Node and Channel, do configuration
    * `NodeContainer` create, access and manage `Node` objects

# Using ns-3

First read  `example/tutorial/first.cc` ( by the first line `-*- Mode:C++ `
I can see that the author uses Emacs! )

* Include headers

``` cpp
#include "ns/core-module.h"
#include "ns/network-module.h"
#include "ns/internet-module.h"
#include "ns/point-to-point-module.h"
#include "ns/applications-module.h"
```

A lot of modules...

* log component

`NS_LOG_COMPONET_DEFINE ("FirstScriptExample");`
This is  defined in log.h.

``` cpp
static ns3::LogCompoinent g_log = ns3::LogComponent(name, __FILE__)
```

logs need to be enabled.

``` cpp
LogComponentEnable("FirstScriptExample", LOG_LEVEL_INFO)
```

Use `NS_LOG_INFO ("what you want to say")` to print staff at info level

* Copmile and run the script

``` shell
cp examples/tutorial/first.cc scratch/myfirst.cc
./waf  # compile
./waf --run scratch/myfirst
``

But No output ..

So I rebuild ... something

``` shell
./waf configure -d debug
./waf
```

Now I can see the log output.

``` log
At time 2s client sent 1024 bytes to 10.1.1.2 port 9
At time 2.00369s server received 1024 bytes from 10.1.1.1 port 49153
At time 2.00369s server sent 1024 bytes to 10.1.1.1 port 49153
At time 2.00737s client received 1024 bytes from 10.1.1.2 port 9
```

* Command Line parser

``` shell
./waf --run "scratch/myfirst --PrintHelp"
./waf --run "scratch/myfirst --PrintAttributes=ns3::PointToPointNetDevice"
./waf --run "scratch/myfirst --ns3::PointToPointNetDevice:DataRate=5Mbps
   --ns3::PointToPointChannel::Delay=2ms"
```

``` cpp
uint32_t nPackets = 1;
CommandLine cmd;
cmd.AddValue("nPackets", "Number of packets to echo", nPackets);
cmd.Parse (argc, argv);
// ...
echoClient.SetAttribute ("MaxPackets", UintegerValue (nPackets));
```

* ASCII tracing

``` cpp
AsciiTraceHelper ascii;
pointToPoint.EnableAsciiAll (ascii.CreateFileStream ("myfirst.tr"));
```

Each line represents a trace event, four types of events

* +: an enqueue event happens on the device
* -: a dequeue event happens on the device
* d: a packet is dropped on the device
* r: the device receives a packet


* PCAP tracing

Enable PCAP(packet capture) tracing:

``` cpp
pointToPoint.EnablePcapAll ("myfirst");
```

output to `myfirst-0-0.pcap` and `myfirst-1-0.pcap`. numbers indicate node and device.

use `tcpdump` to show the trace

``` shell
tcpdump -nn -tt -r myfirst-0-0.pcap
```

## API use summary

To implement an ns-3 application.

1. create nodes
2. setup channel, installed on nodes
3. install protocol stack on nodes
4. allocate addresses for nodes
5. install program on nodes
6. start - stop

c++ is quite verbose. but it's ok once you get used to it. wifi 还有更细节的物理层的
设置, 比如 node 的位置和随时间的移动.

但是我还是觉得这种 API 设计挺糟糕的. 本来这些 API 都只是些设置的东西. 却要分成
这么多行代码. 新手需要记住需要哪些步骤, 需要以怎样的步骤来调用. 就算实际上各个参数
都有默认参数, 或者是顺序无影响, 也会给用户带来额外负担.

比如说 csmaHelper, 我能不能重复使用呢, 即按照一次后它自身的状态会变化吗? 另外 Helper
类的属性也不好用, 作者说是为了灵活性..

将有副作用和无副作用的 API 分开. 初始化模型用参数表来提示用户需要哪些前提参数, 多好.
属性就直接作为一个域放在类里, 不然编辑器IDE根本帮不上忙, 你完全不知道有哪些属性可以用.

`WifiNetDevice` 如果只能和 `WifiChannel` 在一起工作的话, 请用 Type System 约束一下,
或者不要让用户有这个能力把 `WifiNetDevice` 连上 `CsmaChannel`.

Topology 功能也感觉好复杂.

好的API的设计应该让我不用看文档就能直接仿照例子写自己的程序了.

用 json 或 xml 描述一下网络就能跑是最好了..

node, device, interface 都分散在各个变量中. 如果之后有时间, 大概
会创建一个类来保存这些信息.  (为什么库不提供啊!)

心累.. 还有好几个实验呢..







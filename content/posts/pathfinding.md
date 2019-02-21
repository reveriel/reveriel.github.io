---
title: pathfinding
date: 2018-01-09 18:12:43
tags:
---

from wiki

A pathfinding method searches a [graph](https://en.wikipedia.org/wiki/Graph_(data_structure)) by starting at one [vertex](https://en.wikipedia.org/wiki/Vertex_(graph_theory)) and exploring adjacent [nodes](https://en.wikipedia.org/wiki/Node_(computer_science)) until the destination node is reached.

<!--more-->

Two primary problems of pathfinding are (1) to find a path between two nodes in
a [graph](https://en.wikipedia.org/wiki/Graph_(data_structure)); and (2) the
[shortest path problem](https://en.wikipedia.org/wiki/Shortest_path_problem)—to
find the [optimal shortest
path](https://en.wikipedia.org/wiki/Shortest_path_problem). Basic algorithms
such as [breadth-first](https://en.wikipedia.org/wiki/Breadth-first_search) and
[depth-first](https://en.wikipedia.org/wiki/Depth-first_search) search address
the first problem by
[exhausting](https://en.wikipedia.org/wiki/Brute-force_search) all
possibilities; starting from the given node, they iterate over all potential
paths until they reach the destination node. These algorithms run in
$O(|V|+|E|)$, or linear time, where V is the number of vertices, and E is the
number of [edges](https://en.wikipedia.org/wiki/Edge_(graph_theory)) between
vertices.

The more complicated problem is finding the optimal path. The exhaustive
approach in this case is known as the [Bellman–Ford
algorithm](https://en.wikipedia.org/wiki/Bellman%E2%80%93Ford_algorithm), which
yields a time complexity of $O(|V||E|)$, or quadratic time. However, it is not
necessary to examine all possible paths to find the optimal one. Algorithms
such as [A*](https://en.wikipedia.org/wiki/A*_search_algorithm)and [Dijkstra's
algorithm](https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm) strategically
eliminate paths, either through
[heuristics](https://en.wikipedia.org/wiki/Heuristic_(computer_science)) or
through [dynamic
programming](https://en.wikipedia.org/wiki/Dynamic_programming). By eliminating
impossible paths, these algorithms can achieve time complexities as low as
$O(|E|\log⁡(|V|))$.

The above algorithms are among the best general algorithms which operate on a
graph without preprocessing. However, in practical travel-routing systems, even
better time complexities can be attained by algorithms which can pre-process
the graph to attain better performance. One such algorithm is [contraction
hierarchies](https://en.wikipedia.org/wiki/Contraction_hierarchies).



### Bellman-Ford algorithm



### Dijkstra's algorithm

begins with a start node and an "open set" of candidate nodes.

At each step, the node in the open set with the lowest distance from the start is examined. The node is marked "closed", and all nodes adjacent to it are added to the open set if they have not already been examined. This process repeats until a path to the destination has been found.

算法会找到从起始顶点到每个顶点(距离小于起始顶点到目标顶点最短路径)的最短路径.

Dijkstra's algorithm fails if there is a negative [edge](https://en.wikipedia.org/wiki/Edge_(graph_theory)) weight.

### A* algorithm



### Sample algorithm

```
  1 2 3 4 5 6 7 8
X X X X X X X X X X
X _ _ _ X X _ X _ X 1
X _ X _ _ X _ _ _ X 2
X S X X _ _ _ X _ X 3
X _ X _ _ X _ _ _ X 4
X _ _ _ X X _ X _ X 5
X _ X _ _ X _ X _ X 6
X _ X X _ _ _ X _ X 7
X _ _ O _ X _ _ _ X 8
X X X X X X X X X X

  1 2 3 4 5 6 7 8
X X X X X X X X X X
X _ _ _ X X _ X _ X 1
X _ X _ _ X _ _ _ X 2
X S X X _ _ _ X _ X 3
X 6 X 6 _ X _ _ _ X 4
X 5 6 5 X X 6 X _ X 5
X 4 X 4 3 X 5 X _ X 6
X 3 X X 2 3 4 X _ X 7
X 2 1 0 1 X 5 6 _ X 8
X X X X X X X X X X
```


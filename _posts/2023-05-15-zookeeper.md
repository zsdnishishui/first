随着分布式系统越来越多，数据一致性和单点故障的问题越来越突出。zookeeper应运而生。

学习：对于熟悉Linux系统的人，学习zookeeper比较容易，因为它涉及到文件系统的一些概念，比如文件目录、ACL权限

部署：为了保持高可用，一般都是集群部署。它们每个机器节点的数据都是一致的。它的部署也非常简单，自行百度就行。

特点：拥有监听器watcher机制。

应用：分布式锁、发布/订阅、配置中心、分布式协调、分布式队列、分布式事务

采用zookeeper分布式协调方案的软件：Kafka、Hadoop、Hbase

收集了几篇好文章：

[1.0 Zookeeper 教程](https://www.runoob.com/w3cnote/zookeeper-tutorial.html)

[https://archerzdip.github.io/%E5%88%86%E5%B8%83%E5%BC%8F%E6%95%B0%E6%8D%AE%E4%B8%80%E8%87%B4%E6%80%A7%E5%B7%A5%E4%B8%9A%E7%BA%A7%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88-Zookeeper-%E4%B8%80/](https://archerzdip.github.io/分布式数据一致性工业级解决方案-Zookeeper-一/)

[Zookeeper 分布式锁 （图解+秒懂+史上最全）](https://www.cnblogs.com/crazymakercircle/p/14504520.html)
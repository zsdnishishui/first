---
published: true
categories: 软件
---
最近在框架中整合了es组件，稍微了解了一下。

简介：是基于Lucene的搜索引擎，天生支持分布式（分片）

搭建过程踩过的坑：（1）如果是虚拟机安装的话，es的host不要写0.0.0.0，而要写服务器的ip,用于结点之间的通讯（2）服务器的可使用内存不要太小，不然会经常报GC的内存不足，而导致挂掉。（3）由于es的版本非常多，而且版本之间差别还比较大，所以一定要对应好版本。比如：kibana([Past Releases of Elastic Stack Software | Elastic](https://www.elastic.co/cn/downloads/past-releases))、elasticsearch-rest-high-level-client、springboot要和es的版本对应起来。

集成：（1）elasticsearch-rest-high-level-client：可以使用比较高级的搜索

（2）spring-boot-starter-data-elasticsearch：简单的增删改查，非常方便

（3）Elasticsearch-sql：用sql语句去查询es,比较方便，可惜的是只支持select

补充：es的主从，和redis的主从不太一样。

redis的一主两从，三台机器的数据是一样的。三主三从的主从的数据是一样的，但是三主的数据是分片存储的。

es的一主两从更加类似redis的三主的模式，因为es的数据是分片存储的。一个索引如果设置多个主分片，就会分结点存储。副分片主要起到数据备份和提升读取的性能。

可参考：

[一篇带给你ElasticSearch集群部署-51CTO.COM](https://www.51cto.com/article/701727.html)

https://developer.aliyun.com/article/1162139

https://www.modb.pro/db/435833

https://www.51cto.com/article/710213.html
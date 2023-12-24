---
published: true
categories: 软件
---
![img](https://picx.zhimg.com/80/v2-c567c8e690f72b6f12cf05dd9084a419_720w.png?source=d16d100b)





添加图片注释，不超过 140 字（可选）

这是一个轻量级的springboot应用的监控系统。包括客户端和服务端。客户端提供信息，服务端负责采集并展示信息。搭建过程可以参考：

[Spring Boot Admin，贼好使](https://blog.csdn.net/javalingyu/article/details/124086259)

搭建过程我踩了两个坑

（1）客户端总是下线状态。因为我没有搭建nacos,所以服务端直连的客户端，导致通过**域名**找不到服务。所以我改了本地的host文件中的127.0.0.1的映射的域名

```
127.0.0.1       DESKTOP-CPOBTK2.mshome.net
```

（2）找不到日志文件

解决方案可以参考

[Spring boot admin 日志](https://juejin.cn/post/7029291457060012062)

其实就是告诉客户端日志的绝对路径

![img](https://pic1.zhimg.com/80/v2-6ab0124f72f7d9fea39b3575d5457f9d_720w.png?source=d16d100b)





添加图片注释，不超过 140 字（可选）

我对SBA的总体感觉是比较轻量，小公司可以玩玩。但是作为企业级的应用多少还是差一些。

发现一个非常全的教程

[官方指标监控神器SpringBootAdmin保姆级教程_springboot hikari管理页面_Young丶的博客-CSDN博客](https://blog.csdn.net/agonie201218/article/details/118703742)

参考springboot actuator可以更好的理解SBA

[Spring boot--Actuator 详解](https://www.cnblogs.com/caoweixiong/p/15325382.html)
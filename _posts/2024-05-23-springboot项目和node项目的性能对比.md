---
published: true
categories: 软件
---
## 硬件

windows系统，12核16G内存

## 软件

1.简单的springboot项目

```
@GetMapping("/demoStr")
@ResponseBody
public Map demoStr() {
  return new HashMap();
}
```

2.node项目

https://github.com/mosliu/echarts5-canvas-ssr

## JMeter压测

1.  200的并发

springboot表现如下

![img](https://picx.zhimg.com/80/v2-ed8284fe64fb081a2c0bd4c5c63d1490_720w.png?source=d16d100b)





node的表现如下

![img](https://picx.zhimg.com/80/v2-52f5d257b6cce748fda8b924f19ecdc0_720w.png?source=d16d100b)





可见node稳如老狗

/2.  300的并发

springboot的表现如下，可见有的请求开始出现错误了

![img](https://picx.zhimg.com/80/v2-1b12560d7b5d5f53d1af3c500acd974c_720w.png?source=d16d100b)





node的表现如下，可见cpu虽然稳如老狗，但是错误率开始直线上升

![img](https://pic1.zhimg.com/80/v2-898b55f89c78cfe0a051653c19d13b44_720w.png?source=d16d100b)





## 结论

高并发下，java后端比node要吃资源，但是稳定性上要强一些。

通过分布式的部署方式可以大大改善node项目的缺陷，所以node项目更适合于分布式部署，毕竟它对资源的消耗是要小很多。

## 备注

有的同学会说node可以用多进程模式，来充分利用cpu的多核，但是经测试（300并发），作用不大

![img](https://picx.zhimg.com/80/v2-ca71ee9d8398b6b8fd8169f453028ab2_720w.png?source=d16d100b)





以下是通过nginx做的负载均衡，部署两套node项目（只是端口不一样），可见300的并发还是很稳

![img](https://pica.zhimg.com/80/v2-c5010ea3a56c2911c859b09e7d1d43bc_720w.png?source=d16d100b)





所以还是建议使用分布式部署方式
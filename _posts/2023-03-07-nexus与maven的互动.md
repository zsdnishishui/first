nexus一般是作为maven的私服使用，有的公司让他代理阿里云的中央仓库，有的公司只是存储自己的构件。

nexus的仓库分四种见下图

![img](https://pic1.zhimg.com/80/v2-3da388bf5bd7cb2f2a85044b1da0b732_720w.png?source=d16d100b)





添加图片注释，不超过 140 字（可选）

1.从nexus下载构件

1.1在pom.xml中配置

1.2在maven的setting.xml中配置（推荐这种）

通过profile进行配置

2.上传构件到nexus

http://c.biancheng.net/nexus/deployment.html

3.maven中央仓库的配置

```
<mirror>
      <id>aliyunmaven</id>
      <mirrorOf>central</mirrorOf>
      <name>阿里云公共仓库</name>
      <url>https://maven.aliyun.com/repository/public</url>
</mirror>
```

**注意：<mirrorOf>central</mirrorOf>不要写成<mirrorOf>\*</mirrorOf>**

**如果是\*的话，会拦截所有路径，就不走私服的路径了，导致找不到构件。**

4.maven常用的命令参数

```
-U,--update-snapshots                  强制更新releases、snapshots类型的插件或依赖库(否则maven一天只会更新一次snapshot依赖)
-T,--threads <arg>                     Thread count, for instance 2.0C where C is core multiplied
-P,--activate-profiles <arg>           激活指定的profile文件列表(用逗号[,]隔开)
```
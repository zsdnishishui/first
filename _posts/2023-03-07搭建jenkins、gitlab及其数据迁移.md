1.搭建jenkins

1.1准备安装环境

（1）java，git，maven要先安装好

（2）下载Jenkins的安装包

（3）Jenkins的环境配置和插件的安装

其中maven需要配置两个地方，见下图

![img](https://picx.zhimg.com/80/v2-874b54d0fa211bfbd403599759a3d03f_720w.png?source=d16d100b)





添加图片注释，不超过 140 字（可选）

![img](https://picx.zhimg.com/80/v2-b748b381bd6bdd01a561cbadc2be74a5_720w.png?source=d16d100b)





添加图片注释，不超过 140 字（可选）

1.2启动jenkins

```
cd /etc/init.d
./jenkins start
```

1.3访问地址

 举例：http://192.168.56.101:8080/

1.4构建完之后怎么把jar包传到远程服务器上

![img](https://pic1.zhimg.com/80/v2-0aa55c513d08a7607687ec01fc62a6a5_720w.png?source=d16d100b)





添加图片注释，不超过 140 字（可选）

如果想多传几个jar包，可以点击

![img](https://pic1.zhimg.com/80/v2-64fc83c625f4a9459d3aa870ab9bf0b9_720w.png?source=d16d100b)





添加图片注释，不超过 140 字（可选）

构建后之后jar包的位置在/var/lib/jenkins/workspace/下面

细节可参考：

https://www.cnblogs.com/javastack/p/13707127.html

2.gitlab进行数据迁移

2.1使用git clone、git push的方式（需要配置ssh的秘钥）

git clone 原project地址

cd 项目文件夹

从远处仓库获取所有分支

git branch -r | grep -v '\->' | while read remote; do git branch --track "${remote#origin/}" "$remote"; done

git remote rename origin old-origin git remote add origin git@192.168.56.103:***/**.git git push -u origin --all git push -u origin --tags

3.git提交代码，触发jenkins构建

可能会踩的坑

[解决gitlab添加webhook提示Url is blocked: Requests to the local network are not allowed的问题](https://blog.csdn.net/anqixiang/article/details/104968469)（root权限）

https://blog.csdn.net/chenglc1612/article/details/95696931

4.jenkins分布式构建（扩展）

https://www.cnblogs.com/gengxiaonuo/p/16923146.html
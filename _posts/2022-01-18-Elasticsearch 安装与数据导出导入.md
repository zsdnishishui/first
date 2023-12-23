## 1. 安装

### 1.1 环境准备

1.1.1 虚拟机安装

我用的是VirtualBox,当然你也可以用其它的。操作系统我用的是 centos7

![img](https://pica.zhimg.com/80/v2-3b4cb6a32c9b743a2072cb06f5735173_720w.jpg?source=d16d100b)






1.1.2 java8 环境安装 https://blog.csdn.net/pang_ping/article/details/80570011

注意修改 /etc/profile 文件（环境变量），并重新启用环境变量。

```
vi /etc/profile

source /etc/porfile
```

1.1.3 Elasticsearch 安装包下载

可以去官网https://www.elastic.co/cn/downloads/past-releases/elasticsearch-6-5-0下载，我下的是6.5.0，因为7.x版本的需要java11

### 1.2 开始安装

1.2.1 新建一个用户

1.2.2 root 用户解压安装包

```
tar -zxvf 包名
```

1.2.3 root 用户把解压之后的文件夹，移动到/home/你的用户名/es

```
mv  源地址  目的地址
```

1.2.4 把这个文件夹的所有者改成新用户

```
chown -R es:es  当前文件夹名
```

1.2.5 用新用户启动es

```
./elasticsearch
```

### 1.3 安装过程中遇到的问题及解决方案

1.3.1 安装空间不足

解决方案是扩容：参考 https://blog.csdn.net/xiaoxiangzi520/article/details/111291634

1.3.2 内存不足

扩大虚拟机的内存

![img](https://pica.zhimg.com/80/v2-8c0ca4e957430186d1cbd366b84eadfb_720w.jpg?source=d16d100b)






## 2. 数据导出

### 2.1 mapping 导出

我用的是  elasticsearch-head的复合查询功能，用postman,curl工具都可以。注意是get方法。

```
/索引名/_mapping
```

### 2.2 数据导出

我用的是python脚本导出的，后面会贴出脚本。导出的原理也是直接调用es的api。

## 3. 数据导入

### 3.1 新增索引

要把mapping一起导入，用PUT方法

```
/索引名

{
  "mappings": {
    "tbtp_exam_people_rel": {
      "properties": {
        "@timestamp": {
          "type": "date"
        },
        "@version": {
          "type": "text",
          "fields": {
            "keyword": {
              "type": "keyword",
              "ignore_above": 256
            }
          }
        },
        "client_id": {
          "type": "keyword"
        },
        "course_durations": {
          "type": "double"
        },
        "course_hours": {
          "type": "double"
        },
        "del": {
          "type": "keyword"
        },
        "exam_count": {
          "type": "text"
        },
        "exam_id": {
          "type": "keyword"
        },
        "exam_name": {
          "type": "text",
          "fields": {
            "keyword": {
              "type": "keyword",
              "ignore_above": 256
            }
          }
        },
        "exam_time": {
          "type": "date",
          "format": "yyyy-MM-dd HH:mm:ss"
        },
        "hash": {
          "type": "keyword"
        },
        "id": {
          "type": "keyword"
        },
        "org_id": {
          "type": "text",
          "fields": {
            "keyword": {
              "type": "keyword",
              "ignore_above": 256
            }
          }
        },
        "playback_progress": {
          "type": "integer"
        },
        "query": {
          "properties": {
            "match_all": {
              "type": "object"
            }
          }
        },
        "real_name": {
          "type": "text"
        },
        "reserve_field1": {
          "type": "keyword"
        },
        "reserve_field2": {
          "type": "keyword"
        },
        "reserve_field3": {
          "type": "keyword"
        },
        "score": {
          "type": "double"
        },
        "source_client": {
          "type": "text"
        },
        "source_sys": {
          "type": "keyword"
        },
        "use_time": {
          "type": "integer",
          "index": false
        },
        "user_0826": {
          "type": "double"
        },
        "user_name": {
          "type": "text"
        },
        "year": {
          "type": "long"
        }
      }
    }
  }
}
```

注：text与keyword的区别

text:提供了分词，但是不能全词匹配。

keyword:没有提供分词，但是可以全词匹配

### 3.2 删除索引

用DELETE方法

### 3.2 导入数据

我用的是python脚本，调用api，一行一行的导入。

这种方法适用数据量比较小，如果数据量大的话，可以改成是多线程导入。

### 3.3 查询数据

查看数据的工具elasticsearch-head

![img](https://pica.zhimg.com/80/v2-91bad32d8ae9f6bd5d8ce634627aa81c_720w.jpg?source=d16d100b)






### 3.4 导入与导出的python3脚本

单线程版

```
import json
import os
import sys
import time
import urllib.request

class exportEsData():
    size = 10000
    dirs = "C:\\Users\\abc\\Desktop\\es导入导出\\"  #保存数据的目录
    def __init__(self, url, index, type):
        self.url = url + "/" + index + "/" + type + "/_search"
        self.index = index
        self.type = type

    def exportData(self):
        print("export data begin...")
        begin = time.time()
        try:
            os.remove(self.dirs + self.index + "_" + self.type + ".json")
        except:
            fp = open(self.dirs + self.index + "_" + self.type + ".json", 'w', encoding='utf-8')
        msg = urllib.request.urlopen(self.url).read()
        print(msg)
        obj = json.loads(msg)
        num = obj["hits"]["total"]
        start = 0
        end = int(num / self.size) + 1
        while (start < end):
            msg = urllib.request.urlopen(self.url + "?from=" + str(start * self.size) + "&size=" + str(self.size)).read()
            self.writeFile(msg)
            start = start + 1
        print("export data end!!!\n\t total consuming time:" + str(time.time() - begin) + "s")

    def writeFile(self, msg):
        obj = json.loads(msg)
        vals = obj["hits"]["hits"]
        try:
            f = open(self.dirs+self.index + "_" + self.type + ".json", "a", encoding='utf-8')
            for val in vals:
                a = json.dumps(val["_source"], ensure_ascii=False)
                f.write(a + "\n")
        finally:
            f.flush()
            f.close()


class importEsData():
    dirs = "C:\\Users\\adb\\Desktop\\es导入导出\\"
    def __init__(self, url, index, type):
        self.url = url + "/" + index + "/" + type
        self.index = index
        self.type = type

    def importData(self):
        print("import data begin...")
        begin = time.time()
        try:
            f = open(self.dirs+self.index + "_" + self.type + ".json", "r",encoding='utf-8')
            i = 0
            for line in f:
                i = i + 1
                print(i)
                self.post(line.encode("utf-8"))
        finally:
            f.close()
        print("import data end!!!\n\t total consuming time:" + str(time.time() - begin) + "s")

    def post(self, data):
        req = urllib.request.Request(self.url, data, {"Content-Type": "application/json; charset=UTF-8"})
        urllib.request.urlopen(req)


if __name__ == '__main__':
    index = "****" #索引名
    type = "***"  
    exportEsData("http://*****:9200", index, type).exportData()  #导出数据
    
    importEsData("http://****:9200", index, type).importData()  #导入数据
```

大数据量导出，导入的多线程版

```
import json
import threading
import time
import urllib.request
from pip._vendor import requests
from concurrent.futures import ThreadPoolExecutor

def get_all_es_data(host,index,type):
    dirs = "C:\\Users\\**\\Desktop\\es导入导出\\"
    query = {}
    host = host + "/"
    i = 0
    # 每次取的数据量
    size = 10000
    scroll_id = None
    try:
        while size == 10000:
            if not scroll_id:
                query["size"] = size
                curr_url = host+index+"/"+type+"/" + '_search?scroll=1m'
                response = requests.post(curr_url, json.dumps(query), headers={'content-type': 'application/json'})
            else:
                curr_url = host + '_search/scroll?scroll=1m&scroll_id=' + scroll_id
                response = requests.get(curr_url)
            if response:
                response = json.loads(response.text)
                scroll_id = response['_scroll_id']
                response_data = [doc["_source"] for doc in response['hits']['hits']]
                size = len(response_data)
                print("import data begin..."+str(size))
                try:
                    f = open(dirs + index + "_" + type + "_"+str(i)+".json", "a", encoding='utf-8')
                    for val in response_data:
                        a = json.dumps(val, ensure_ascii=False)
                        f.write(a + "\n")
                    i = i + 1
                finally:
                    f.flush()
                    f.close()

    except Exception as err:
        pass
class myThread (threading.Thread):
    def __init__(self, name,host,index,type):
        threading.Thread.__init__(self)
        self.name = name
        self.host = host
        self.index = index
        self.type = type
    def run(self):
        importEsData(self.host, self.index, self.type,self.name).importData()

class importEsData():
    dirs = "C:\\Users\\**\\Desktop\\es导入导出\\"
    def __init__(self, url, index, type, name):
        self.url = url + "/" + index + "/" + type
        self.index = index
        self.type = type
        self.name = name

    def importData(self):
        print("import data begin...")
        begin = time.time()
        try:
            f = open(self.dirs+self.index + "_" + self.type + "_" + self.name +".json", "r",encoding='utf-8')
            i = 0
            for line in f:
                i = i + 1
                print("tread"+self.name+"--------"+str(i)+"\n")
                self.post(line.encode("utf-8"))
        finally:
            f.close()
        print("import data end!!!\n\t total consuming time:" + str(time.time() - begin) + "s")

    def post(self, data):
        req = urllib.request.Request(self.url, data, {"Content-Type": "application/json; charset=UTF-8"})
        urllib.request.urlopen(req)

if __name__ == '__main__':
    index = "****"
    type = "***"
    host = "http://***:9200"
    # host = "http://***:9200"
    # thread0 = myThread(0,host,index,type)
    # thread1 = myThread(1,host,index,type)
    # thread0.start()
    # thread1.start()
    # thread0.join()
    # thread1.join()
    # get_all_es_data(host,index,type)

    thread_pool = ThreadPoolExecutor(100)
    futures = []
    for i in range(68):
        thread = myThread(i,host,index,type)
        # sumit(方法名，参数)
        future1 = thread_pool.submit(thread.run)
        futures.append(future1)


    def get_call_back(future):
        # 监听任务执行结果，当前线程一直阻塞知道有结果，但是不阻塞主线程
        print(future.result())


    for future in futures:
        # 添加监听
        future.add_done_callback(get_call_back)

    print('main thread')
    thread_pool.shutdown()
```

### 3.5 利用bulk进行数据导出导入

参考：

[es数据导出导入（bulk篇）_weixin_33809981的博客-CSDN博客](https://blog.csdn.net/weixin_33809981/article/details/91537155)
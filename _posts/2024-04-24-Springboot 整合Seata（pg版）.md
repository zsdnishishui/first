---
published: true
categories: 软件
---
Seata是分布式事务的解决方案，采用的是服务端和客户端模式

## 安装Nacos

![img](https://picx.zhimg.com/80/v2-11cc65ae8395c1e3ea565015c03e547e_720w.png?source=d16d100b)






## 安装服务端seata-server

### 下载：[Releases · apache/incubator-seata (github.com)](https://github.com/apache/incubator-seata/releases)，我下载的是2.0.0版本，windows安装

### pg数据库建立一个seata-server的数据库，并建立4个表

```
-- -------------------------------- The script used when storeMode is 'db' --------------------------------
-- the table to store GlobalSession data
CREATE TABLE IF NOT EXISTS public.global_table
(
    xid                       VARCHAR(128) NOT NULL,
    transaction_id            BIGINT,
    status                    SMALLINT     NOT NULL,
    application_id            VARCHAR(32),
    transaction_service_group VARCHAR(32),
    transaction_name          VARCHAR(128),
    timeout                   INT,
    begin_time                BIGINT,
    application_data          VARCHAR(2000),
    gmt_create                TIMESTAMP(0),
    gmt_modified              TIMESTAMP(0),
    CONSTRAINT pk_global_table PRIMARY KEY (xid)
);

CREATE INDEX idx_status_gmt_modified ON public.global_table (status, gmt_modified);
CREATE INDEX idx_transaction_id ON public.global_table (transaction_id);

-- the table to store BranchSession data
CREATE TABLE IF NOT EXISTS public.branch_table
(
    branch_id         BIGINT       NOT NULL,
    xid               VARCHAR(128) NOT NULL,
    transaction_id    BIGINT,
    resource_group_id VARCHAR(32),
    resource_id       VARCHAR(256),
    branch_type       VARCHAR(8),
    status            SMALLINT,
    client_id         VARCHAR(64),
    application_data  VARCHAR(2000),
    gmt_create        TIMESTAMP(6),
    gmt_modified      TIMESTAMP(6),
    CONSTRAINT pk_branch_table PRIMARY KEY (branch_id)
);

CREATE INDEX idx_xid ON public.branch_table (xid);

-- the table to store lock data
CREATE TABLE IF NOT EXISTS public.lock_table
(
    row_key        VARCHAR(128) NOT NULL,
    xid            VARCHAR(128),
    transaction_id BIGINT,
    branch_id      BIGINT       NOT NULL,
    resource_id    VARCHAR(256),
    table_name     VARCHAR(32),
    pk             VARCHAR(36),
    status         SMALLINT     NOT NULL DEFAULT 0,
    gmt_create     TIMESTAMP(0),
    gmt_modified   TIMESTAMP(0),
    CONSTRAINT pk_lock_table PRIMARY KEY (row_key)
);

comment on column public.lock_table.status is '0:locked ,1:rollbacking';
CREATE INDEX idx_branch_id ON public.lock_table (branch_id);
CREATE INDEX idx_xid ON public.lock_table (xid);
CREATE INDEX idx_status ON public.lock_table (status);

CREATE TABLE distributed_lock (
    lock_key     VARCHAR(20)  NOT NULL,
    lock_value        VARCHAR(20)  NOT NULL,
    expire       BIGINT       NOT NULL,
    CONSTRAINT pk_distributed_lock_table PRIMARY KEY (lock_key)
);

INSERT INTO distributed_lock (lock_key, lock_value, expire) VALUES ('AsyncCommitting', ' ', 0);
INSERT INTO distributed_lock (lock_key, lock_value, expire) VALUES ('RetryCommitting', ' ', 0);
INSERT INTO distributed_lock (lock_key, lock_value, expire) VALUES ('RetryRollbacking', ' ', 0);
INSERT INTO distributed_lock (lock_key, lock_value, expire) VALUES ('TxTimeoutCheck', ' ', 0);
```

### Nacos添加配置（大坑）

![img](https://picx.zhimg.com/80/v2-c24de9607893a690403e7194502c1cb5_720w.png?source=d16d100b)






### 修改：D:\seata-server-2.0.0\seata\conf\application.yml

```
# 服务端口号
server:
  port: 7091
# 服务名称
spring:
  application:
    name: seata-server
# 服务日志
logging:
  config: classpath:logback-spring.xml
  file:
    path: ../runninglogs/logs/seata
  extend:
    logstash-appender:
      destination: 127.0.0.1:4560
    kafka-appender:
      bootstrap-servers: 127.0.0.1:9092
      topic: logback_to_logstash
# seata可视化界面登录的账号密码这里自己设置什么启动seata,到时候就用这个来登录（http://localhost:7091/#/sagastatemachinedesigner）
console:
  user:
    username: seata
    password: seata
 
# seata服务端配置
seata:
  service:
    vgroup-mapping:
         # 前面这个是组名(my-tx-group) :后面的是对应的集群名映射名（GZ） 这两个很重要到时候客户端要设置一致
         my-tx-group: GZ
    disable-global-transaction: true
  config:
    # 可设置的配置中心: nacos, consul, apollo, zk, etcd3
    type: nacos
    nacos:
      server-addr: 127.0.0.1:8848
      group: SEATA_GROUP
      username: nacos
      password: nacos123456
  registry:
    # 可设置的注册中心: nacos, eureka, redis, zk, consul, etcd3, sofa
    type: nacos
    nacos:
      application: seata-server
      group: SEATA_GROUP
      server-addr: 127.0.0.1:8848
      cluster: GZ  # 这个参数在每个微服务seata时会用到这是集群参数
      username: nacos
      password: nacos123456
  store:
    # 可设置的数据源: file 、 db 、 redis
    mode: db
    db:
      datasource: druid
      db-type: postgresql
      driver-class-name: org.postgresql.Driver
      url: jdbc:postgresql://192.168.56.101:5432/seata-server
      user: postgres
      password: postgres
      min-conn: 10
      max-conn: 100
      global-table: global_table
      branch-table: branch_table
      lock-table: lock_table
      distributed-lock-table: distributed_lock
      query-limit: 1000
      max-wait: 5000
# 将安全认证进行去除，因为可能会导致一定的问题
  security:
    secretKey: SeataSecretKey0c382ef121d778043159209298fd40bf3850a017
    tokenValidityInMilliseconds: 1800000
    ignore:
      urls: /,/**/*.css,/**/*.js,/**/*.html,/**/*.map,/**/*.svg,/**/*.png,/**/*.ico,/console-fe/public/**,/api/v1/auth/login
```

### 启动：D:\seata-server-2.0.0\seata\bin\seata-server.bat

启动成功之后可以访问UI

http://localhost:7091/#/transaction/list

## Springboot 整合客户端

### 引入Seata

```
 <!--注册中心客户端-->
        <dependency>
            <groupId>com.alibaba.cloud</groupId>
            <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
        </dependency>
        <!--配置中心客户端-->
        <dependency>
            <groupId>com.alibaba.cloud</groupId>
            <artifactId>spring-cloud-starter-alibaba-nacos-config</artifactId>
        </dependency>
        <!-- seata-->
        <dependency>
            <groupId>com.alibaba.cloud</groupId>
            <artifactId>spring-cloud-starter-alibaba-seata</artifactId>
        </dependency>
```

### 整合openfeign

```
<!--引入openfeign-->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-openfeign</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-loadbalancer</artifactId>
        </dependency>
```

### 启动数据源代理（大坑）

springboot的启动类上添加注解   @EnableAutoDataSourceProxy

### 配置文件添加Seata的配置

```
# seata配置
seata:
  enabled: true # spring 自动装配
  enable-auto-data-source-proxy: true # 开启数据源自动代理
  tx-service-group: my-tx-group #事务组名称 必须一定和你服务端配置的一样 必须 必须 必须
  application-id: ${spring.application.name}
  service:
    vgroup-mapping:
      default-tx-group: GZ  #事务组内容 须一定和你服务端配置的一样
      # 配置中心按照这个要求配置和服务端类似
  config:
    type: nacos
    nacos:
      group: SEATA_GROUP
      server-addr: 127.0.0.1:8848
      username: nacos
      password: nacos123456
      # 注册中心按照这个要求配置和服务端类似
  registry:
    type: nacos
    nacos:
      application: seata-server
      server-addr: localhost:8848
      username: nacos
      password: nacos123456
      cluster: GZ
      group: SEATA_GROUP
```

### 每个微服务的数据库添加一个undo_log表

建表语句

```
CREATE TABLE IF NOT EXISTS public.undo_log
(
    id            SERIAL       NOT NULL,
    branch_id     BIGINT       NOT NULL,
    xid           VARCHAR(128) NOT NULL,
    context       VARCHAR(128) NOT NULL,
    rollback_info BYTEA        NOT NULL,
    log_status    INT          NOT NULL,
    log_created   TIMESTAMP(0) NOT NULL,
    log_modified  TIMESTAMP(0) NOT NULL,
    CONSTRAINT pk_undo_log PRIMARY KEY (id),
    CONSTRAINT ux_undo_log UNIQUE (xid, branch_id)
);
CREATE INDEX ix_log_created ON undo_log(log_created);

COMMENT ON TABLE public.undo_log IS 'AT transaction mode undo table';
COMMENT ON COLUMN public.undo_log.branch_id IS 'branch transaction id';
COMMENT ON COLUMN public.undo_log.xid IS 'global transaction id';
COMMENT ON COLUMN public.undo_log.context IS 'undo_log context,such as serialization';
COMMENT ON COLUMN public.undo_log.rollback_info IS 'rollback info';
COMMENT ON COLUMN public.undo_log.log_status IS '0:normal status,1:defense status';
COMMENT ON COLUMN public.undo_log.log_created IS 'create datetime';
COMMENT ON COLUMN public.undo_log.log_modified IS 'modify datetime';

CREATE SEQUENCE IF NOT EXISTS undo_log_id_seq INCREMENT BY 1 MINVALUE 1 ;
```

### 添加注解  @GlobalTransactional(rollbackFor = Exception.class)

代码参考：[lianxi/lianxi-biz at main · zsdnishishui/lianxi](https://github.com/zsdnishishui/lianxi/tree/main/lianxi-biz)
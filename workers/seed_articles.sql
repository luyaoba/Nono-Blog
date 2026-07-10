-- 新增分类
INSERT OR IGNORE INTO categories (id, title, description, color_name, icon_type) VALUES
('java', 'Java开发', '深入 Java 语言核心机制、Spring Boot 微服务架构设计与高并发场景实践。', 'Java开发', 'cpu'),
('docker', '容器技术', 'Docker 容器化部署、Kubernetes 编排与云原生最佳实践指南。', 'Docker', 'rocket'),
('redis', '缓存与中间件', 'Redis 缓存策略、分布式锁、消息队列与高性能数据结构实战。', 'Redis', 'flame'),
('ai', 'AI 大模型', '大语言模型原理、Prompt Engineering、RAG 架构与 AI 应用开发。', 'AI', 'sparkles');

-- 新增标签
INSERT OR IGNORE INTO tags (id, name, slug, color) VALUES
('9', 'Java', 'java', 'from-orange-500 to-red-500'),
('10', 'Docker', 'docker', 'from-sky-500 to-blue-600'),
('11', 'Redis', 'redis', 'from-red-500 to-rose-600'),
('12', 'Spring Boot', 'spring-boot', 'from-green-500 to-emerald-600'),
('13', 'AI', 'ai', 'from-violet-500 to-purple-600'),
('14', '大模型', 'llm', 'from-indigo-500 to-blue-500'),
('15', 'Kubernetes', 'kubernetes', 'from-blue-500 to-cyan-600'),
('16', 'RAG', 'rag', 'from-purple-500 to-pink-500');

-- 新增文章（使用 CHAR(10) 作为换行符）
INSERT OR IGNORE INTO articles (id, title, summary, content, date, category, read_time, gradient, thumbnail_type, status, cover_image, views)
VALUES
('java-stream-api',
 'Java Stream API 实战：从入门到高性能集合处理',
 '深入解析 Java 8+ Stream API 的核心操作，包括 filter、map、reduce、collect 的底层原理与性能优化技巧，帮助你写出更优雅的 Java 代码。',
 '## 为什么选择 Stream API？' || CHAR(10) || CHAR(10) || 'Java Stream API 是 Java 8 引入的函数式编程利器，它让你可以用声明式的方式处理集合数据。' || CHAR(10) || CHAR(10) || '### 核心操作' || CHAR(10) || CHAR(10) || '```java' || CHAR(10) || 'List<String> names = users.stream()' || CHAR(10) || '    .filter(u -> u.getAge() > 18)' || CHAR(10) || '    .map(User::getName)' || CHAR(10) || '    .collect(Collectors.toList());' || CHAR(10) || '```' || CHAR(10) || CHAR(10) || '### 并行流性能优化' || CHAR(10) || CHAR(10) || '当数据量较大时，可以使用 `parallelStream()` 来利用多核 CPU：' || CHAR(10) || CHAR(10) || '```java' || CHAR(10) || 'long count = largeList.parallelStream()' || CHAR(10) || '    .filter(item -> item.isActive())' || CHAR(10) || '    .count();' || CHAR(10) || '```' || CHAR(10) || CHAR(10) || '### 注意事项' || CHAR(10) || CHAR(10) || '1. 避免在 Stream 中修改外部状态' || CHAR(10) || '2. 小数据集用串行流更合适' || CHAR(10) || '3. 注意 `findFirst()` 和 `findAny()` 的区别' || CHAR(10) || CHAR(10) || '## 高级用法' || CHAR(10) || CHAR(10) || '### 自定义 Collector' || CHAR(10) || CHAR(10) || '```java' || CHAR(10) || 'Collector<Employee, ?, Map<String, List<Employee>>> byDept =' || CHAR(10) || '    Collectors.groupingBy(Employee::getDepartment);' || CHAR(10) || '```' || CHAR(10) || CHAR(10) || 'Stream API 是现代 Java 开发的基石，掌握它可以显著提升代码质量和可维护性。',
 '2026-07-01', 'Java开发', 12, 'from-orange-500/20 to-red-500/20', 'gradient', 'published', NULL, 856),

('docker-multi-stage',
 'Docker 多阶段构建：打造极致轻量的生产镜像',
 '通过 Docker 多阶段构建（Multi-stage Build）将镜像体积缩小 90%，同时保持完整的构建流程，适用于 Go、Java、Node.js 等多种技术栈。',
 '## 什么是多阶段构建？' || CHAR(10) || CHAR(10) || '多阶段构建允许你在一个 Dockerfile 中使用多个 `FROM` 指令，每个阶段可以使用不同的基础镜像。' || CHAR(10) || CHAR(10) || '### 传统方式 vs 多阶段构建' || CHAR(10) || CHAR(10) || '```dockerfile' || CHAR(10) || '# 传统方式 - 镜像包含编译器和源码' || CHAR(10) || 'FROM node:20' || CHAR(10) || 'COPY . .' || CHAR(10) || 'RUN npm install && npm run build' || CHAR(10) || 'EXPOSE 3000' || CHAR(10) || 'CMD ["node", "dist/index.js"]' || CHAR(10) || '```' || CHAR(10) || CHAR(10) || '```dockerfile' || CHAR(10) || '# 多阶段构建 - 最终镜像仅含运行时' || CHAR(10) || 'FROM node:20-alpine AS builder' || CHAR(10) || 'WORKDIR /app' || CHAR(10) || 'COPY package*.json ./' || CHAR(10) || 'RUN npm ci' || CHAR(10) || 'COPY . .' || CHAR(10) || 'RUN npm run build' || CHAR(10) || CHAR(10) || 'FROM node:20-alpine' || CHAR(10) || 'WORKDIR /app' || CHAR(10) || 'COPY --from=builder /app/dist ./dist' || CHAR(10) || 'COPY --from=builder /app/node_modules ./node_modules' || CHAR(10) || 'EXPOSE 3000' || CHAR(10) || 'CMD ["node", "dist/index.js"]' || CHAR(10) || '```' || CHAR(10) || CHAR(10) || '### 体积对比' || CHAR(10) || CHAR(10) || '| 方式 | 镜像大小 |' || CHAR(10) || '|------|----------|' || CHAR(10) || '| 传统方式 | ~900MB |' || CHAR(10) || '| 多阶段构建 | ~80MB |' || CHAR(10) || CHAR(10) || '### Java 应用示例' || CHAR(10) || CHAR(10) || '```dockerfile' || CHAR(10) || 'FROM eclipse-temurin:21-jdk AS build' || CHAR(10) || 'COPY . .' || CHAR(10) || 'RUN ./gradlew bootJar' || CHAR(10) || CHAR(10) || 'FROM eclipse-temurin:21-jre' || CHAR(10) || 'COPY --from=build /build/libs/*.jar app.jar' || CHAR(10) || 'ENTRYPOINT ["java", "-jar", "app.jar"]' || CHAR(10) || '```' || CHAR(10) || CHAR(10) || '多阶段构建是生产环境 Docker 部署的最佳实践。',
 '2026-06-25', 'Docker', 10, 'from-sky-500/20 to-blue-600/20', 'gradient', 'published', NULL, 1203),

('redis-distributed-lock',
 'Redis 分布式锁实现方案与踩坑指南',
 '对比 Redisson、RedLock 和基于 Lua 脚本的三种分布式锁实现，分析各自的优缺点与适用场景，附带完整的生产级代码示例。',
 '## 为什么需要分布式锁？' || CHAR(10) || CHAR(10) || '在单体应用中，`synchronized` 或 `ReentrantLock` 就够了。但在分布式系统中，你需要跨进程的互斥机制。' || CHAR(10) || CHAR(10) || '### 基础实现' || CHAR(10) || CHAR(10) || '```java' || CHAR(10) || '// 获取锁' || CHAR(10) || 'Boolean locked = redisTemplate.opsForValue()' || CHAR(10) || '    .setIfAbsent("lock:order:123", "1", 30, TimeUnit.SECONDS);' || CHAR(10) || CHAR(10) || 'if (Boolean.TRUE.equals(locked)) {' || CHAR(10) || '    try {' || CHAR(10) || '        // 执行业务逻辑' || CHAR(10) || '        processOrder(orderId);' || CHAR(10) || '    } finally {' || CHAR(10) || '        // 释放锁（使用 Lua 脚本保证原子性）' || CHAR(10) || '        String script = "if redis.call(''get'',KEYS[1]) == ARGV[1] then " +' || CHAR(10) || '                        "return redis.call(''del'',KEYS[1]) else return 0 end";' || CHAR(10) || '        redisTemplate.execute(new DefaultRedisScript<>(script, Long.class),' || CHAR(10) || '            List.of("lock:order:123"), "1");' || CHAR(10) || '    }' || CHAR(10) || '}' || CHAR(10) || '```' || CHAR(10) || CHAR(10) || '### Redisson 方案' || CHAR(10) || CHAR(10) || '```java' || CHAR(10) || 'RLock lock = redissonClient.getLock("lock:order:" + orderId);' || CHAR(10) || 'try {' || CHAR(10) || '    if (lock.tryLock(5, 30, TimeUnit.SECONDS)) {' || CHAR(10) || '        processOrder(orderId);' || CHAR(10) || '    }' || CHAR(10) || '} finally {' || CHAR(10) || '    lock.unlock();' || CHAR(10) || '}' || CHAR(10) || '```' || CHAR(10) || CHAR(10) || '### 三种方案对比' || CHAR(10) || CHAR(10) || '| 方案 | 优点 | 缺点 |' || CHAR(10) || '|------|------|------|' || CHAR(10) || '| SETNX + Lua | 简单轻量 | 需手动处理续期 |' || CHAR(10) || '| Redisson | 功能完善、自动续期 | 依赖较重 |' || CHAR(10) || '| RedLock | 高可用 | 实现复杂、有争议 |' || CHAR(10) || CHAR(10) || '选择适合你业务场景的方案即可，不要过度工程化。',
 '2026-06-18', 'Redis', 15, 'from-red-500/20 to-rose-600/20', 'gradient', 'published', NULL, 2150),

('llm-rag-architecture',
 '从零搭建 RAG 系统：大模型 + 向量数据库实战',
 '完整实现一个 Retrieval-Augmented Generation（RAG）系统，涵盖文档分块、Embedding 向量化、ChromaDB 存储与 LangChain 编排的全流程。',
 '## 什么是 RAG？' || CHAR(10) || CHAR(10) || 'RAG（检索增强生成）通过先检索相关文档片段，再将其注入大模型的 Prompt 中，让模型基于真实数据生成回答，大幅减少幻觉。' || CHAR(10) || CHAR(10) || '### 架构概览' || CHAR(10) || CHAR(10) || '```' || CHAR(10) || '用户提问 → 向量化查询 → 检索相关文档 → 拼接 Prompt → LLM 生成回答' || CHAR(10) || '```' || CHAR(10) || CHAR(10) || '### 核心代码' || CHAR(10) || CHAR(10) || '```python' || CHAR(10) || 'from langchain.vectorstores import Chroma' || CHAR(10) || 'from langchain.embeddings import OpenAIEmbeddings' || CHAR(10) || 'from langchain.chains import RetrievalQA' || CHAR(10) || 'from langchain.llms import OpenAI' || CHAR(10) || CHAR(10) || '# 1. 文档分块' || CHAR(10) || 'from langchain.text_splitter import RecursiveCharacterTextSplitter' || CHAR(10) || 'splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)' || CHAR(10) || 'chunks = splitter.split_documents(documents)' || CHAR(10) || CHAR(10) || '# 2. 向量化存储' || CHAR(10) || 'vectorstore = Chroma.from_documents(' || CHAR(10) || '    chunks,' || CHAR(10) || '    OpenAIEmbeddings(model="text-embedding-3-small")' || CHAR(10) || ')' || CHAR(10) || CHAR(10) || '# 3. 构建 RAG 链' || CHAR(10) || 'qa = RetrievalQA.from_chain_type(' || CHAR(10) || '    llm=OpenAI(model="gpt-4"),' || CHAR(10) || '    retriever=vectorstore.as_retriever(search_kwargs={"k": 3})' || CHAR(10) || ')' || CHAR(10) || CHAR(10) || '# 4. 查询' || CHAR(10) || 'result = qa.invoke("这篇文章的核心观点是什么？")' || CHAR(10) || '```' || CHAR(10) || CHAR(10) || '### 优化策略' || CHAR(10) || CHAR(10) || '1. **混合检索**：结合关键词搜索和向量搜索' || CHAR(10) || '2. **重排序**：使用 Cross-Encoder 对检索结果重排' || CHAR(10) || '3. **Prompt 工程**：精心设计的 System Prompt 可以显著提升回答质量' || CHAR(10) || CHAR(10) || 'RAG 是当前大模型应用落地的最佳范式之一。',
 '2026-06-10', 'AI', 18, 'from-violet-500/20 to-purple-600/20', 'gradient', 'published', NULL, 3420);

-- 文章-标签关联
INSERT OR IGNORE INTO article_tags (article_id, tag_id) VALUES
('java-stream-api', '9'),
('java-stream-api', '12'),
('docker-multi-stage', '10'),
('docker-multi-stage', '15'),
('docker-multi-stage', '2'),
('redis-distributed-lock', '11'),
('redis-distributed-lock', '9'),
('redis-distributed-lock', '12'),
('llm-rag-architecture', '13'),
('llm-rag-architecture', '14'),
('llm-rag-architecture', '16');

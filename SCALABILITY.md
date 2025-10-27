# Scalability

This document explains recommended approaches to scale the Digantara project using Docker and Redis for queueing. Keep implementations incremental: start with multiple API/worker instances and move to managed services (Kubernetes, managed Redis) as load grows.

## Goals
- Scale API horizontally to handle more requests.
- Scale workers horizontally to process more scheduled/enqueued jobs concurrently.
- Ensure Redis and MongoDB are highly available and performant.

## Docker (containerization & orchestration)
- Use Docker to package the API and worker so instances are identical and portable.
- For local / small deployments:
  - Use docker compose to run multiple containers:
    - Build: docker compose up --build
    - Scale workers: docker compose up --build --scale worker=3
  - On Windows, use Docker Desktop with WSL2 backend. If you see named-pipe errors, ensure Docker Desktop is running and your terminal context is correct:
    - docker context use desktop-linux
    - Unset any incorrect DOCKER_HOST set in user environment.
- For production:
  - Prefer Kubernetes (EKS/GKE/AKS) or Docker Swarm for orchestration, autoscaling, and rolling updates.
  - Use Deployments/ReplicaSets (K8s) to scale API and worker pods independently.
  - Use resource limits/requests and horizontal pod autoscaler (HPA) based on CPU/queue length/latency.

## Redis (queue backend and scaling)
- Redis is used to back job queues (Bull/BullMQ). Key considerations:
  - Performance: use Redis instances on fast disks and sufficient memory.
  - High availability: use Redis Sentinel or Redis Cluster for HA and failover.
  - Persistence: enable RDB/AOF as appropriate for durability.
  - Separation: use dedicated Redis instance/DB for BullMQ to avoid interference with other caches.
- Scaling strategies:
  - Vertical scale (bigger instance) until you reach single-node limits.
  - Redis Cluster for sharding when dataset/throughput exceeds single-node capacity.
  - Use Redis replication + Sentinel (or managed Redis with HA) for fault tolerance.
- BullMQ specifics:
  - Set a connection pool and timeouts in production.
  - Use separate prefix/namespaces for queues if multiple apps share the same Redis.
  - Monitor queue metrics (waiting, active, completed, failed) and tune concurrency per worker.
  - Avoid long-running synchronous jobs inside worker — push work to specialized services if needed.

## Recommended architecture
- API
  - Multiple stateless API instances behind a load balancer (NGINX, ALB).
  - API only enqueues jobs and manages job records; heavy work handled by workers.
- Workers
  - Multiple worker instances (one or more process per container) reading from the same Redis-backed queue.
  - Configure per-worker concurrency based on CPU/memory and job type.
- Data stores
  - MongoDB: use replica set or managed Atlas for durability and read scaling.
  - Redis: managed/clustered Redis for HA and throughput.
- Observability
  - Centralized logging (ELK/EFK, Papertrail).
  - Metrics: Prometheus + Grafana, instrument worker queue length and job durations.
  - Redis monitoring: RedisInsight, Redis exporter for Prometheus.

## Deployment commands (examples)
- Local compose:
  - docker compose up --build
  - docker compose up --build --scale worker=3
- Kubernetes (example):
  - kubectl apply -f k8s/api-deployment.yml
  - kubectl scale deployment api --replicas=4
  - kubectl apply -f k8s/worker-deployment.yml
  - kubectl scale deployment worker --replicas=6

## Tuning tips
- Tune worker concurrency based on CPU-bound vs I/O-bound tasks.
- For I/O-heavy jobs, increase worker concurrency; for CPU-heavy, keep concurrency lower.
- Use rate-limiting and backpressure on the API to avoid overloading Redis or workers.
- Implement retries with exponential backoff for transient failures.

## Security & operations
- Restrict Redis access via network rules and authentication.
- Enable TLS for Redis if crossing network boundaries.
- Rotate credentials and store them in a secrets manager (K8s secrets, Vault).
- Use health checks and readiness probes for graceful scaling and deployments.

## Troubleshooting (Docker on Windows)
- Named pipe error: "open //./pipe/docker_engine: The system cannot find the file specified"
  - Ensure Docker Desktop is running.
  - In PowerShell: docker context use desktop-linux
  - Unset incorrect DOCKER_HOST: [Environment]::SetEnvironmentVariable('DOCKER_HOST', $null, 'User')
  - Start Docker service as admin if needed: Start-Service com.docker.service
- Redis connection errors:
  - Verify REDIS_HOST/REDIS_PORT env vars.
  - Test connectivity from containers: docker exec -it <container> sh && redis-cli -h <host> -p <port>

## Monitoring checklist
- Track queue metrics: waiting, active, delayed, failed.
- Alert on queue backlog growth and worker crashes.
- Monitor Redis memory usage and eviction rates.
- Monitor MongoDB primary/replica status and replication lag.

## Summary
- Containerize API and worker, run multiple replicas.
- Use Redis with HA (Sentinel/Cluster) and a managed approach as traffic grows.
- Move to orchestration (Kubernetes) for production-grade scaling, monitoring, and automated recovery.

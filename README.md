# DevOps POC: Git → Jenkins → Docker

A minimal Node.js service with tests, a Dockerfile, and a Jenkinsfile that:
1) checks out code from Git
2) runs tests
3) builds & pushes a Docker image
4) deploys the container

## Quick start (local)

```bash
# 1) Run the app locally
npm ci
npm test
npm start
# open http://localhost:3000 → {"status":"ok", ...}
```

## Jenkins in Docker (recommended for POC)

> These commands run Jenkins with access to the host's Docker daemon.

```bash
# Install Docker (if needed) then run Jenkins
docker run -d --name jenkins \
  -p 8080:8080 -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v $(which docker):/usr/bin/docker \
  -u root \
  jenkins/jenkins:lts

# Get admin password
docker exec -it jenkins cat /var/jenkins_home/secrets/initialAdminPassword
# Open http://<server>:8080 and finish setup (install suggested plugins)
```

### Jenkins configuration

1. **Create Docker Hub credentials**:  
   - In Jenkins → *Manage Credentials* → add **Username with password**  
   - ID: `dockerhub` (must match Jenkinsfile)  
   - Username: your Docker Hub username  
   - Password: Docker Hub **Access Token** (recommended)

2. **Create a new Pipeline job**:
   - Type: **Pipeline**
   - Definition: **Pipeline script from SCM**
   - SCM: your Git provider (GitHub/GitLab/Bitbucket)
   - Repository URL: your repo URL
   - Script Path: `Jenkinsfile` (default)

3. **(Optional) Webhook for auto-builds**:
   - In your Git repo, add a webhook to `http://<jenkins>/github-webhook/` (requires GitHub + plugin)
   - Or use **Poll SCM** if webhooks aren't possible

4. **First run**: Start a build. Jenkins will:
   - run `npm ci && npm test` inside a `node:18-alpine` container
   - build a Docker image
   - push to Docker Hub (`latest` and build number tags)
   - (re)start a container named `devops-poc` on the Jenkins host

### Verify deployment

```bash
curl http://<jenkins-host>:3000/
# → {"status":"ok","service":"devops-poc","env":"production"}
docker ps | grep devops-poc
```

## Files

- `index.js` — Express HTTP service
- `*.test.js` — Jest tests
- `Dockerfile` — production image (only prod deps)
- `Jenkinsfile` — CI/CD pipeline
- `.dockerignore` and `.gitignore` — keep images lean and repos clean

## Notes

- Change `DOCKERHUB_REPO` in Jenkinsfile to your repo, e.g. `yourname/devops-poc`.
- The deploy stage runs the container on the **Jenkins host**. For remote hosts, use the SSH Agent or a separate deploy job.
- For multi-env (dev/stage/prod), add branches or params and tag images like `:dev-<build>`, `:prod-<git-sha>`.
- To use a private registry, replace Docker Hub login/push commands accordingly.
```

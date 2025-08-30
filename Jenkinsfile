// Jenkins Declarative Pipeline: Git → Test → Build Docker → Push → Deploy
pipeline {
  agent any

  environment {
    DOCKERHUB_REPO = "YOUR_DOCKERHUB_USERNAME/devops-poc" // <-- change me
    IMAGE_TAG = "${env.BUILD_NUMBER}"
  }

  options {
    timestamps()
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install deps & Test (Node in Docker)') {
      steps {
        sh '''
          docker run --rm -v "$PWD":/workspace -w /workspace node:18-alpine sh -lc "
            npm ci &&
            npm test
          "
        '''
      }
    }

    stage('Build Docker image') {
      steps {
        sh '''
          docker build -t $DOCKERHUB_REPO:$IMAGE_TAG -t $DOCKERHUB_REPO:latest .
        '''
      }
    }

    stage('Push image to Docker Hub') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'DOCKERHUB_USER', passwordVariable: 'DOCKERHUB_PASS')]) {
          sh '''
            echo "$DOCKERHUB_PASS" | docker login -u "$DOCKERHUB_USER" --password-stdin
            docker push $DOCKERHUB_REPO:$IMAGE_TAG
            docker push $DOCKERHUB_REPO:latest
          '''
        }
      }
    }

    stage('Deploy container') {
      steps {
        sh '''
          docker rm -f devops-poc || true
          docker run -d --name devops-poc -p 3000:3000 --restart=always $DOCKERHUB_REPO:$IMAGE_TAG
        '''
      }
    }
  }
}

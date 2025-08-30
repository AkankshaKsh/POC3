pipeline {
  agent any

  environment {
    DOCKERHUB_REPO = "YOUR_DOCKERHUB_USERNAME/devops-hello" // change me
    IMAGE_TAG = "${env.BUILD_NUMBER}"
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
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
          docker rm -f devops-hello || true
          docker run -d --name devops-hello -p 8081:80 --restart=always $DOCKERHUB_REPO:$IMAGE_TAG
        '''
      }
    }
  }
}

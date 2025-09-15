pipeline {
    agent {
        kubernetes {
            yaml '''
                apiVersion: v1
                kind: Pod
                spec:
                  containers:
                  - name: docker
                    image: docker:latest
                    command: ["cat"]
                    tty: true
                    volumeMounts:
                    - name: docker-sock
                      mountPath: /var/run/docker.sock
                  - name: kubectl
                    image: bitnami/kubectl:latest
                    command: ["cat"]
                    tty: true
                  volumes:
                  - name: docker-sock
                    hostPath:
                      path: /var/run/docker.sock
            '''
        }
    }
    
    environment {
        DOCKER_REGISTRY = "your-registry"
        IMAGE_NAME = "a3p3ct/nextjs"
        DOCKER_CREDENTIALS_ID = "docker-credentials"
        GIT_REPO = "git@github.com:A3p3ct-99/jenkins-nextjs.git"
        GIT_BRANCH = "main"
    }
    
    stages {
        stage('Checkout') {
            steps {
                git branch: "${GIT_BRANCH}", url: "${GIT_REPO}"
            }
        }
        
        stage('Build Docker Image') {
            steps {
                container('docker') {
                    sh "docker build -f Dockerfile-nextjs -t ${DOCKER_REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER} ."
                }
            }
        }
        
        stage('Push Docker Image') {
            steps {
                container('docker') {
                    withCredentials([string(credentialsId: "${DOCKER_CREDENTIALS_ID}", variable: 'DOCKER_PWD')]) {
                        sh "echo ${DOCKER_PWD} | docker login ${DOCKER_REGISTRY} -u ${DOCKER_USERNAME} --password-stdin"
                        sh "docker push ${DOCKER_REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER}"
                    }
                }
            }
        }
        
        stage('Deploy to Kubernetes') {
            steps {
                container('kubectl') {
                    sh "envsubst < k8s/nextjs-deployment.yaml | kubectl apply -f -"
                }
            }
        }
    }
}
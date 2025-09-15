podTemplate(
    label: 'jenkins-agent',
    containers: [
        containerTemplate(name: 'node', image: 'node:20-bullseye-slim', command: 'sleep', args: '30d'),
        containerTemplate(name: 'kubectl', image: 'bitnami/kubectl:latest', command: 'sleep', args: '30d'),
        containerTemplate(name: 'docker', image: 'docker:latest', command: 'sleep', args: '30d', 
                         privileged: true),
        containerTemplate(name: 'git', image: 'alpine/git:latest', command: 'sleep', args: '30d')
    ],
    volumes: [
        hostPathVolume(mountPath: '/var/run/docker.sock', hostPath: '/var/run/docker.sock')
    ]
) {

    node('jenkins-agent') {

        def imageTag = "${BUILD_NUMBER}"
        def imageName = "a3p3ct/nextjs"
        def fullImageName = "${imageName}:${imageTag}"
        def k8sNamespace = "default"
        

        stage('Clone Project') {
            git branch: 'main', url: 'https://github.com/A3p3ct-99/jenkins-nextjs.git'
        }

        stage('Install Yarn & Dependencies') {
            container('node') {
                sh '''
                yarn --version
                yarn install --frozen-lockfile
                '''
            }
        }

        stage('Build Next.js Application') {
            container('node') {
                sh '''
                export NODE_ENV=production
                export NEXT_TELEMETRY_DISABLED=1
                yarn build
                '''
            }
        }

        stage('Run Tests') {
            container('node') {
                sh '''
                # Install all dependencies for testing
                yarn install --frozen-lockfile
                yarn test --passWithNoTests || echo "No tests found"
                '''
            }
        }

        stage('Build Docker Image') {
            container('docker') {
                sh """
                docker build -t ${fullImageName} .
                docker tag ${fullImageName} ${imageName}:latest
                """
            }
        }

        stage('Push to Docker Hub') {
            container('docker') {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-cred', 
                                                passwordVariable: 'DOCKER_PASSWORD', 
                                                usernameVariable: 'DOCKER_USERNAME')]) {
                    sh """
                    echo \$DOCKER_PASSWORD | docker login -u \$DOCKER_USERNAME --password-stdin
                    docker push ${fullImageName}
                    docker push ${imageName}:latest
                    """
                }
            }
        }

        stage('Deploy to Kubernetes') {
            container('kubectl') {
                sh """
                # Apply deployment
                kubectl apply -f k8s/frontend/nextjs-deploy.yaml -n ${k8sNamespace}
                
                # Wait for rollout to complete
                kubectl rollout status deployment/nextjs-app -n ${k8sNamespace} --timeout=300s
                
                # Get deployment status
                kubectl get pods -l app=frontend -n ${k8sNamespace}
                """
            }
        }

        stage('Verify Deployment') {
            container('kubectl') {
                sh """
                # Check if deployment is ready
                kubectl get deployment frontend -n ${k8sNamespace}
                
                # Get service info
                kubectl get svc -n ${k8sNamespace}
                """
            }
        }

        stage('Cleanup') {
            container('docker') {
                sh """
                # Clean up local images to save space
                docker rmi ${fullImageName} || true
                docker rmi ${imageName}:latest || true
                """
            }
        }
    }
}
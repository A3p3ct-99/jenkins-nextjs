podTemplate(
    label: 'jenkins-agent',
    containers: [
        containerTemplate(name: 'node', image: 'node:20-bullseye-slim', command: 'sleep', args: '30d'),
        containerTemplate(
            name: 'kubectl', 
            image: 'alpine/k8s:1.34.0', 
            command: 'cat',
            ttyEnabled: true
        ),
        containerTemplate(
            name: 'kaniko', 
            image: 'gcr.io/kaniko-project/executor:debug', 
            command: 'sleep', 
            args: '99999'
        ),
        containerTemplate(
            name: 'git', 
            image: 'alpine/git:latest', 
            command: 'cat',
            ttyEnabled: true
        )
    ]
) {

    node('jenkins-agent') {

        def imageTag = "${BUILD_NUMBER}"
        def imageName = "a3p3ct/nextjs"
        def fullImageName = "${imageName}:${imageTag}"
        def k8sNamespace = "default"
        def controlPlaneIP = "188.166.179.191"
        

        stage('Clone Project') {
            git branch: 'main', url: 'https://github.com/A3p3ct-99/jenkins-nextjs.git'
        }

        stage('Build & Push Docker Image') {
            container('kaniko') {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-cred', 
                                                passwordVariable: 'DOCKER_PASSWORD', 
                                                usernameVariable: 'DOCKER_USERNAME')]) {
                    sh """
                    echo '{"auths":{"https://index.docker.io/v1/":{"username":"'"\$DOCKER_USERNAME"'","password":"'"\$DOCKER_PASSWORD"'"}}}' > /kaniko/.docker/config.json
                    
                    /kaniko/executor \\
                        --dockerfile=./Dockerfile \\
                        --context=. \\
                        --destination=${fullImageName} \\
                        --destination=${imageName}:latest
                    """
                }
            }
        }

        stage('Get Deployment File from Control Plane') {
            container('kubectl') {
                withCredentials([sshUserPrivateKey(credentialsId: 'control-plane-ssh', keyFileVariable: 'SSH_KEY', usernameVariable: 'SSH_USER')]) {
                    sh """
                    # Install required packages
                    apk add --no-cache openssh-client kubectl

                    # Copy file from control plane via SSH
                    scp -i \$SSH_KEY -o StrictHostKeyChecking=no \$SSH_USER@${controlPlaneIP}:/home/devop/k8s/frontend/nextjs-deploy.yaml ./nextjs-deploy-temp.yaml
                    
                    # Verify the file
                    cat ./nextjs-deploy-temp.yaml
                    """
                }
            }
        }

        stage('Deploy to Kubernetes') {
            container('kubectl') {
                sh """
                # Apply deployment
                kubectl apply -f ./nextjs-deploy-temp.yaml -n ${k8sNamespace}
                
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
    }
}
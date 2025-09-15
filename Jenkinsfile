podTemplate(
    label: 'k8s-agent',
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

    node('k8s-agent') {

        def imageTag = "${BUILD_NUMBER}"
        def imageName = "a3p3ct/nextjs"
        def fullImageName = "${imageName}:${imageTag}"
        def k8sNamespace = "default"
        

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

        stage('Deploy to Kubernetes') {
            container('kubectl') {
                sh """
                # Apply deployment
                kubectl set image deployment/frontend frontend=${fullImageName} -n default

                kubectl rollout status deployment/frontend -n default
                
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
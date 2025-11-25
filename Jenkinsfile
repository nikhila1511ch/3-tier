pipeline{
    agent any
    environment{
      REPO_URL= "https://github.com/nikhila1511ch/3-tier.git"
      WORK_DIR='3-tier'
      BRANCH_NAME='main'
      DOCKER_REPO="nikhila1511/3-tier"
      REPO_DIR='3-tier'
      REPO_NAME='3-tier'
      DOCKER_USERNAME='nikhila1511'
      DOCKER_PASSWORD='Nikhila@1511'
      IMAGE_NAME ='node'
      IMAGE_TAG='25-slim'
      TARGET_SERVER='65.1.145.54'
    }
    stages {
        stage('Check & Pull') {
            steps {
                script {
                    try {
                        if (fileExists(REPO_DIR)) {
                            echo "Repository already exists. Pulling latest changes from ${REPO_URL} on branch ${BRANCH_NAME}"
                            dir(REPO_DIR) {
                                checkout([$class: 'GitSCM', branches: [[name: BRANCH_NAME]], userRemoteConfigs: [[url: REPO_URL]]])
                            }
                        } else {
                            echo "No existing repository found. Cloning repository: ${REPO_URL} with branch ${BRANCH_NAME}"
                            checkout([$class: 'GitSCM', branches: [[name: BRANCH_NAME]], userRemoteConfigs: [[url: REPO_URL]]])
                        }
                        
                        env.CHECK_AND_PULL_STATUS = 'success'
                    } catch (Exception e) {
                        env.CHECK_AND_PULL_STATUS = 'failed'
                        error("Failed during check and pull: ${e.getMessage()}")
                    }
                }
            }
        }

        stage('build') {
            steps {
                script {
                    try {
                        echo "Building Docker image: ${IMAGE_NAME} with tags ${IMAGE_TAG}"
                        dir("${WORK_DIR}/server") {
                            sh """
                            docker build -t ${DOCKER_USERNAME}/${REPO_NAME}:${IMAGE_TAG} .

                            """
                        }                        
                        env.BUILD_STATUS = 'success'
                    } catch (Exception e) {
                        env.BUILD_STATUS = 'failed'
                        error("Failed during build: ${e.getMessage()}")
                    }
                }
            }
        }

        stage('pushimagetorepository'){
            steps{
                script{
                    try{
                        echo " docker image was run with $IMAGE_NAME and $IMAGE_TAG"
                        sh """
                        docker login -u ${DOCKER_USERNAME} -p ${DOCKER_PASSWORD}
                        docker tag ${DOCKER_REPO}:${IMAGE_TAG} ${DOCKER_USERNAME}/${REPO_NAME}:${IMAGE_TAG}
                        docker push ${DOCKER_USERNAME}/${REPO_NAME}:${IMAGE_TAG}
                        """
                        env.PUSH_STATUS ='SUCCESS'
                } catch(Exception e) {
                        env.PUSH_STATUS ='FAILED'
                        error("failed to push  docker image to $DOCKER_REPO:${e.getMessage()}")
                    }
                }
            }
        }

        stage('pull from docker repo'){
            steps{
                script{
                    try{
                        echo " pulling from ${DOCKER_REPO} "
                        sh """
                        docker login -u ${DOCKER_USERNAME} -p ${DOCKER_PASSWORD}
                        docker pull ${DOCKER_REPO}:${IMAGE_TAG}
                        """
                        env.PULL_FROM_DOCKER_REPO_STATUS ='SUCCESS'
                    }catch(Exception e){
                        env.PULL_FROM_DOCKER_REPO_STATUS ='FAILED'
                        error("failed to pull from $DOCKER_USERNAME:${e.getMessage()}")
                    }
                }
            }
        }

        stage('deploy'){
            steps{
                script{
                    try{
                        echo "running image comtainer"
                        sh"""
                        docker stop image || true
                        docker rm image || true
                        docker login -u ${DOCKER_USERNAME} -p ${DOCKER_PASSWORD}
                        docker pull ${DOCKER_USERNAME}/${REPO_NAME}:${IMAGE_TAG}
                        docker run -d -p 9000:5000 --name image ${DOCKER_USERNAME}/${REPO_NAME}:${IMAGE_TAG}
                    """
                         env.DEPLOY_STATUS ='SUCCESS'
                    }catch(Exception e){
                        env.DEPLOY_STATUS ='FAILED'
                        error("failed to deploy ${DOCKER_REPO}:${IMAGE_TAG}:${e.getMessage()}")
                    }
                }
            }
        }
    }
}

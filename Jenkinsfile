pipeline{
    agent any
    environment{
      REPO_URL= "https://github.com/nikhila1511ch/3-tier.git"
      WORK_DIR='2-tier'
      BRANCH_NAME='master'
      DOCKER_REPO="nikhila1511/2-tier"
      REPO_DIR='2-tier'
      REPO_NAME='2-tier'
      DOCKER_USERNAME='nikhila1511'
      DOCKER_PASSWORD='Nikhila@1511'
      IMAGE_NAME ='node'
      IMAGE_TAG='25-slim'
      TARGET_SERVER='65.2.147.206'
          }
    stages{
        stage('check'){
            steps{
                script{
                    try{
                        if(fileExists(WORK_DIR)){
                            sh "ls -la ${WORK_DIR}"
                            echo "file  exists in the $REPO_URL"
                        } else {
                            echo "file doesn't exist in $REPO_URL "
                        }
                        env.CHECK_STATUS ='SUCCESS'
                    } catch(Exception e) {
                        env.CHECK_STATUS ='FAILED'
                        error("failed to check the $REPO_URL:${e.getMessage()}")
                    }
                }    
            }
        }
        stage('pull'){
            steps{
                script{
                     try{
                        if(fileExists(WORK_DIR)){
                            echo "pulled latest version of the code from ${REPO_URL} to ${WORK_DIR}"
                            sh "cd ${WORK_DIR} && git pull origin ${BRANCH_NAME}"
                            dir(REPO_DIR) {
                        checkout([$class: 'GitSCM',
                            branches: [[name: BRANCH_NAME]],
                            userRemoteConfigs: [[url: REPO_URL]]
                        ])
                    }
                            
                        } else {
                            echo "cloned code from ${REPO_URL} and pulling latest version of the code to ${WORK_DIR}"
                            sh """
                            git clone -b ${BRANCH_NAME} ${REPO_URL} ${WORK_DIR}
                            cd ${WORK_DIR} && git pull origin ${BRANCH_NAME}
                            """
                            dir(REPO_DIR) {
                        checkout([$class: 'GitSCM',
                            branches: [[name: BRANCH_NAME]],
                            userRemoteConfigs: [[url: REPO_URL]]
                        ])}
                        }
                        env.PULL_STATUS ='SUCCESS'
                    } catch(Exception e) {
                        env.PULL_STATUS ='FAILED'
                        error("failed to pull the latest version from ${REPO_URL}:${e.getMessage()}")
                    }
                }
            }
        }
        
        stage('build'){
            steps{
                script{
                    try{
                        echo "build docker image : ${IMAGE_NAME} and ${IMAGE_TAG}"
                        dir(REPO_DIR) {
                            sh "docker build -t ${DOCKER_REPO}:${IMAGE_TAG} ."
                            
                        }

                        env.BUILD_STATUS ='SUCCESS'
                    } catch(Exception e) {
                        env.BUILD_STATUS ='FAILED'
                        error("failed to create docker image with $IMAGE_NAME and $IMAGE_TAG:${e.getMessage()}")
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

        stage('pullfromdockerrepo'){
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
    }
}
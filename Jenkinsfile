pipeline {
    agent any

    environment {
        AWS_ACCESS_KEY_ID = credentials('aws-access-key-id')  // AWS access key stored in Jenkins credentials
        AWS_SECRET_ACCESS_KEY = credentials('aws-secret-access-key')  // AWS secret key stored in Jenkins credentials
        AWS_REGION ="ap-south-1"
        IMAGE_NAME = "vip_frontend_online"
        IMAGE_TAG = "latest"
        S3_BUCKET = "mvs-download-files"
        S3_KEY = "assemlby_online_builds/${IMAGE_NAME}.tar"
    }

    stages {
        stage('Checkout') {
            steps {
                // Clone the repository with the Dockerfile
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    // Build Docker image
                    sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ."
                }
            }
        }

        stage('Save Docker Image as Tar') {
            steps {
                script {
                    // Save the Docker image as a .tar file
                    sh "docker save -o ${IMAGE_NAME}.tar ${IMAGE_NAME}:${IMAGE_TAG}"
                }
            }
        }

        stage('Upload to S3') {
            steps {
                script {
                    // Upload the tar file to S3
                    sh """
                        aws s3 cp ${IMAGE_NAME}.tar s3://${S3_BUCKET}/${S3_KEY} \
                        --region ${AWS_REGION}
                    """
                }
            }
        }
    }

    post {
        always {
            // Clean up: Remove tar file and Docker image to free up space
            sh "rm -f ${IMAGE_NAME}.tar"
            sh "docker rmi ${IMAGE_NAME}:${IMAGE_TAG} || true"
        }
    }
}

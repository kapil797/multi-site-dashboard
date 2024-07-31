pipeline {
    agent none
    options {
        disableConcurrentBuilds(abortPrevious: true)
        skipStagesAfterUnstable()
        buildDiscarder(logRotator(numToKeepStr:'10'))
    }

    environment {
        // Branches.
        DEV_BRANCH = "dev"
        PROD_BRANCH = "main"

        // Application.
        PROJECT_NAME = "dashboard"
        SERVICE_NAME = "multi-site-dashboard-angular"
        LANGUAGE = 'angular' // angular, dotnet, nodejs, go, python
        K8S_MANIFESTS_URL_WITHOUT_HTTPS = "tools.mf.platform/bitbucket/scm/dash/kubernetes-manifests.git"

        // Image.
        IMAGE_BUILD_TAG_PREFIX = "harbor.mf.platform/$PROJECT_NAME/$SERVICE_NAME"

        // Credentials.
        BITBUCKET_CREDENTIALS_ID = "bitbucket-daronphang"
        BITBUCKET_PROJECT_SA_CREDENTIALS_ID = "jenkins-sa"
        HARBOR_CREDENTIALS_ID = "harbor-dashboard"
        NEXUS_CREDENTIALS_ID = "bitbucket-tanggy"
        SONAR_LOGIN_HASH = "sqp_1d26db0970e0bb286e3978d47b0b990239ced805"

        // Secret files to be injected by Jenkins when deploying to k8s.
        // Comment out if not required, else it will run the creating secrets stage.
        // Should have the environment as suffix e.g. orderapp-secret-env-dev, orderapp-secret-env-prod
        // SECRET1_CREDENTIALS_ID_PREFIX = "$SERVICE_NAME-secret-env"

        // For Angular.
        BASEHREF = "/dashboard/multi"

        // DAST ZAP.
        // for backend api, give path to .json file eg http://dev.mf.platform/<SERVICE_NAME>/swagger/v1/swagger.json
        ZAP_TARGET_URL = "http://dev.mf.platform/dashboard/multi"  
    }
    stages {
        stage('CONTINUOUS INTEGRATION') {
            agent { label 'k8s-development' }
            environment {
                ENVIRONMENT = "test"
                IMAGE_BUILD_TAG = "$IMAGE_BUILD_TAG_PREFIX:t$BUILD_NUMBER"
                SONAR_URL = "http://tools.mf.platform/sonar/"
            }
            when {
                beforeAgent true
                expression {
                    return !(env.BRANCH_NAME == env.PROD_BRANCH || env.BRANCH_NAME == env.DEV_BRANCH)
                }
            }
            stages {
                stage('[Image] Build') {
                    when {
                        not {
                            environment(name: 'LANGUAGE', value: 'angular')
                        }
                    }
                    steps {
                        // Customize the build arguments as necessary.
                        sh '''
                        docker build -t $IMAGE_BUILD_TAG .
                        '''
                    }
                }
                stage('[Image] Build - ANGULAR') {
                    when {
                        environment(name: 'LANGUAGE', value: 'angular')
                    }
                    steps {
                        // Customize the build arguments as necessary.
                        sh '''
                        docker build \
                        --build-arg CONFIG=testing \
                        --build-arg BASEHREF=$BASEHREF \
                        --build-arg DEPLOYMENT_IMAGE=build \
                        -t $IMAGE_BUILD_TAG .
                        '''
                    }
                }

                // stage('Unit-testing with Coverage') {
                //     steps {
                //         // Customize the steps in this stage as necessary.
                //         sh '''
                //         chmod 766 $WORKSPACE
                //         docker run -d -v $WORKSPACE:/coverage:rw \
                //         --name test-$SERVICE_NAME-$BUILD_NUMBER \
                //         $IMAGE_BUILD_TAG \
                //         sleep 5m
                //         docker exec test-$SERVICE_NAME-$BUILD_NUMBER \
                //         sh -c "npm run test:ci && cp /orderapp/coverage/lcov.info /coverage/lcov.info"
                //         '''
                //     }
                //     post {
                //         always {
                //             sh '''
                //             docker rm -f test-$SERVICE_NAME-$BUILD_NUMBER
                //             chmod 755 $WORKSPACE
                //             '''
                //         }
                //         failure {
                //             sh 'docker rmi $IMAGE_BUILD_TAG'
                //         }
                //     }
                // }

                stage('[SAST] SonarQube') {
                    when {
                        not {
                            environment(name: 'LANGUAGE', value: 'dotnet')
                        }
                    }
                    steps {
                        withSonarQubeEnv('SonarQube') {
                            sh '''
                            sudo sonar-scanner \
                            -Dsonar.projectKey=${PROJECT_NAME}-${SERVICE_NAME} \
                            -Dsonar.projectName=${PROJECT_NAME}-${SERVICE_NAME} \
                            -Dsonar.host.url=${SONAR_URL} \
                            -Dsonar.login=${SONAR_LOGIN_HASH} 
                            '''
                            // -Dsonar.typescript.lcov.reportPaths=$WORKSPACE/lcov.info

                        }
                    }
                    post {
                        always {
                            sh 'sudo rm -rf .sonarqube'
                        }
                    }
                }

                stage('[SAST] SonarQube - DOTNET') {
                    when {
                        environment(name: 'LANGUAGE', value: 'dotnet')
                    }
                    steps {
                        withSonarQubeEnv('SonarQube') {
                            sh '''
                            sudo dotnet sonarscanner begin /k:"${SERVICE_NAME}" \
                            /d:sonar.host.url="${SONAR_URL}" \
                            /d:sonar.login="${SONAR_LOGIN_HASH}"
                            sudo dotnet build
                            sudo dotnet sonarscanner end /d:sonar.login="${SONAR_LOGIN_HASH}"
                            '''
                        }
                    }
                    post {
                        always {
                            sh 'sudo rm -rf .sonarqube'
                        }
                    }
                }

                stage('[SAST] Quality Gate') {
                    steps {
                        timeout(time: 1, unit: 'HOURS') {
                            // Parameter indicates whether to set pipeline to UNSTABLE if Quality Gate fails
                            // true = set pipeline to UNSTABLE, false = don't
                            waitForQualityGate abortPipeline: false
                        }
                    }
                }

                stage('[Image Scan] TRIVY') {
                    steps {
                        sh '''
                        sudo mkdir -p /opt/trivy-scan/trivy-reports/$PROJECT_NAME-$SERVICE_NAME/
                        sudo bash /opt/trivy-scan/trivy-scan2.sh $IMAGE_BUILD_TAG $PROJECT_NAME $SERVICE_NAME $BUILD_NUMBER
                        sudo cp /opt/trivy-scan/trivy-reports/$PROJECT_NAME-$SERVICE_NAME/trivy-report-$BUILD_NUMBER.html ./trivy-report.html
                        '''
                        // sudo touch /opt/trivy-scan/trivy-reports/$PROJECT_NAME-$SERVICE_NAME/trivy-report-$BUILD_NUMBER.html
                        withCredentials([
                            usernamePassword(
                                credentialsId: "$NEXUS_CREDENTIALS_ID",
                                usernameVariable: 'NEXUS_USERNAME',
                                passwordVariable: 'NEXUS_PASSWORD'
                            ),
                        ]) {
                            sh 'sudo curl -v -u $NEXUS_USERNAME:$NEXUS_PASSWORD --upload-file /opt/trivy-scan/trivy-reports/$PROJECT_NAME-$SERVICE_NAME/trivy-report-$BUILD_NUMBER.html https://tools.mf.platform/nexus/repository/$PROJECT_NAME/$SERVICE_NAME/trivy-report-$BUILD_NUMBER.html'
                        }
                    }
                    post {
                    // Clean & Publish HTML after build
                        always {
                            publishHTML(target: [
                                allowMissing: true,
                                alwaysLinkToLastBuild: true,
                                keepAll: true,
                                reportDir: "",
                                reportFiles: "trivy-report.html",
                                reportName: 'Trivy Vulnerability Report',
                                reportTitles: 'Trivy Vulnerability Report'
                            ])
                        }
                    }
                }
            }
        }

        stage('CONTINUOUS DEPLOYMENT k8s-dev') {
            agent { label 'k8s-development' }
            environment {
                ENVIRONMENT = 'dev'
                IMAGE_BUILD_TAG = "$IMAGE_BUILD_TAG_PREFIX:d$BUILD_NUMBER"
                ZAP_REPORT_FILENAME = 'zap-report'
            }
            when {
                beforeAgent true
                branch "$DEV_BRANCH"
            }
            stages {
                stage('[Image] Build') {
                    when {
                        not {
                            environment(name: 'LANGUAGE', value: 'angular')
                        }
                    }
                    steps {
                        // Customize the build arguments as necessary.
                        sh '''
                        docker build -t $IMAGE_BUILD_TAG .
                        '''
                    }
                }

                stage('[Image] Build - ANGULAR') {
                    when {
                        environment(name: 'LANGUAGE', value: 'angular')
                    }
                    steps {
                        // Customize the build arguments as necessary.
                        sh '''
                        docker build --build-arg CONFIG=development \
                        --build-arg BASEHREF=$BASEHREF \
                        -t $IMAGE_BUILD_TAG .
                        '''
                    }
                }
                
                stage('[Image] Push to Harbor') {
                    steps {
                        withCredentials([
                            usernamePassword(
                                credentialsId: "$HARBOR_CREDENTIALS_ID",
                                usernameVariable: 'HARBOR_USERNAME',
                                passwordVariable: 'HARBOR_PASSWORD'
                            ),
                        ]) {
                            sh '''
                            docker login harbor.mf.platform -u $HARBOR_USERNAME -p $HARBOR_PASSWORD
                            docker push $IMAGE_BUILD_TAG
                            '''
                        }
                    }
                    post {
                        always {
                            sh '''
                            docker rmi $IMAGE_BUILD_TAG
                            '''
                        }
                    }
                }

                stage('[Secrets] Create in Cluster') {
                    when {
                        expression {
                            return env.SECRET1_CREDENTIALS_ID_PREFIX
                        }
                    }
                    steps {
                        withCredentials([
                            file(credentialsId: "$SECRET1_CREDENTIALS_ID_PREFIX-$ENVIRONMENT", variable: 'SECRET_FILE1'),
                        ]) {
                            sh '''
                            chmod 744 /$SECRET_FILE1
                            kubectl delete secret $SECRET1_CREDENTIALS_ID_PREFIX -n $PROJECT_NAME --ignore-not-found
                            kubectl create secret generic $SECRET1_CREDENTIALS_ID_PREFIX --from-env-file=/$SECRET_FILE1 -n $PROJECT_NAME
                            '''
                        }
                    }
                }

                stage('[ArgoCD] Update k8s Manifest in Repo') {
                    steps{
                        withCredentials([
                            usernamePassword(
                                credentialsId:"$BITBUCKET_PROJECT_SA_CREDENTIALS_ID",
                                usernameVariable: 'GIT_USERNAME',
                                passwordVariable: 'GIT_PASSWORD'
                            ),
                        ]) {
                            git branch: "$PROD_BRANCH", credentialsId: "$BITBUCKET_CREDENTIALS_ID", url: "https://$K8S_MANIFESTS_URL_WITHOUT_HTTPS"
                            script {
                                env.ENCODED_PASSWORD=URLEncoder.encode("$GIT_PASSWORD", "UTF-8")
                            }
                            sh '''
                            cd $SERVICE_NAME/$ENVIRONMENT
                            sed -i "s|$IMAGE_BUILD_TAG_PREFIX.*|$IMAGE_BUILD_TAG|" kubernetes.yaml
                            git add .
                            git commit -m "Updating image build tag to $IMAGE_BUILD_TAG | Jenkins Pipeline for $BUILD_TAG"
                            git push -u "https://$GIT_USERNAME:$ENCODED_PASSWORD@$K8S_MANIFESTS_URL_WITHOUT_HTTPS" $PROD_BRANCH
                            '''
                        }
                    }
                }

                stage('[DAST] Run OWASP ZAP Analysis - WebApp') {
                    when {
                        allOf {
                            expression {
                                return env.ZAP_TARGET_URL
                            };
                            environment(name: 'LANGUAGE', value: 'angular')
                        }
                    }
                    steps {
                        sh '''
                        mkdir -p zap
                        sudo docker run --user root --name owasp-$SERVICE_NAME-$BUILD_NUMBER \
                        -v $WORKSPACE/zap:/zap/wrk/:rw \
                        -t softwaresecurityproject/zap-stable \
                        zap-baseline.py -t $ZAP_TARGET_URL \
                        -g gen.conf \
                        -r $ZAP_REPORT_FILENAME.html \
                        -I
                        '''
                    }
                    post {
                        always {    
                            sh '''
                            docker rm owasp-$SERVICE_NAME-$BUILD_NUMBER
                            '''
                        }
                    }            
                }

                stage('[DAST] Run OWASP ZAP Analysis - API') {
                    when {
                        allOf {
                            expression {
                                return env.ZAP_TARGET_URL
                            };
                            not {
                                environment(name: 'LANGUAGE', value: 'angular')
                            }
                        }
                    }
                    steps {
                        sh '''
                        mkdir -p zap
                        sudo docker run --user root --name owasp-$SERVICE_NAME-$BUILD_NUMBER \
                        -v $WORKSPACE/zap:/zap/wrk/:rw \
                        -t softwaresecurityproject/zap-stable \
                        zap-api-scan.py -t $ZAP_TARGET_URL \
                        -f openapi \
                        -g backend.conf \
                        -r $ZAP_REPORT_FILENAME.html \
                        -I
                        '''
                    }
                    post {
                        always {
                            sh '''
                            docker rm owasp-$SERVICE_NAME-$BUILD_NUMBER
                            '''
                        }
                    }            
                }

                stage('[DAST] Publish OWASP ZAP Report') {
                    steps {
                        withCredentials([
                            usernamePassword(
                                credentialsId: "$NEXUS_CREDENTIALS_ID",
                                usernameVariable: 'NEXUS_USERNAME',
                                passwordVariable: 'NEXUS_PASSWORD'
                            ),
                        ]) {
                            sh 'sudo curl -v -u $NEXUS_USERNAME:$NEXUS_PASSWORD --upload-file $WORKSPACE/zap/$ZAP_REPORT_FILENAME.html https://tools.mf.platform/nexus/repository/$PROJECT_NAME/$SERVICE_NAME/$ZAP_REPORT_FILENAME-$BUILD_NUMBER.html'
                        }
                        publishHTML([
                            allowMissing: false,
                            alwaysLinkToLastBuild: false,
                            keepAll: true,
                            reportDir: '',
                            reportFiles: '$ZAP_REPORT_FILENAME.html',
                            reportName: 'OWASP HTML Report',
                            useWrapperFileDirectly: true,
                        ]) 
                    }
                    post {
                        always {         
                            sh'''
                            sudo rm $WORKSPACE/zap/$ZAP_REPORT_FILENAME.html
                            '''
                        }
                    }            
                }
            }
            post {
                failure {
                    cleanWs(
                        cleanWhenNotBuilt: false,
                        deleteDirs: true,
                        notFailBuild: true
                    )
                }
            }
        }

        stage('CONTINUOUS DEPLOYMENT ntx-prod') {
            agent { label 'ntx-production' }
            environment {
                ENVIRONMENT = 'prod'
                IMAGE_BUILD_TAG = "$IMAGE_BUILD_TAG_PREFIX:p$BUILD_NUMBER"
            }
            when {
                beforeAgent true
                branch "$PROD_BRANCH"
            }
            stages {
                stage('[Image] Build - OTHERS') {
                    when {
                        not {
                            environment(name: 'LANGUAGE', value: 'angular')
                        }
                    }
                    steps {
                        // Customize the build arguments as necessary.
                        sh '''
                        docker build -t $IMAGE_BUILD_TAG .
                        '''
                    }
                }

                stage('[Image] Build') {
                    when {
                        environment(name: 'LANGUAGE', value: 'angular')
                    }
                    steps {
                        // Customize the build arguments as necessary.
                        sh '''
                        docker build --build-arg CONFIG=production \
                        --build-arg BASEHREF=$BASEHREF \
                        -t $IMAGE_BUILD_TAG .
                        '''
                    }
                }

                stage('[Image] Push to Harbor') {
                    steps {
                        withCredentials([
                            usernamePassword(credentialsId: "$HARBOR_CREDENTIALS_ID", usernameVariable: 'HARBOR_USERNAME', passwordVariable: 'HARBOR_PASSWORD'),
                        ]) {
                            sh '''
                            docker login harbor.mf.platform -u $HARBOR_USERNAME -p $HARBOR_PASSWORD
                            docker push $IMAGE_BUILD_TAG
                            '''
                        }
                    }
                    post {
                        always {
                            sh '''
                            docker rmi $IMAGE_BUILD_TAG
                            '''
                        }
                    }
                }

                stage('[Secrets] Create in Cluster') {
                    when {
                        expression {
                            return env.SECRET1_CREDENTIALS_ID_PREFIX
                        }
                    }
                    steps {
                        withCredentials([
                            file(credentialsId: "$SECRET1_CREDENTIALS_ID_PREFIX-$ENVIRONMENT", variable: 'SECRET_FILE1'),
                        ]) {
                            sh '''
                            chmod 744 /$SECRET_FILE1
                            kubectl delete secret $SECRET1_CREDENTIALS_ID_PREFIX -n $PROJECT_NAME --ignore-not-found
                            kubectl create secret generic $SECRET1_CREDENTIALS_ID_PREFIX --from-env-file=/$SECRET_FILE1 -n $PROJECT_NAME
                            '''
                        }
                    }
                }

                stage('[ArgoCD] Update k8s Manifest in Repo') {
                    steps{
                        withCredentials([
                            usernamePassword(
                                credentialsId:"$BITBUCKET_PROJECT_SA_CREDENTIALS_ID",
                                usernameVariable: 'GIT_USERNAME',
                                passwordVariable: 'GIT_PASSWORD'
                            ),
                        ]) {
                            git branch: "$PROD_BRANCH", credentialsId: "$BITBUCKET_CREDENTIALS_ID", url: "https://$K8S_MANIFESTS_URL_WITHOUT_HTTPS"
                            script {
                                env.ENCODED_PASSWORD=URLEncoder.encode("$GIT_PASSWORD", "UTF-8")
                            }
                            sh '''
                            cd $SERVICE_NAME/$ENVIRONMENT
                            sed -i "s|$IMAGE_BUILD_TAG_PREFIX.*|$IMAGE_BUILD_TAG|" kubernetes.yaml
                            git add .
                            git commit -m "Updating image build tag to $IMAGE_BUILD_TAG | Jenkins Pipeline for $BUILD_TAG"
                            git push -u "https://$GIT_USERNAME:$ENCODED_PASSWORD@$K8S_MANIFESTS_URL_WITHOUT_HTTPS" $PROD_BRANCH
                            '''
                        }
                    }
                }
            }
            post {
                // Clean after build
                failure {
                    cleanWs(
                        cleanWhenNotBuilt: false,
                        deleteDirs: true,
                        notFailBuild: true
                    )
                }
            }
        }
    }
}
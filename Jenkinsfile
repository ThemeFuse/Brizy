env.BUILD_ZIP_PATH = params.brizySvnPath+"/Brizy-"+params.buildVersion+".zip"

def notifySlack(String buildResult = 'STARTED', String zipPath = '') {

     if ( buildResult == "SUCCESS" ) {
       slackSend color: "good", message: "Job: ${env.JOB_NAME} with buildnumber ${env.BUILD_NUMBER} was successful"

       withCredentials([string(credentialsId: 'Slack Oauth Token', variable: 'SECRET')]) {
           sh '''
               set +x
               curl -F file=@$BUILD_ZIP_PATH -F channels=#jenkins -F token="$SECRET" https://slack.com/api/files.upload
           '''
       }

     }
     else if( buildResult == "FAILURE" ) {
       slackSend color: "danger", message: "Job: ${env.JOB_NAME} with buildnumber ${env.BUILD_NUMBER} was failed"
     }
     else if( buildResult == "UNSTABLE" ) {
       slackSend color: "warning", message: "Job: ${env.JOB_NAME} with buildnumber ${env.BUILD_NUMBER} was unstable"
     }
     else {
       slackSend color: "danger", message: "Job: ${env.JOB_NAME} with buildnumber ${env.BUILD_NUMBER} its result was unclear"
     }
}

pipeline {
    agent any
    stages {
        stage('CodeClean') {
            steps {

                sh 'rm -rf vendor'
                sh '/usr/local/bin/composer install --no-dev'
                sh 'find . -type f -name "*.dev.php" -delete'
                sh 'rm -rf  ./bin ./tests *.dist *.xml *.lock *.json *.yml .gitignore'
                sh 'rm -rf ./vendor/twig/twig/test'
                sh 'rm -rf ./vendor/twig/twig/doc'
                sh 'rm -rf ./*.sh'
                sh 'rm -rf ./.git'
                sh 'rm -rf ./Jenkinsfile'
                sh "sed -i 's/Version:\\s.\\{1,\\}\\..\\{1,\\}\\..\\{1,\\}/Version: ${params.buildVersion}/' brizy.php"
                sh "sed -i 's/^Stable tag:\\s.\\{1,\\}\\..\\{1,\\}\\..\\{1,\\}/Stable tag: ${params.buildVersion}/' readme.txt"
                sh "sed -i 's/^Stable tag:\\s.\\{1,\\}\\..\\{1,\\}\\..\\{1,\\}/Stable tag: ${params.buildVersion}/' README.md"
                sh "sed -i \"s/'BRIZY_VERSION',\\s'.\\{1,\\}\\..\\{1,\\}\\..\\{1,\\}'/'BRIZY_VERSION', '${params.buildVersion}'/\" brizy.php"
            }
        }

        stage('Prepare SVN') {
            steps {
                sh 'cd ' + params.brizySvnPath + ' && svn revert . -R && svn up'
                sh 'rm -rf '+ params.brizySvnPath + '/trunk/*'
                sh 'cp -r * '+ params.brizySvnPath + '/trunk/'
                sh 'cd ' + params.brizySvnPath + ' && if svn st | grep "!" > /dev/null; then  svn st | grep "!" | cut -d! -f2| sed \'s/^ *//\' | sed \'s/^/"/g\' | sed \'s/$/"/g\' | xargs svn rm; fi'
                sh 'cd ' + params.brizySvnPath + ' && if svn st | grep "?" > /dev/null; then  svn st | grep "?" | cut -d? -f2| sed \'s/^ *//\' | sed \'s/^/"/g\' | sed \'s/$/"/g\' | xargs svn add; fi'
                sh 'cd ' + params.brizySvnPath + ' && rm -rf brizy && mkdir brizy'
                sh 'cd ' + params.brizySvnPath + ' && cp -r ./trunk/* ./brizy/'
                sh 'cd ' + params.brizySvnPath + ' && zip -r "Brizy-'+params.buildVersion+'.zip" ./brizy'
                sh 'cd ' + params.brizySvnPath + ' && rm -rf ./brizy'
            }
        }
        stage('Build') {
            when {
                expression { return params.svnCommit }
            }
            steps {
                sh 'cd ' + params.brizySvnPath + ' && svn cp trunk tags/' + params.buildVersion + ' && svn commit -m "Version ${params.buildVersion}"'
            }
        }

    }

    post {
        always {
            notifySlack(currentBuild.currentResult)
            cleanWs()
        }
    }
}


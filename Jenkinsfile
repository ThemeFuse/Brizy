def now = new Date()
def currentDate =  now.format("yyyy-MM-dd", TimeZone.getTimeZone('UTC'))
def changeLogs = params.changelog.replaceAll("\n","\\\\n").replaceAll("/",'\\\\/')
def zipFileName = "Build-"+params.buildVersion+"-RC.zip"
env.BUILD_ZIP_PATH = params.brizySvnPath+"/"+zipFileName

if(params.gitMerge) {
    zipFileName = "Build-"+params.buildVersion+".zip"
}


def notifySlack(String buildResult = 'STARTED', String zipPath = '') {

    def buildInfo = "\nBranch: "+params.releaseBranch+"\nPlugin version: "+params.buildVersion+"\nEditor version: "+params.editorVersion+"\nChangelog\n"+params.changelog;

    withCredentials([string(credentialsId: 'slack', variable: 'SECRET')]) {

         if ( buildResult == "SUCCESS" ) {
           //slackSend  channel: '#jenkins', color: "good", message: "Job: ${env.JOB_NAME} with buildnumber ${env.BUILD_NUMBER} was successful."+buildInfo

           sh '''
                set +x
                curl -F file=@$BUILD_ZIP_PATH -F channels=#jenkins -F token="$SECRET" https://slack.com/api/files.upload
           '''
         }
         else if( buildResult == "FAILURE" ) {
           //slackSend  channel: '#jenkins', color: "danger", message: "Job: ${env.JOB_NAME} with buildnumber ${env.BUILD_NUMBER} was failed."+buildInfo
         }
         else if( buildResult == "UNSTABLE" ) {
           //slackSend  channel: '#jenkins', color: "warning", message: "Job: ${env.JOB_NAME} with buildnumber ${env.BUILD_NUMBER} was unstable."+buildInfo
         }
         else {
           //slackSend channel: '#jenkins', color: "danger", message: "Job: ${env.JOB_NAME} with buildnumber ${env.BUILD_NUMBER} its result was unclear."+buildInfo
         }
    }
}

def folderExist(path){
    return sh(script: "test -d ${path} && echo 1 || echo 0", returnStdout: true).trim()=="1"
}

pipeline {
    agent any
    stages {
        stage('Version Update') {
            steps {
                script {
                    if(folderExist(params.brizySvnPath+"/tags/"+params.buildVersion)) {
                        error("Build failed because this version is alread built.")
                    }
                }

                git url: "git@github.com:/ThemeFuse/Brizy",
                    credentialsId: 'Git',
                    branch: params.releaseBranch

                sh 'git config user.name "Alex Zaharia"'
                sh 'git config user.email alecszaharia@gmail.com'
                sh 'git remote set-branches --add origin master'
                sh 'git remote set-branches --add origin develop'
                sh 'git remote set-branches --add origin release'

                sh "sed -i 's/Version:\\s.\\{1,\\}\\..\\{1,\\}\\..\\{1,\\}/Version: ${params.buildVersion}/' brizy.php"
                sh "sed -i 's/^Stable tag:\\s.\\{1,\\}\\..\\{1,\\}\\..\\{1,\\}/Stable tag: ${params.buildVersion}/' readme.txt"
                sh "sed -i 's/^Stable tag:\\s.[^<]*/Stable tag: ${params.buildVersion}/' README.md"
                sh "sed -i \"s/'BRIZY_VERSION',\\s'.\\{1,\\}\\..\\{1,\\}\\..\\{1,\\}'/'BRIZY_VERSION', '${params.buildVersion}'/\" brizy.php"
                sh "sed -i \"s/'BRIZY_DEVELOPMENT',.[^\\)]*/'BRIZY_DEVELOPMENT', false /\" brizy.php"
                sh "sed -i \"s/'BRIZY_EDITOR_VERSION',\\s'.\\{1,\\}\\..\\{1,\\}\\..\\{1,\\}'/'BRIZY_EDITOR_VERSION', '${params.editorVersion}'/\" brizy.php"
                sh "sed -i \"s/'BRIZY_LOG',.[^\\)]*/'BRIZY_LOG', false /\" brizy.php"

                sh "sed -i \"s/== Changelog ==/== Changelog ==\\n\\n= ${params.buildVersion} - "+currentDate+" =\\n${changeLogs}/\" readme.txt"
                sh "sed -i \"s/## Changelog/## Changelog\\n\\n### ${params.buildVersion} - "+currentDate+" ###\\n${changeLogs}/\" README.md"
            }
        }

        stage('Prepare SVN') {
            steps {
                sh 'cd ' + params.brizySvnPath + ' && svn cleanup && svn revert . -R && svn up'
                sh 'cd ' + params.brizySvnPath + ' && rm -rf trunk/*'
                sh 'cp -r * '+ params.brizySvnPath + '/trunk/'
                sh 'cd ' + params.brizySvnPath + '/trunk && rm -rf vendor'
                sh 'cd ' + params.brizySvnPath + '/trunk && rm -rf public/editor-src'
                sh 'cd ' + params.brizySvnPath + '/trunk && /usr/local/bin/composer install --no-dev'
                sh 'cd ' + params.brizySvnPath + '/trunk && find . -type f -name "*.dev.php" -delete'
                sh 'cd ' + params.brizySvnPath + '/trunk && rm -rf  ./bin ./tests *.dist *.xml *.lock *.json *.yml .gitignore'
                sh 'cd ' + params.brizySvnPath + '/trunk && rm -rf ./vendor/twig/twig/test'
                sh 'cd ' + params.brizySvnPath + '/trunk && rm -rf ./vendor/twig/twig/.git'
                sh 'cd ' + params.brizySvnPath + '/trunk && rm -rf ./vendor/twig/twig/ext/twig'
                sh 'cd ' + params.brizySvnPath + '/trunk && rm -rf ./vendor/twig/twig/doc'
                sh 'cd ' + params.brizySvnPath + '/trunk && rm -rf ./vendor/imagine/imagine/lib/Imagine/resources/Adobe/*.pdf'
                sh 'cd ' + params.brizySvnPath + '/trunk && rm -rf ./*.sh'
                sh 'cd ' + params.brizySvnPath + '/trunk && rm -rf ./.git'
                sh 'cd ' + params.brizySvnPath + '/trunk && rm -rf ./Jenkinsfile'
                sh 'cd ' + params.brizySvnPath + '/trunk && if svn st | grep "!" > /dev/null; then  svn st | grep "!" | cut -d! -f2| sed \'s/^ *//\' | sed \'s/^/"/g\' | sed \'s/$/"/g\' | xargs svn rm; fi'
                sh 'cd ' + params.brizySvnPath + '/trunk && if svn st | grep "?" > /dev/null; then  svn st | grep "?" | cut -d? -f2| sed \'s/^ *//\' | sed \'s/^/"/g\' | sed \'s/$/"/g\' | xargs svn add; fi'
                sh 'cd ' + params.brizySvnPath + ' && rm -f Build-*'
                sh 'cd ' + params.brizySvnPath + ' && rm -rf brizy && mkdir brizy'
                sh 'cd ' + params.brizySvnPath + ' && cp -r ./trunk/* ./brizy/'
                sh 'cd ' + params.brizySvnPath + ' && zip -r "'+zipFileName+'" brizy/'
                sh 'cd ' + params.brizySvnPath + ' && rm -rf ./brizy'
            }
        }

        stage('Git Merge') {
            when {
                expression { return params.gitMerge }
            }
            steps {
                sh 'git commit -a -m "Build '+params.buildVersion+'"'
                sh 'git checkout -t origin/master'
                sh 'git merge --no-ff -m "Merge ['+params.releaseBranch+'] in master" '+params.releaseBranch
                sh 'git tag '+params.buildVersion
                sh 'git checkout -t origin/develop'
                sh 'git merge --no-ff -m "Merge ['+params.releaseBranch+'] in develop" '+params.releaseBranch

                sshagent (credentials: ['Git']) {
                    sh 'git push origin master && git push origin develop && git push origin --tags && git push origin '+params.releaseBranch
                }
            }
        }

        stage('Publish') {
            when {
                expression { return params.svnCommit }
            }
            steps {
                sh 'cd ' + params.brizySvnPath + ' && svn cp trunk tags/' + params.buildVersion
                sh 'cd ' + params.brizySvnPath + ' && svn commit --non-interactive --trust-server-cert --username themefusecom --password \''+params.svnPassword+'\'  -m "Version '+params.buildVersion+'"'
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
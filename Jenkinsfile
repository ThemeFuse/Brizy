def now = new Date()
def currentDate =  now.format("yyyy-MM-dd", TimeZone.getTimeZone('UTC'))
def changeLogs = params.changelog.replaceAll("\n","\\\\n").replaceAll("/",'\\\\/')
def buildTag = (!params.gitMerge)?"("+params.releaseBranch+")":"";
def zipFileName = "BuildFree-"+params.buildVersion+"-RC"+buildTag+".zip"

if(params.gitMerge) {
    zipFileName = "BuildFree-"+params.buildVersion+".zip"
}

env.BUILD_ZIP_PATH = params.brizySvnPath+"/"+zipFileName

def sendSlackMessage(String message) {
    message = message.replaceAll("'","\'").replaceAll("\n",'\n');
    withCredentials([string(credentialsId: 'slack-hook-url', variable: 'hook_urk')]) {
      sh """
        curl -X POST -H 'Content-type: application/json' --data '${message}' ${hook_urk}
      """
    }
}

def notifySlack(String buildResult = 'STARTED', String zipPath = '') {

    def slackMessage= '';
    def color = '';

     if ( buildResult == "SUCCESS" ) {
       slackMessage = "Job: ${env.JOB_NAME} with build number ${env.BUILD_NUMBER} was successful.";
       color = '#00ff00';
     }
     else if( buildResult == "FAILURE" ) {
       slackMessage = "Job: ${env.JOB_NAME} with build number ${env.BUILD_NUMBER} was failed.";
       color = '#ff0000';
     }
     else if( buildResult == "UNSTABLE" ) {
        slackMessage = "Job: ${env.JOB_NAME} with build number ${env.BUILD_NUMBER} was unstable.";
        color = '#ff8800';
     }
     else {
        slackMessage = "Job: ${env.JOB_NAME} with build number ${env.BUILD_NUMBER} its result was unclear.";
        color = '#ff8800';
     }

    def changelog = params.changelog.replaceAll('"','\"');

    def slackMessageJson = """
    {
        "attachments": [
            {
                "color": "${color}",
                "title": "${slackMessage}",
                "fields": [
                    {
                        "title": "Plugin version",
                        "value": "${params.buildVersion}",
                        "short": true
                    },
                    {
                        "title": "Editor version",
                        "value": "${params.editorVersion}",
                        "short": true
                    },
                    {
                        "title": "Branch",
                        "value": "${params.releaseBranch}",
                        "short": true
                    },
                    {
                        "title": "Changelog",
                        "value": "${changelog}",
                        "short": false
                    }
                ],
                "footer": "Brizy",
                "footer_icon": "https://brizy.io/wp-content/uploads/2018/02/logo-symbol.png"
            }
        ]
    }
    """;
    sendSlackMessage(slackMessageJson);

     if ( buildResult == "SUCCESS" ) {
       withCredentials([string(credentialsId: 'slack', variable: 'SECRET')]) {
            sh '''
                set +x
                curl -F file=@$BUILD_ZIP_PATH -F channels=#jenkins -F token="$SECRET" https://slack.com/api/files.upload
            '''
       }
     }



}

def folderExist(path){
    return sh(script: "test -d ${path} && echo 1 || echo 0", returnStdout: true).trim()=="1"
}

pipeline {
    agent any
    environment {
            GITHUB_TOKEN     = credentials('git-token')
            SUBVERSION_TOKEN     = credentials('svn-secret')
    }
    stages {
        stage('Version Update') {
            steps {

                script {
                    if(folderExist(params.brizySvnPath+"/tags/"+params.buildVersion)) {
                        error("Build failed because this version is already built.")
                    }
                }

                git url: "git@github.com:/ThemeFuse/Brizy",
                    credentialsId: 'Git',
                    branch: params.releaseBranch

                sh 'git remote set-branches --add origin master'
                sh 'git remote set-branches --add origin develop'
                sh 'git remote set-branches --add origin release'

                sh "sed -i 's/Version:\\s.\\{1,\\}\\..\\{1,\\}\\..\\{1,\\}/Version: ${params.buildVersion}/' brizy.php"
                sh "sed -i 's/^Stable tag:\\s.\\{1,\\}\\..\\{1,\\}\\..\\{1,\\}/Stable tag: ${params.buildVersion}/' readme.txt"
                sh "sed -i 's/^Stable tag:\\s.[^<]*/Stable tag: ${params.buildVersion}/' README.md"
                sh "sed -i \"s/'BRIZY_VERSION',\\s'.*'/'BRIZY_VERSION', '${params.buildVersion}'/\" brizy.php"
                sh "sed -i \"s/'BRIZY_EDITOR_VERSION',\\s'.*'/'BRIZY_EDITOR_VERSION', '${params.editorVersion}'/\" brizy.php"
                sh "sed -i \"s/'BRIZY_DEVELOPMENT',.[^\\)]*/'BRIZY_DEVELOPMENT', false /\" brizy.php"
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
                sh "/usr/local/bin/composer config -g github-oauth.github.com $GITHUB_TOKEN"
                sh 'cd ' + params.brizySvnPath + '/trunk && /usr/local/bin/composer clearcache'
                sh 'cd ' + params.brizySvnPath + '/trunk && /usr/local/bin/composer install --no-dev'
                sh 'cd ' + params.brizySvnPath + '/trunk && find . -type f -name "*.dev.php" -delete'
                sh 'cd ' + params.brizySvnPath + '/trunk && rm -rf  ./bin ./tests *.dist *.xml *.lock *.json *.yml .gitignore'
                sh 'cd ' + params.brizySvnPath + '/trunk && rm -rf ./vendor/twig/twig/test'
                sh 'cd ' + params.brizySvnPath + '/trunk && rm -rf ./vendor/twig/twig/ext/twig'
                sh 'cd ' + params.brizySvnPath + '/trunk && rm -rf ./vendor/twig/twig/doc'
                sh 'cd ' + params.brizySvnPath + '/trunk && rm -rf ./vendor/imagine/imagine/lib/Imagine/resources/Adobe/*.pdf'
                sh 'cd ' + params.brizySvnPath + '/trunk && rm -rf ./*.sh'
                sh 'cd ' + params.brizySvnPath + '/trunk && find . -type d -name ".git"  | xargs rm -rf'
                sh 'cd ' + params.brizySvnPath + '/trunk && find . -name ".gitignore" | xargs rm -rf'
                sh 'cd ' + params.brizySvnPath + '/trunk && find . -name ".gitmodules" | xargs rm -rf'
                sh 'cd ' + params.brizySvnPath + '/trunk && rm -rf ./Jenkinsfile'
                sh 'cd ' + params.brizySvnPath + '/trunk && if svn st | grep "!" > /dev/null; then  svn st | grep "!" | cut -d! -f2 | xargs svn rm; fi'
                sh 'cd ' + params.brizySvnPath + '/trunk && if svn st | grep "?" > /dev/null; then  svn st | grep "?" | cut -d? -f2 | xargs svn add; fi'
                sh 'cd ' + params.brizySvnPath + ' && rm -f Build-*'
                sh 'cd ' + params.brizySvnPath + ' && rm -rf brizy && mkdir brizy'
                sh 'cd ' + params.brizySvnPath + ' && cp -r ./trunk/* ./brizy/'
                sh 'cd ' + params.brizySvnPath + ' && zip -r "'+zipFileName+'" brizy/ -x .git -x .idea -x .gitignore'
                sh 'cd ' + params.brizySvnPath + ' && rm -rf ./brizy'
            }
        }

        stage('Publish') {
            when {
                expression { return params.svnCommit }
            }
            steps {
                sh 'cd ' + params.brizySvnPath + ' && svn cp trunk tags/' + params.buildVersion
                sh "cd " + params.brizySvnPath + " && svn commit --non-interactive --trust-server-cert --username themefusecom --password '$SUBVERSION_TOKEN'  -m \"Version "+params.buildVersion+"\""
            }
        }

         stage('Git Merge') {
            when {
                expression { return params.gitMerge }
            }
            steps {
                sh 'git add ./public/editor-build/'+params.editorVersion
                sh 'git commit -a -m "Build '+params.buildVersion+'"'

                sshagent (credentials: ['Git']) {
                   sh 'git push origin '+params.releaseBranch
                }

                sh 'git checkout -t origin/master'
                sh 'git merge --no-ff -m "Merge ['+params.releaseBranch+'] in master" '+params.releaseBranch
                sh 'git tag '+params.buildVersion

                sshagent (credentials: ['Git']) {
                    sh 'git push origin master'
                }

                sh 'git checkout -t origin/develop'
                sh 'git merge --no-ff -m "Merge ['+params.releaseBranch+'] in develop" '+params.releaseBranch

                sshagent (credentials: ['Git']) {
                    sh 'git push origin master && git push origin develop && git push origin --tags && git push origin '+params.releaseBranch
                }
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

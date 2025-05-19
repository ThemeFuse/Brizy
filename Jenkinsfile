def now = new Date()
def currentDate =  now.format("yyyy-MM-dd", TimeZone.getTimeZone('UTC'))
def buildTag = (!params.gitMerge)?"("+params.releaseBranch+")":"";
def zipFileName = "BuildFree-"+params.buildVersion+"-RC"+buildTag+".zip"

if(params.gitMerge) {
    zipFileName = "BuildFree-"+params.buildVersion+".zip"
}

def zipFilePath = "/tmp/"+zipFileName

def today = new Date();
def releaseDate = today.format( 'yyyy-MM-dd' );
def changelog = params.changelog.replaceAll('"','\"');
def discordFooter = "Version ${params.buildVersion}\n Editor Version: ${params.editorVersion}\n Release Branch: ${params.releaseBranch}"

env.BUILD_FOLDER_PATH = "/tmp/brizy"

pipeline {
    options {
        skipDefaultCheckout()
    }
    agent any
    environment {
            GITHUB_TOKEN     = credentials('git-token')
            SUBVERSION_TOKEN     = credentials('svn-secret')
            DISCORD_WEBHOOK_URL     = credentials('discord-webhook')
            S3_BUCKET_NAME     = credentials('s3-bucket-name')
    }
    stages {
        stage('Verifying requested version') {
            steps {
                 script {
                    if(folderExist(params.brizySvnPath+"/tags/"+params.buildVersion)) {
                        error("Build failed because this version is already built.")
                    }
                 }
            }
        }

        stage('CheckOut') {
            steps {
                sshagent (credentials: ['ssh_with_passphrase_provided']) {
                    sh("""
                        if git rev-parse --git-dir > /dev/null 2>&1; then
                          echo "The repo is already cloned"
                          ./jenkins/reset-repo.sh ./
                          git checkout -t origin/${params.releaseBranch}
                        else
                          git config --global user.email "jenkins@brizy.io
                          git config --global user.name "Jenkins Jenkinovici
                          git clone git@github.com:ThemeFuse/Brizy.git ./
                        fi
                     """)
                }
            }
        }

        stage('Prepare Composer') {
            steps {
                    sh('./jenkins/composer.sh $GITHUB_TOKEN')
            }
        }

        stage('Build editor client') {
            steps {
               sh "./jenkins/build-editor-client.sh ./public/editor-client"
            }
        }

        stage('Prepare the build') {
            steps {
                sh "./jenkins/version-update.sh ${params.buildVersion} ${params.minProVersion} ${params.editorVersion} ${params.syncVersion}"
                sh "./jenkins/update-tested-version.sh README.md readme.txt"
            }
        }

        stage('Update recompilation tag') {
            when { expression { return params.changeRecompilationTag } }
            steps {
                sh "./jenkins/update-recompilation-tag.sh"
            }
        }

        stage('Prepare i18n files') {
            steps {
                sh "./jenkins/i18n.sh"
            }
        }

        stage('Prepare changelog') {
            when {
                expression { return params.svnCommit }
            }
            steps {
                 writeFile file: 'changelog.txt', text: "\n= ${params.buildVersion} - ${releaseDate} =\n"+params.changelog+"\n"
                 writeFile file: 'changelog.md', text: "\n### ${params.buildVersion} - ${releaseDate}\n"+params.changelog+"\n"
                 sh "./jenkins/changelog-update.sh ./changelog.txt ./changelog.md"
                 sh "rm -rf changelog.txt changelog.md"
            }
        }

        stage('Make a copy and clean the plugin') {
            steps {
               sh "./jenkins/clean-files.sh ${BUILD_FOLDER_PATH}"
            }
        }

        stage('Create the Zip File') {
            steps {
                sh "./jenkins/prepare-zip.sh ${BUILD_FOLDER_PATH} \"$zipFilePath\""
            }
        }

        stage('Prepare SVN') {
            when {
                expression { return params.svnCommit }
            }
            steps {
                sh "./jenkins/prepare-svn.sh ${BUILD_FOLDER_PATH} ${params.brizySvnPath} ${params.buildVersion}"
            }
        }

        stage('Clean temporary folders') {
            steps {
                sh "rm -rf ${BUILD_FOLDER_PATH}"
            }
        }

        stage('Publish SVN changes') {
            when {
                expression { return params.svnCommit }
            }
            steps {
                 sh "cd " + params.brizySvnPath + " && svn commit --non-interactive --trust-server-cert --username themefusecom --password '$SUBVERSION_TOKEN'  -m \"Version "+params.buildVersion+"\""
            }
        }

        stage('Publish GIT changes') {
            when {
                expression { return params.gitMerge }
            }
            steps {
                sshagent (credentials: ['ssh_with_passphrase_provided']) {
                    sh "./jenkins/git-publish.sh ${params.buildVersion} ${params.editorVersion} ${params.releaseBranch}"
                }
            }
        }
    }

     post {
         success{
            sh "cp '${zipFilePath}' ./"
            archiveArtifacts zipFileName
            discordSend title: JOB_NAME, footer: discordFooter, link: env.BUILD_URL, result: currentBuild.currentResult, description: "Changelog: \n ${changelog}\n\n [Download]("+artifactUrl(env.S3_BUCKET_NAME,zipFileName)+")", webhookURL: env.DISCORD_WEBHOOK_URL
            sh "rm '${zipFilePath}'"
            sh "rm *.zip"
         }

         failure{
            discordSend title: JOB_NAME, footer: discordFooter, link: env.BUILD_URL, result: currentBuild.currentResult, description: "Changelog: \n ${changelog}", webhookURL: env.DISCORD_WEBHOOK_URL
         }

         aborted{
            discordSend title: JOB_NAME, footer: discordFooter, link: env.BUILD_URL, result: currentBuild.currentResult, description: "Changelog: \n ${changelog}", webhookURL: env.DISCORD_WEBHOOK_URL
         }

         always {

            sshagent (credentials: ['ssh_with_passphrase_provided']) {
                    sh "./jenkins/reset-repo.sh ./"
                }
         }
     }
}

def folderExist(path){
    return sh(script: "test -d ${path} && echo 1 || echo 0", returnStdout: true).trim()=="1"
}

def artifactUrl(bucket,fileName) {
    def jobNameUrlified = JOB_NAME.replaceAll(' ','+');
    return "https://${bucket}.s3.amazonaws.com/${jobNameUrlified}/${BUILD_NUMBER}/artifacts/${fileName}"
}
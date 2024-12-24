library identifier: 'commonPipeline@main', retriever: modernSCM([$class: 'GitSCMSource',
    remote: 'git@github.com:meghdo-cloud/shared-libraries.git',
    credentialsId: 'jenkins_agent_ssh'])
commonPipeline (
    projectId: "meghdo-4567",
    clusterName: "meghdo-cluster",
    clusterRegion: "europe-west1",
    appName: "drizzlenodejs",
    dockerRegistry: "europe-west1-docker.pkg.dev",
    namespace: "default",
    scanOWASP: "false",  // OWASP Scanning takes about 7-10 min of scanning time, turn on when scanning is needed
    label: 'nodejs'
) {
    container('nodejs') {
        sh """
        npm install --omit=dev
        """
    }
}   

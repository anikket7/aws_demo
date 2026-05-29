pipeline {
	agent any

	stages {
		stage('Checkout') {
			steps {
				checkout scm
			}
		}

		stage('Install Dependencies') {
			steps {
				sh 'cd backend && npm ci'
				sh 'cd frontend && npm ci'
			}
		}

		stage('Build Frontend') {
			steps {
				sh 'cd frontend && npm run build'
			}
		}

		stage('Build Docker Image') {
			steps {
				sh 'docker build -t expense-tracker-backend -f Dockerfile .'
			}
		}
	}
}

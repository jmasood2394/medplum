MEDPLUM IMPLEMENTATION FOR MDR

### Prerequisites

Before cloning the repo, ensure the server has the following installed.

- Docker
- Docker compose
- Valid SSL certificates (or use self-signed certificates)

#### Installation of Docker and Docker compose:

These instructions are for a VM running on Ubuntu. For any other OS distribution please refer to official docker documentation at https://docs.docker.com/engine/install.

Steps:
1. Update the OS packages
```bash
sudo apt update && sudo apt upgrade -y
```
2. Run the following command to uninstall all conflicting packages:
```bash
for pkg in docker.io docker-doc docker-compose docker-compose-v2 podman-docker containerd runc; do sudo apt-get remove $pkg; done
```
3. Setup Docker Repository by running the following commands:
```bash
# Add Docker's official GPG key:
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
```
4. Install the Docker packages:
```bash
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```
5. Verify that the installation is successful:
```bash
sudo docker run hello-world
```
This command downloads a test image and runs it in a container. When the container runs, it prints hello-world and exits
6. Create the docker group
```bash
sudo groupadd docker
```
7. Add your user to the docker group
```bash
sudo usermod -aG docker $USER
```
8. Logout and log back in to verify membership
9. Verify that you can run docker commands without sudo.

#### Configuration

Before running the application make sure to update the following.

1. **Environment Variables for Docker**
Update the `.env` file in the root of the project to the desired values.

2. **Medplum Configuration**
Update the following sections in `medplum.config.json` file
- `"appBaseUrl": "https://test.5a9.com/"`
  *(Update the domain)*
- `"storageBaseUrl": https://test.5a9.com/api/storage/`
  *(Update the domain)*
- `"supportEmail": "\"Medical Digital Records\" <admin@5a9.com>"`
  *(Update email to match the From email setup in SendGrid)*
- Add API Key from SendGrid for Password
```json
    "smtp": {
       "host": "smtp.sendgrid.net",
       "port": 587,
       "username": "apikey",
       "password": "apikeyfromsendgrid"
    }
```
- `"recaptchaSiteKey": "recaptchasitekeyfromgoogle",`
  *(Add recaptchaSiteKey from Google)*
- `"recaptchaSecretKey": "recaptchasecretkeyfromgoogle",`
  *(Add recaptchaSecretKey from Google)*
- The dbname, username and password should match the values in the .env file defined in the previous step
```json
    "database": {
        "host": "postgres",
        "port": 5432,
        "dbname": "medplum",
        "username": "medplum",
        "password": "medplum"
    },
```
- The password should match the values in the .env file defined in the previous step
```json
    "redis": {
        "host": "redis",
        "port": 6379,
        "password": "medplum"
    },
```

3.	**Nginx Configuration**
Update the `server_name` in `nginx.conf` to the required domain name.

4.	**Update Environment Variables for Frontend**
Update the following section in the `.env.defaults` file located at `project-root/medplum/packages/app`:
```bash
MEDPLUM_BASE_URL=https://test.5a9.com/api
```
*(Update the domain)*

#### Running the Application

Run the following command from the root of the project
```bash
$ docker compose up -d
```

This will build and run all the required containers for the application. Once the build is complete allow the backend to create the required database schema before accessing the application. It can take between 4 to 5 minutes to complete.

#### Stopping the Application
Run the following command from the root of the project to stop the application
```bash
$ docker compose down
```

#### NOTES:

The frontend application needs to be rebuilt anytime there is a change in the domain name. To accomplish this, stop the application and remove the existing docker image by running the following command.
```bash
$ docker rmi medplum-medplum-frontend
```
Running the application again will build a new frontend image with the updated domain name.
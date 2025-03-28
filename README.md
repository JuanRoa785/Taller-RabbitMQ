# Taller-RabbitMQ
## 📌 Introducción
En el desarrollo de software, existen múltiples arquitecturas diseñadas para abordar distintas necesidades, desde los modelos monolíticos hasta los de microservicios y comunicación asíncrona. Este proyecto se centra en la implementación del modelo **publish/subscribe**, donde:

- Un **productor** envía mensajes.

- Un **broker de mensajería** (RabbitMQ) los distribuye.

- Un **consumidor** los recibe según sus suscripciones.

El objetivo principal es proporcionar un ejercicio práctico y didáctico en el que se implementa esta arquitectura con diferentes tecnologías en el backend, facilitando su **despliegue** mediante contenedores con Docker y Docker Compose.

## 🛠️ Tecnologías utilizadas
![image](https://github.com/user-attachments/assets/ee0a98eb-99af-4bc9-aec5-a7898eb079eb)

| Componente      | Tecnología                                           | Descripción |
|----------------|------------------------------------------------------|-------------|
| **Frontend**   | ![HTML](https://img.shields.io/badge/HTML-orange?logo=html5&logoColor=white) ![CSS](https://img.shields.io/badge/CSS-blue?logo=css3&logoColor=white) ![JS](https://img.shields.io/badge/JavaScript-yellow?logo=javascript&logoColor=black) ![Nginx](https://img.shields.io/badge/-NGINX-009639?style=flat-square&logo=nginx&logoColor=white) | Aplicación web con HTML, CSS y JavaScript clásico, desplegada en **NGINX**. |
| **Backend (Python)** | ![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white) ![Python](https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white) | Implementado con **FastAPI**, manejando las solicitudes HTTP y la comunicación con RabbitMQ. |
| **Backend (C#)** | ![.NET](https://img.shields.io/badge/.NET-512BD4?logo=dotnet&logoColor=white) | API desarrollada con **.NET**, integrada con RabbitMQ para la mensajería. |
| **Backend (Java)** | ![Spring Boot](https://img.shields.io/badge/SpringBoot-6DB33F?logo=springboot&logoColor=white) | API basada en **Spring Boot**, interactuando con el broker de mensajería. |
| **Broker** | ![RabbitMQ](https://img.shields.io/badge/RabbitMQ-FF6600?logo=rabbitmq&logoColor=white) | Se utilizó **RabbitMQ** como sistema de mensajería basado en AMQP. |
| **Despliegue** | ![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white) ![Docker Compose](https://img.shields.io/badge/Docker_Compose-2496ED?logo=docker&logoColor=white) | Contenedores gestionados con **Docker** y **Docker Compose**. |
| **Entorno de Desarrollo** | ![Ubuntu](https://img.shields.io/badge/Ubuntu-22.04-orange?logo=ubuntu) ![VS Code](https://img.shields.io/badge/VS_Code-007ACC?logo=visualstudiocode&logoColor=white) ![NetBeans](https://img.shields.io/badge/NetBeans-22-lightgrey?logo=apache-netbeans-ide) ![IntelliJ](https://img.shields.io/badge/IntelliJ-000000?logo=intellijidea&logoColor=white) | Entorno de desarrollo en **Ubuntu 22.04**, utilizando **VS Code, Apache NetBeans e IntelliJ**. |

## 🚀 Versiones de despliegue
Este proyecto cuenta con tres versiones de despliegue, cada una adaptada a diferentes entornos:

- 1️⃣ **v1**: Todo en una sola máquina virtual.
- 2️⃣ **v2**: RabbitMQ en una máquina, backend y frontend en otra.
- 3️⃣ **v3**: RabbitMQ en una máquina, backend en otra y frontend en otra.

## 🛠️ Guía de Despliegue en ![Ubuntu](https://img.shields.io/badge/Ubuntu-22.04-orange?logo=ubuntu)

### Verificar que Docker y Docker Compose estan instalados:
```bash
docker --version
docker compose version #Versiones nuevas
docker-compose version #Versiones más antiguas
```
**Si Docker y Docker Compose no están instalados, puedes seguir este tutorial:**  
- 🔗 [Guía de instalación en DigitalOcean](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-20-04-es)  **O simplemente consultar a tu IA de confianza. 😉**

### Clonar el Repositorio:
```bash
git clone https://github.com/JuanRoa785/Taller-RabbitMQ.git

#Verificar que se clonó correctamente:

#Deberá aparecer un directorio (Carpeta) llamado Taller-RabbitMQ
ls 
```

### Hacer building de las imágenes:
```bash
#Nos posicionamos en la raiz del proyecto
cd Taller-RabbitMQ 

#Otorgamos permisos de ejecución al script para hacer el building
chmod +x createImages.sh

#Ejecutar el script, se demorará un poco la primera vez que se ejecute
./createImages.sh
```

### Acceder al directorio del docker-compose según la disponibilidad de equipos:
- **v1**: Una maquina
- **v2**: Dos maquinas
- **v3**: Tres maquinas

```bash
#Estando en la raiz del proyecto
cd docker/vx #x depende del número de maquinas involucradas en el despliegue
```

Si el despliegue de la aplicación se realizará en la versión v1 dentro de una máquina virtual, será necesario actualizar el archivo docker-compose.yaml. Esto se puede hacer utilizando `nano docker-compose.yaml` o desde un IDE como Visual Studio Code. En este archivo, se debe configurar la variable `API_URL` con la dirección IP de la máquina virtual donde se ejecutará `docker compose up -d`, lo que resultará así:
```yaml
  #back_python se deja igual

  front_python:
    image: front_taller
    container_name: front_python
    environment:
      - API_URL=DIRECCIÓN_IP_MV:8000 #El puerto se deja igual
      - PUBLISHER=Python
    ports:
      - 8080:80

  #back_Dotnet# se deja igual

  front_dotnet:
    image: front_taller
    container_name: front_dotnet
    environment:
      - API_URL=DIRECCIÓN_IP_MV:5040 #El puerto se deja igual
      - PUBLISHER=C#
    ports:
      - 8081:80

  #back_Java se deja igual

  front_java:
      image: front_taller
      container_name: front_java
      environment:
        - API_URL=DIRECCIÓN_IP_MV:7070 #El puerto se deja igual
        - PUBLISHER=Java
      ports:
        - 8082:80
``` 

### Levantar el contenedor de RabbitMQ:
- Solo aplica para v2 y v3
```bash
#Estando docker/v2 o docker/v3:
cd rabbit\ host/

#Estando en la raiz del proyecto:
cd docker/v2/rabbit\ host/

#Levantar el contenedor
docker compose up -d
```

### Actualizar el valor de las variables de entorno `RABBIT_URL` en el back y `API_URL` en el front según la versión del despliegue:

#### Para v2:
- Acceder al directorio donde esta el docker-compose.yaml:
  ```bash
  #Estando en docker/v2
  cd ../publisher_consumer\ host/
  ```
 - Actualizar el docker-compose.yaml `nano docker-compose.yaml`; tambien se puede hacer desde VSC o cualquier otro IDE:
    ```yaml
      services:
        back_python:
          image: back_python
          container_name: back_python
          environment:
            - RABBIT_URL=IP_DONDE_SE_ESTA_EJECUTANDO_RABBIITMQ
          restart: always
          ports:
            - 8000:8000
        
        front_python:
          image: front_taller
          container_name: front_python
          environment:
            - API_URL=IP_MV:8000 #Si se ejecuta en local tomaría el valor de localhost:8000
            - PUBLISHER=Python
          ports:
            - 8080:80
      
        back_dotnet:
          image: back_dotnet
          container_name: back_dotnet
          environment:
            - RABBIT_URL=IP_DONDE_SE_ESTA_EJECUTANDO_RABBIITMQ
          restart: always
          ports:
            - 5040:5040
        
        front_dotnet:
          image: front_taller
          container_name: front_dotnet 
          environment:
            - API_URL=IP_MV:5040 #Si se ejecuta en local tomaría el valor de localhost:5040
            - PUBLISHER=C#
          ports:
            - 8081:80
      
        back_java:
          image: back_java
          container_name: back_java
          environment:
            - RABBIT_URL=IP_DONDE_SE_ESTA_EJECUTANDO_RABBIITMQ
          restart: always
          ports:
            - 7070:7070
        
        front_java:
          image: front_taller
          container_name: front_java
          environment:
            - API_URL=IP_MV:7070 #Si se ejecuta en local tomaría el valor de localhost:7070
            - PUBLISHER=Java
          ports:
            - 8082:80
      ```
 - Levantar los 6 contenedores con `docker compose up -d`

#### Para v3:
- Acceder al directorio donde esta el docker-compose.yaml del back:
  ```bash
  #Estando en docker/v3/rabbithost
  cd ../back\ host/

  #Estando en docker/v3
  cd back\ host/
  ```
  
- Actualizar el valor de la variable de entorno de `RABBIT_URL`:
  ```yaml
      services:
        back_python:
          image: back_python
          container_name: back_python
          environment:
            - RABBIT_URL=IP_DONDE_SE_ESTA_EJECUTANDO_RABBIITMQ
          restart: always
          ports:
            - 8000:8000
  
        back_dotnet:
          image: back_dotnet
          container_name: back_dotnet
          environment:
            - RABBIT_URL=IP_DONDE_SE_ESTA_EJECUTANDO_RABBIITMQ
          restart: always
          ports:
            - 5040:5040
      
        back_java:
          image: back_java
          container_name: back_java
          environment:
            - RABBIT_URL=IP_DONDE_SE_ESTA_EJECUTANDO_RABBIITMQ
          restart: always
          ports:
            - 7070:7070
    ```
    Luego levantar los 3 contenedores con `docker compose up -d`
    > ⚠ **Importante:** No despliegues el backend en tu máquina local si el frontend se ejecutará en una máquina virtual, ya que no podrá acceder a él.

- Actualizar el valor de la variable de entorno de `API_URL` en el `docker-compose.yaml` en el directorio **front host**:
  Primero se accede al directorio del front:
   ```bash
    #Estando en docker/v3/back host
    cd ../front\ host/
  
    #Estando en docker/v3
    cd front\ host/
   ```
   Luego se actualiza el `docker-compose.yaml` quedando:
   ```yaml
    services:
      front_python:
        image: front_taller
        container_name: front_python
        environment:
          - API_URL=IP_MV_DEL_BACK:8000
          - PUBLISHER=Python
        ports:
          - 8080:80
      
      front_dotnet:
        image: front_taller
        container_name: front_dotnet
        environment:
          - API_URL=IP_MV_DEL_BACK:5040
          - PUBLISHER=C#
        ports:
          - 8081:80
      
      front_java:
        image: front_taller
        container_name: front_java
        environment:
          - API_URL=IP_MV_DEL_BACK:7070
          - PUBLISHER=Java
        ports:
          - 8082:80
   ```
   Luego levantar los 3 contenedores con `docker compose up -d`
    > ℹ️ **Nota**: El frontend si podrás ejecutarlo en tu maquina local, siempre y cuando especifiques correctamente la `API_URL` para acceder al back.
  ----
  
### 📌 Resumen del Despliegue
1. Elegir la versión de despliegue a utilizar.  
2. Iniciar el contenedor de **RabbitMQ**.
3. Configurar las variables de entorno:
   - `RABBIT_URL` para el backend.  
   - `API_URL` para el frontend (si aplica).
4. Levantar los 6 contenedores restantes (3 backends y 3 frontends) ejecutando `docker compose up -d` en las máquinas y directorios correspondientes.  
5. Acceder al frontend desde el navegador:
   - **Python** en `http://IP_FRONT:8080`  
   - **C#** en `http://IP_FRONT:8081`  
   - **Java** en `http://IP_FRONT:8082`
     
## 📚 Más Documentación  

Para una explicación más detallada, consulta los siguientes recursos:  

📄 **[Documentación Completa](./documentacion.pdf)** – Archivo PDF con información detallada sobre la implementación.  
🎥 **[Video Explicativo](#)** – Próximamente en YouTube.  
  


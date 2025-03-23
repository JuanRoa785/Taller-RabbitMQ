FROM nginx:alpine

#Instalamos nano y bash
RUN apk update && \
    apk add bash nano
    
#Copiamos la carpeta frontend a la ruta de nginx
COPY ./frontend/ /usr/share/nginx/html/

#Copiamos la configuración de nginx
COPY nginx.conf /etc/nginx/nginx.conf

#Copiamos el script para generar la variable de entorno en config.js
COPY docker-entrypoint.sh /docker-entrypoint.sh

#Le damos permisos de ejecución al script
RUN chmod +x /docker-entrypoint.sh

#Ejecutamos el script
ENTRYPOINT ["/docker-entrypoint.sh"]

#Exponemos el puerto
EXPOSE 80

#Ejecutamos nginx
CMD ["nginx", "-g", "daemon off;"]
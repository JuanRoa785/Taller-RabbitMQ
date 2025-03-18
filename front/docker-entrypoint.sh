#!/bin/sh

# Ruta donde esta el config.js dentro del contenedor
CONFIG_PATH=/usr/share/nginx/html/estaticos/config.js

# Escribe la variable de entorno en el config.js dentro de la carpeta correcta
echo "window.API_URL = '${API_URL}';" > $CONFIG_PATH
echo "window.PUBLISHER = '${PUBLISHER}';" >> $CONFIG_PATH ## >> Significa Append

exec "$@"
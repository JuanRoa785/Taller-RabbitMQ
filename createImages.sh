#!/bin/bash

echo "Eliminando imágenes antiguas:"

# Eliminar imágenes antiguas
docker rmi back_python:latest
docker rmi back_dotnet:latest
docker rmi back_java:latest

echo ""
echo "Construyendo imágenes:"

# Construcción de imágenes desde la raíz del proyecto
cd back/python || exit
docker build -t back_python .

cd ../C# || exit
docker build -t back_dotnet .

cd ../java || exit
docker build -t back_java .

# Construcción del frontend
cd ../../front || exit
docker build -t front_taller .

echo ""
echo "Proceso completado."
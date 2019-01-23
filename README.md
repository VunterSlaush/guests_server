# Instalación del Servidor

# Pre-requisitos
1. Instalar [Nodejs](https://nodejs.org/es/)
2.  Instalar [MongoDB](https://www.mongodb.com/download-center/community)
3.  Clonar el proyecto.

# Pasos para la instalación
1. Crear una Base de datos, sobre la instalacion previa de MongoDB, esto puede hacerse desde cualquier cliente para base de datos Mongo, recomendamos [Robo3T](https://robomongo.org/)
2. Procedemos a dirigirnos desde la terminal o consola, a la carpeta donde esta clonado el proyecto, y parados en esta, corremos el comando **npm install**, esto instalara todas las dependencias necesarias del proyecto.
3. Para la configuracion del Puerto en el que correra el servidor y la base de datos que usara el mismo, en la carpeta raiz del proyecto encontrara un archivo llamada **.env** en el mismo deberan estar 2 Variables definidas 
		
		1. **PORT** : esta variable define el puerto en el cual correra el servidor.
		2. **MONGODB_URI**: esta variable define el acceso a la base de datos, esta posee el siguiente formato:
	> mongodb://USUARIO:PASSWORD@HOST:PUERTO/NOMBRE DE LA BASE DE DATOS

4. Para poner en marcha el servidor, desde la terminal y parado en la carpeta raiz del proyecto, solo basta con correr el comando **npm start** 

# Al estar en una red corporativa, se asume que el build ya se ha generado localmente.
# Es necesario ejecutar "npm run build" en el CMD local antes de dockerizar.
FROM nginx:alpine

# Copiar los archivos estáticos generados en la carpeta /dist
COPY dist /usr/share/nginx/html

# Copiar nuestra configuración personalizada de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer el puerto
EXPOSE 80

# Comando para iniciar nginx
CMD ["nginx", "-g", "daemon off;"]

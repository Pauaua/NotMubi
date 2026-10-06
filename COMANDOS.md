Orden correcto arranque 
Regla de oro: Eureka siempre primero, el resto no importa el orden. 


1️⃣ Eureka (discovery-server) — SIEMPRE EL PRIMERO

powershell
mvn -pl backend/discovery-server spring-boot:run
Puerto: 8761
Verificar: http://localhost:8761

2️⃣ Auth Service — segundo (los demás lo necesitan)
powershell
mvn -pl backend/auth-service spring-boot:run
Puerto: 8081

3️⃣ Catalog Service
powershell 
mvn -pl backend/catalog-service spring-boot:run
Puerto: 8082

4️⃣ Subscription-Service 
powershell
mvn -pl backend/subscription-service spring-boot:run

Finalmente: 
API Gateway — el último (necesita que los demás estén arriba)
powershell

mvn -pl backend/api-gateway spring-boot:run

Puerto: 8080


🛑 Parar servicios

Ctrl + C

🧹 Comandos de rescate (cuando algo falla)
Limpiar el target/ de un servicio
powershell

Remove-Item -Recurse -Force backend\NOMBRE-SERVICIO\target

Ejemplos:
powershell

Remove-Item -Recurse -Force backend\catalog-service\target
Remove-Item -Recurse -Force backend\api-gateway\target
Remove-Item -Recurse -Force backend\auth-service\target

Limpiar TODOS los target/ de golpe
powershell

Remove-Item -Recurse -Force backend\*\target

Instalar el POM padre (cuando cambies el padre)
powershell

mvn -N install

Matar TODOS los procesos Java (cuando hay puertos ocupados)
powershell

Get-Process java -ErrorAction SilentlyContinue | Stop-Process -Force

Ver qué ocupa un puerto
powershell

netstat -ano | findstr :8761
netstat -ano | findstr :8080
netstat -ano | findstr :8081
netstat -ano | findstr :8082

Compilar todos los módulos sin arrancarlos
powershell

mvn clean install -DskipTests

🐳 Comandos de Docker (Postgres)
Ver si Postgres está corriendo
powershell

docker ps

Arrancar Postgres (si no está corriendo)
powershell

docker start notmubi-postgres

Parar Postgres
powershell

docker stop notmubi-postgres

Ver logs de Postgres
powershell

docker logs notmubi-postgres

Entrar a psql (base de datos del catálogo)
powershell

docker exec -it notmubi-postgres psql -U notmubi -d notmubi_catalog

Entrar a psql (base de datos de auth)
powershell

docker exec -it notmubi-postgres psql -U notmubi -d notmubi_auth

Crear una base de datos nueva
powershell

docker exec -it notmubi-postgres psql -U notmubi -d postgres -c "CREATE DATABASE notmubi_xxx;"

Listar bases de datos
powershell

docker exec -it notmubi-postgres psql -U notmubi -d postgres -c "\l"

Ver tablas de la BD del catálogo
powershell

docker exec -it notmubi-postgres psql -U notmubi -d notmubi_catalog -c "\dt"

Ver tablas de la BD del auth
powershell

docker exec -it notmubi-postgres psql -U notmubi -d notmubi_auth -c "\dt"

🧪 Comandos de prueba (endpoints)
Catálogo (directo)
powershell

Invoke-RestMethod http://localhost:8082/api/movies

Catálogo (a través del Gateway)
powershell

Invoke-RestMethod http://localhost:8080/api/movies

Rutas del Gateway
powershell

Invoke-RestMethod http://localhost:8080/actuator/gateway/routes

Health del catálogo
powershell

Invoke-RestMethod http://localhost:8082/actuator/health

Registrar usuario en auth
powershell

$body = '{"username":"pau","password":"secret123","email":"pau@notmubi.com"}'
Invoke-RestMethod -Uri http://localhost:8081/auth/register -Method Post -Body $body -ContentType "application/json"

Login en auth
powershell

$body = '{"username":"pau","password":"secret123"}'
Invoke-RestMethod -Uri http://localhost:8081/auth/login -Method Post -Body $body -ContentType "application/json"

🎯 Flujo de trabajo diario

Al empezar a trabajar (arrancar todo):
text

Terminal 1:  mvn -pl backend/discovery-server spring-boot:run
   (esperar a "Started DiscoveryServerApplication")

Terminal 2:  mvn -pl backend/auth-service spring-boot:run
   (esperar a "Started AuthServiceApplication")

Terminal 3:  mvn -pl backend/catalog-service spring-boot:run
   (esperar a "Started CatalogServiceApplication")

Terminal 4:  mvn -pl backend/api-gateway spring-boot:run
   (esperar a "Started ApiGatewayApplication")

Al terminar (parar todo):
text

Ir a cada terminal y pulsar Ctrl + C

Si algo va raro:
powershell

# 1. Parar todo
Get-Process java -ErrorAction SilentlyContinue | Stop-Process -Force

# 2. Limpiar targets
Remove-Item -Recurse -Force backend\*\target

# 3. Arrancar de nuevo en orden

📋 Puertos de referencia
Servicio	Puerto	URL
discovery-server	8761	http://localhost:8761
api-gateway	8080	http://localhost:8080
auth-service	8081	http://localhost:8081
catalog-service	8082	http://localhost:8082
Postgres (Docker)	5432	(Docker, no navegable)

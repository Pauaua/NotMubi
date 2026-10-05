-- Este script se ejecuta UNA sola vez, la primera vez que arranca Postgres.
-- Crea las bases de datos de cada microservicio.

CREATE DATABASE notmubi_auth;
CREATE DATABASE notmubi_catalog;
-- Aquí añadirás más cuando crees más servicios:
-- CREATE DATABASE notmubi_subscription;
-- CREATE DATABASE notmubi_history;
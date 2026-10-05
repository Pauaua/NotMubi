-- Películas malas de culto precargadas para NotMubi
-- Solo se insertan si no existen (por el título)

INSERT INTO movies (title, release_year, director, cult_level, rating, synopsis) VALUES
('The Room', 2003, 'Tommy Wiseau', 'LEGENDARY', 1.5, 'You are tearing me apart, Lisa! Una obra maestra incomprendida del cine independiente.'),
('Sharknado', 2013, 'Anthony C. Ferrante', 'SO_BAD_IT_IS_GOOD', 3.5, 'Tiburones en un tornado. Sí, literalmente. Y hay 5 secuelas.'),
('Plan 9 from Outer Space', 1959, 'Ed Wood', 'LEGENDARY', 2.0, 'Los extraterrestres quieren conquistar la Tierra resucitando muertos. Considerada la peor película de la historia.'),
('Troll 2', 1990, 'Claudio Fragasso', 'SO_BAD_IT_IS_GOOD', 2.5, 'No aparece ningún troll. Es sobre goblins vegetarianos. La escena del pop corn es legendaria.'),
('Manos: The Hands of Fate', 1966, 'Harold P. Warren', 'LEGENDARY', 1.0, 'Un vendedor de fertilizantes hizo esta peli por una apuesta. El personaje "Torgo" merece estudio aparte.'),
('Birdemic: Shock and Terror', 2010, 'James Nguyen', 'SO_BAD_IT_IS_GOOD', 2.0, 'Los pájaros atacan. Los efectos especiales son tan malos que son arte.'),
('The Disaster Artist', 2017, 'James Franco', 'HIDDEN_GEM', 7.5, 'La peli sobre cómo se hizo The Room. Esta sí es buena, pero es de culto obligatorio.'),
('Miami Connection', 1987, 'Y.K. Kim', 'HIDDEN_GEM', 4.0, 'Ninjas, moteros, Tae Kwon Do y una banda de rock. Todo lo que está mal hecho, hecho con amor.'),
('Samurai Cop', 1991, 'Amir Shervan', 'SO_BAD_IT_IS_GOOD', 3.0, 'Policía con peluca que se quita y se pone. Escenas de acción sin sentido. Diálogos imposibles.'),
('The Amazing Bulk', 2012, 'Lewis Schoenbrun', 'LEGENDARY', 1.5, 'Un científico se convierte en una masa morada con CGI de 1995. Es tan mala que duele.');
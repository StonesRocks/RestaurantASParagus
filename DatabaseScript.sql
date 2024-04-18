DROP DATABASE IF EXISTS ASPARAGUSDB;
CREATE DATABASE ASPARAGUSDB;

USE ASPARAGUSDB;

CREATE TABLE Users(
	user_id INT PRIMARY KEY AUTO_INCREMENT,
	user_name VARCHAR(64) UNIQUE,
    user_hash VARCHAR(255)
);

CREATE TABLE Ingredients(
	ingredient_id INT PRIMARY KEY AUTO_INCREMENT,
    ingredient_name VARCHAR(64) UNIQUE,
    ingredient_description VARCHAR(255)
);

CREATE TABLE Recipes(
	recipe_id INT PRIMARY KEY AUTO_INCREMENT,
    recipe_name VARCHAR(64) UNIQUE,
    recipe_instructions TEXT
);

CREATE TABLE RecipeIngredients(
	recipe_id INT,
    ingredient_id INT,
    quantity VARCHAR(64),
    PRIMARY KEY (recipe_id, ingredient_id),
    FOREIGN KEY (recipe_id)
		REFERENCES Recipes(recipe_id),
	FOREIGN KEY (ingredient_id)
		REFERENCES Ingredients(ingredient_id)
);

CREATE TABLE Bookings(
	booking_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    guests INT,
    date DATE
);

CREATE INDEX idx_user_id ON Users(user_id);
CREATE INDEX idx_recipe_id ON RecipeIngredients(recipe_id);
CREATE INDEX idx_ingredient_id ON RecipeIngredients(ingredient_id);

DROP USER IF EXISTS 'ASParagus_admin'@'localhost';
DROP USER IF EXISTS 'ASParagus_user'@'localhost';
CREATE USER 'ASParagus_admin'@'localhost' IDENTIFIED BY 'adminPass';
GRANT ALL PRIVILEGES ON ASParagus_admin.* to 'ASParagus_admin'@'localhost';
GRANT EXECUTE ON ASPARAGUSDB.* TO 'ASParagus_admin'@'localhost';

CREATE USER 'ASParagus_user'@'localhost' IDENTIFIED BY 'userPass';
GRANT ALL PRIVILEGES ON ASPARAGUSDB.Bookings TO 'ASParagus_user'@'localhost';
FLUSH PRIVILEGES;

DELIMITER $$
CREATE PROCEDURE SearchUsersByUsername(
    IN p_Username VARCHAR(64)
)
BEGIN
    SELECT *
    FROM Users
    WHERE user_name LIKE CONCAT('%', p_Username, '%');
END $$
DELIMITER ;
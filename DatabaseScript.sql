DROP USER IF EXISTS 'ASParagus_admin'@'localhost';
DROP USER IF EXISTS 'ASParagus_user'@'localhost';

CREATE USER 'ASParagus_admin'@'localhost' IDENTIFIED BY 'adminPass';
GRANT ALL PRIVILEGES ON ASParagusDb.* TO 'ASParagus_admin'@'localhost';

CREATE USER 'ASParagus_user'@'localhost' IDENTIFIED BY 'userPass';
GRANT ALL PRIVILEGES ON ASParagusDb.Bookings TO 'ASParagus_user'@'localhost';

FLUSH PRIVILEGES;
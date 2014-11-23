Setting Up and Reformatting the Database
========================================

#Preparation
##postgres
Ensure you have postgreSQL installed on your machine. If you've completed workshop 3, you'll probably have it installed

##postgres node modue: pg
Currently, npm install won't be necessary for the pg module. The node_modules direcotry containing pg is inlcuded in the cookModule/ directory, where it is used. This will need to be changed, but for now, you don't have to worry about npm prep for this module.

#Database Setup
Run the createDataBase.sh script

	$ bash createDataBase.sh

#The Script
The script interacts with the .sql files in this directory
-  **drop.sql** will purge existing cookups tables from your database
-  **schema.sql** will create cookups tables in your database
-  **populate_db.sql** will create starter entries in your database. A few users and recipes.

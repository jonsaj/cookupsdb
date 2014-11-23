insert into users values(DEFAULT, 'Danny DeVito', 'dannydevito@gmail.com', 'dannypassword', 'Im Danny DeVito, and I cant cook.', 'userpicture_1');
insert into users values(DEFAULT, 'Timothy Richards', 'richards@cs.umass.edu', 'timmothypassword', 'I like chocolate, probably.', 'userpicture_2');
insert into users values(DEFAULT, 'Jeeves', 'jeeves@ask.com', 'jeevespassword', 'Im no longer relevant.', 'userpicture_3');


insert into recipes values(DEFAULT, 'Average Asparagus', '{"asparagus"}', 'Take asparagus. Make asparagus', 15, 6, .1, .1, 0, 0, .3, .2, 4,29, 'rec_img_1');
insert into recipes values(DEFAULT, 'Basic Buttered Toast', '{"bread", "butter", "milk"}', 'Toast some bread, butter some Toast. Complex.', 5, 1, DEFAULT, DEFAULT, DEFAULT, DEFAULT, .2, DEFAULT, 5,9, 'rec_img_2');
insert into recipes values(DEFAULT, 'Corny Cutlet', '{"milk", "eggs", "butter"}', 'Take ingredients, make cutlet. Easy.', 200, 3, .8, 0, DEFAULT, DEFAULT, DEFAULT, 0, 5,50, 'rec_img_3');
insert into recipes values(DEFAULT, 'Default Doughnut', '{"flour", "butter", "milk"}', 'Make a doughnut', 60, 10, 1, 0, 1, 0, .2, 0, 5,15, 'rec_img_4');
insert into recipes values(DEFAULT, 'famous faghetti', '{"bread", "flour"}', 'take some bread and flour. make faghetti. It is famous', 25, 2, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT,DEFAULT, 'rec_img_5');

insert into blogs values(DEFAULT, 1, 'User 1 First Blog Entry', '2014-11-21 09:12:40', 'I am number 1!');
insert into blogs values(DEFAULT, 2, 'User 2 First Blog Entry', '2014-11-21 09:30:40', 'I am number 2.');
insert into blogs values(DEFAULT, 2, 'User 2 Second Blog Entry', '2014-11-22 09:45:48', 'One more day.');
insert into blogs values(DEFAULT, 2, 'User 2 Third Blog Entry', '2014-11-24 09:15:50', 'Just another manic Monday');
insert into blogs values(DEFAULT, 3, 'User 3 First Blog Entry', '2010-01-21 09:00:32', 'Year 1, play in the sun!');
insert into blogs values(DEFAULT, 3, 'User 3 Second Blog Entry', '2011-07-31 09:55:40', 'Year 2, feeling blue...');
insert into blogs values(DEFAULT, 3, 'User 3 Third Blog Entry', '2013-04-17 09:46:41', 'Year 4, good for more!');
insert into blogs values(DEFAULT, 3, 'User 3 Fourth Blog Entry', '2014-11-21 22:22:22', '222222 yay!');

insert into usrecipes values(3,1),
							(2,2),
							(2,3),
							(2,4);

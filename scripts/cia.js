var readline = require('readline');

var command;

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var engine = {
	init: function () {
		this.update(cia.rooms[0].look  +  cia.rooms[0].id);
		
		cia.verbs.go("north");
		
		var recursiveAsyncReadLine = function () {
			rl.question('Command: ', function (answer) {
				if (answer == 'exit') //we need some base case, for recursion
					return rl.close(); //closing RL and returning from function.
				engine.verb_check(answer);
				recursiveAsyncReadLine(); //Calling this function again to ask new question
			});
		};
		
		recursiveAsyncReadLine();		
	},
	end : function () {
		var temp_rank, temp_score, temp_msg;
			temp_score = cia.player.score;
			if (temp_score === 0){
				temp_rank = "Amateur Sleuth\n (Go Back for field training.)"
			} else if (temp_score === 10){
				temp_rank = "Intermediate Sleuth\n (Pound the beat some more.)"
			} else if (temp_score === 20){
				temp_rank = "Advanced Sleuth\n (You still need an assistant.)"
			} else if (temp_score === 30){
				temp_rank = "Expert Operative\n (You can handle any mission alone.)"
			} else if (temp_score === 40){
				temp_rank = "World Rewnowed Operative\n (You will be elevated to Control)"
			}
			temp_msg= "Elapsed Time: " + cia.player.time + " minutes. \nYour current score is: " + temp_score + " points\nYour rank is: " + temp_rank;
			engine.update(temp_msg + "\n\nTo quit, close the browser or press F5. \n");

		process.exit();
	},
	restart : function () {
		location.reload();
	},
// The workhorse of the program
	verb_check : function (msg_in) {
		var temp_room;
		
		command = msg_in;
		
		temp_room = cia.player.room;
		msg_in = msg_in.toLowerCase();
		msg_in = msg_in.split(" ");

		if (msg_in[0] != "time") {
			// 3 minutes per command looked too hard, so I lowered the time penalty to 1 minute per command
			cia.player.time += 1;
			if (cia.player.time > cia.end_time) {
				engine.update("Sorry... you ran out of time.");
				engine.end();

			}
		}

		if (cia.player.g === 2 && cia.player.room === 6 && msg_in[0] !== "shoot") {
			engine.update("It's hopeless, Griminski fires...\n You crumple to the floor. Game Over.");
			engine.end(); 
		}

		if (msg_in.length === 1 && cia.commands[msg_in[0]] != undefined){
			cia.commands[msg_in[0]](msg_in[1]);
		} else if (msg_in.length === 2 && cia.verbs[msg_in[0]] != undefined) {
			cia.verbs[msg_in[0]](msg_in[1]);
		} else {

			this.error();
		}
	},
	update : function (msg) {
		console.log('\n' + msg + '\n');
		command = undefined;
	},
	error : function () {
		this.update("I don't understand");
	}
};

var cia = {

	player : {
		room: 0,
		i: 0,
		score: 0,
		time : 0,
		g : 0
	},
	score : 0,
	end_time : 120,
	commands : {
		n : function () {
			cia.verbs.go("north");
		},
		north : function () {
			cia.verbs.go("north");
		},
		s : function () {
			cia.verbs.go("south");
		},
		south : function () {
			cia.verbs.go("south");
		},
		e : function () {
			cia.verbs.go("east");
		},
		east : function () {
			cia.verbs.go("east");
		},
		w : function () {
			cia.verbs.go("west");
		},
		west : function () {
			cia.verbs.go("west");
		},
		about : function () {
			var temp_msg = "This text adventure accepts 1 and 2 word commands. 2 word commands should be in the format: verb noun. to see a list of verbs type: 'verbs' to see the list of commands type: 'commands' ";
			engine.update(temp_msg);
		},
		verbs : function () {
			var temp_msg = "I understand the following verbs: \n";
			keys = Object.getOwnPropertyNames(cia.verbs).sort();
			keys = keys.join(", ");
			temp_msg += keys;
			
			engine.update(temp_msg);
		},
		commands : function () {
			var temp_msg, keys;
			temp_msg = "I understand the following commands: \n";
			keys = Object.getOwnPropertyNames(cia.commands).sort();
			keys = keys.join(", ");
			temp_msg += keys;
			
			engine.update(temp_msg);
		},
		help : function () {
			var temp_room = cia.player.room;
			engine.update(cia.rooms[temp_room].help);
		},
		quit : function () {
			engine.end();
			
		},
		i : function () {
			cia.commands.inventory();
		},
		inventory : function () {
			var temp_msg;

			if (cia.player.i === 0){
				temp_msg="You aren't carrying anything."
			} else {
				temp_msg = "You are carrying:\n";
				for (i = 0; i < cia.objects.length; i +=1){
					if (cia.objects[i].room === 0) {
						temp_msg += cia.objects[i].look + "\n"
					}
				}
			}
			engine.update(temp_msg);

		},
		look : function () {
			var temp_room, temp_objects;
			temp_objects = []; 
			temp_room = cia.player.room;
// See if there are any loose objects in the room
			for (i = 0; i < cia.objects.length; i += 1){
				if (cia.objects[i].room === temp_room && cia.objects[i].link === 0) {
					temp_objects[temp_objects.length] = "\n • " + cia.objects[i].look;
				}
			}
			engine.update(cia.rooms[temp_room].look + "\n\nYou also see:\n" + temp_objects + "\n");
		},
		time : function () {
			engine.update("Elapsed time is: " + cia.player.time + " minutes.");
		},
		score : function () {
			var temp_rank, temp_score;
			temp_score = cia.player.score;
			if (temp_score === 0){
				temp_rank = "Amateur Sleuth\n (Go Back for field training.)"
			} else if (temp_score === 10){
				temp_rank = "Intermediate Sleuth\n (Pound the beat some more.)"
			} else if (temp_score === 20){
				temp_rank = "Advanced Sleuth\n (You still need an assistant.)"
			} else if (temp_score === 30){
				temp_rank = "Expert Operative\n (You can handle any mission alone.)"
			} else if (temp_score === 40){
				temp_rank = "World Rewnowed Operative\n (You will be elevated to Control)"
			}
			engine.update("You have " + temp_score + " points for evidence.\nYour rank is: " + temp_rank);

		},
		restart : function () {
			engine.update("To restart, press F5 or click 'Restart'");

		},
		exits : function () {
			var temp_msg, temp_room;
			temp_msg = "Exits are: ";
			temp_room = cia.player.room;
				if (cia.rooms[temp_room].exits[0] != 0) {
					temp_msg += "North ";
				} else if (cia.rooms[temp_room].exits[1] != 0) {
					temp_msg += "East ";
				} else if (cia.rooms[temp_room].exits[2] != 0) {
					temp_msg += "South ";
				} else if (cia.rooms[temp_room].exits[3] != 0) {
					temp_msg += "West ";
				} else {
					temp_msg += "No Exit ";
				}
// output exits
			engine.update(temp_msg);
		},
		x : function () {
			cia.commands.look();
		}
		
	},
//
// Verbs
//
	verbs : {
		go : function (dir) {
			var exits, temp, temp_room;
			temp = 0;
			temp_room = cia.player.room;
			exits = cia.rooms[temp_room].exits
//get current room direction variable

			if (dir === "north") {
				temp = exits[0]
			} else if (dir === "east") {
				temp = exits[1]
			} else if (dir === "south") {
				temp = exits[2]	

			} else if (dir === "west") {
				temp = exits[3]
			}	

// if not 0 change rooms, otherwise error out:
			if (temp != 0){
				cia.player.room = temp;
				cia.rooms[temp].visits += 1;
				engine.update(cia.rooms[temp].look);
			
			} else {
				engine.update("I can't go that direction.");
			}
		},
		open : function (item) {
			if (item === "umbrella"){
				if (cia.objects[16].room === 0) {
					engine.update("You stab yourself with the tip which is a poisoned dart. You are rushed to the hospital-:\n Game Over.");
					engine.end();
				} else {
					engine.update("You don't have an umbrella.");
				}
			} else if (item === cia.objects[11].key){
				if (cia.player.room === 2 || cia.player.room === 3) {
					if (cia.objects[11].take_code === 4 && cia.objects[12].take_code === 4) {
						cia.rooms[2].exits[0] = 3;
						engine.update("Opened.");
					} else if (cia.objects[11].take_code === 4 && cia.objects[12].take_code === 5) {
						engine.update("You didn't disconnect the alarm. It goes off and the police come and arrest you. \n Game Over");
						engine.end();
					} else if (cia.objects[11].take_code === 5) {
						engine.update("The door is locked.");
					} else {
						engine.update("Can't get through the door yet");
					}
				}
			} else if (item === "briefcase") {

				if (cia.objects[17].room === 0){
					engine.update("Enter combination: (ie- combination briefcase:0-0-0)"); 
				} else {
					engine.update("You don't have a briefcase.");
				}

			} else if (item === "drawer") {
				if (cia.player.room === 5){
					cia.objects[56].link = 20;
					cia.objects[56].take_code = 5;
					engine.update("Opened.");
				}

			} else if (item === "safe"){
				if (cia.objects[43].room === cia.player.room){
					engine.update("Enter combination: (ie- combination safe:0-0-0)"); 
				} else {
					engine.update("I don't see a safe here.");
				}
			} else if (item === "cabinet"){
					if (cia.player.room === cia.objects[48].room) {
						engine.update("Opened.");
						cia.objects[50].link = 48;
						cia.objects[50].take_code = 1;
						cia.rooms[10].look = cia.rooms[10].look.replace("closed.","open.");
					} else if (cia.player.room === cia.objects[36].room){
						cia.objects[37].link = 36;
						cia.objects[37].take_code = 1;
						cia.rooms[8].look = cia.rooms[8].look.replace("closed.","open.");
						engine.update("Opened.");

					} else {
						engine.update("I don't see a cabinet here.")
					}
			} else {
				engine.update("A " + item + " can't be opened.");
			}
			/* Freezer

				Inside are containers of frozen yogurt, caviar and frozen herring. A box sitting on the rack on the door is labeled 'FILM'
			*/
		},
		combination : function (item) {
			if (item === "briefcase:0-0-0" || item === "safe:0-0-0") {
				engine.update("That was just an example, try again Gumshoe!");
			} else if (item === "briefcase:2-4-8" && cia.objects[17].room === 0) {
				engine.update("Opened.");
				cia.objects[17].look = cia.objects[17].look + " Parts of an RR-13 rifle are inside the padded case."
			} else if (item === "briefcase:2-4-8" && cia.objects[17].room !== 0) {
				engine.update("You don't have a briefcase.");
			} else if (item === "safe:20-15-9" && cia.player.room === cia.objects[43].room) {
				engine.update("Opened.");
				cia.objects[43].look = cia.objects[43].look + " Inside is:"
			} else if (item === "safe:20-15-9" && cia.player.room !== cia.objects[43].room) {
				engine.update("I don't see a safe here.");
			} else {
				engine.update("Sorry, you don't have the right combination.");
			}
		},
		look : function (item) {
			var temp_check, temp_index, temp_links, temp_array;
			temp_check = 0;
			temp_index = 0;
			temp_links = [];
			temp_array = [];

			for (i = 0; i < cia.objects.length; i += 1) {
//does the object exist in the game?

				if (cia.objects[i].key === item) {
					temp_check += 1;
					temp_array[temp_array.length] = i;
				}

			}
			for (i = 0; i < temp_array.length; i += 1) {
//does the object reside in the room, or am I carrying it?
				if (cia.objects[temp_array[i]].room === cia.player.room || cia.objects[temp_array[i]].room === 0) {
					temp_check += 1;
					temp_index = temp_array[i];
				}
			}

			if (temp_check === 0) {
				return engine.error();
			} else if (temp_check === temp_array.length){
				engine.update("You may want to look at that later.");
			} else if (temp_check > temp_array.length) {
				engine.update(cia.objects[temp_index].look);
// list other items which are linked as children
				for (i = 0; i < cia.objects.length; i += 1) {
					if (cia.objects[i].link === temp_index) {
						temp_links[temp_links.length] = cia.objects[i].look;
					}							
				}
				if (temp_links.length !== 0){
					engine.update(temp_links.join("\n"));
				}
				
			} else {
				engine.update("You see nothing of interest.");
			}
		},
		get : function (item) {
			cia.verbs.take(item);
		},
		take : function (item) {
			var temp_take, temp_item;
// Change to function: getItem(item);
			for (i = 0; i < cia.objects.length; i += 1) {
				if (cia.objects[i].key === item && (cia.objects[i].room === cia.player.room || cia.objects[i].room === 0)) {
					temp_item = i;
				}
			}
			if (cia.objects[temp_item] === undefined) {
				return engine.error();
			} else {						
				temp_take = cia.objects[temp_item].take_code;
			}				
			
			if (cia.objects[temp_item].room === 0) {
				engine.update("You already have it.");
			} else if (cia.player.i === 6) {
				engine.update("You can't carry anything else.");
			} else {
				if (temp_take === 1) {
					cia.objects[temp_item].room = 0;
					cia.player.score += cia.objects[temp_item].take_val
					cia.player.i += 1;
					if (cia.objects[temp_item].link != 0) {
						cia.objects[temp_item]. link = 0;
					}
					engine.update("Taken.");
				} else if (temp_take === 2) {
					engine.update("You can't take " + item + " yet.");
				} else if (temp_take === 3) {
					engine.update("Silly, that's too heavy to carry");
				} else if (temp_take === 4){
					engine.update("That's ridiculous.");
				} else if (temp_take === 5) {
					engine.update("I would leave it where it is.");
				} else {
					return engine.error();
				}
			}					
		},
		drop : function (item) {
			var temp_item = 0;
			
			for (i = 0; i < cia.objects.length; i += 1) {
				if (cia.objects[i].key === item && cia.objects[i].room === 0) {
					temp_item = i;
				}
			}
			if (temp_item === 0) {
				engine.update("You are not carrying " + item);
			} else {
				cia.objects[temp_item].room = cia.player.room;
				cia.player.i -= 1;
				cia.player.score -= cia.objects[temp_item].take_val
				engine.update("Dropped.");
			}
			
		},
		read : function (item) {
			if (item === "letter") {
				if (cia.objects[15].room === 0 || cia.player.room === cia.objects[15].room) {
				engine.update("The telephone bill is made out to 322-9678 - V. Grim, P.O. Box 10, Grand Central Station, NYC. The ammount is $247.36 for long distance charges to Washington D.C.")	
				} else {
					engine.update("You don't see a letter.");
				}
			} else if (item === "pad") {
				if (cia.objects[19].room === 0 || cia.player.room === cia.objects[19].room) {
					engine.update("You can just make out this message: HEL-ZXT.93.ZARF.1");

				} else {
					engine.update("You don't see a pad.");
				}

			} else if (item === "bill") {
				if (cia.objects[22].room === 0 || cia.player.room === cia.objects[22].room) {
					engine.update("The bill is made out to 322-8721 Ambassador Vladamir Griminski, 14 Parkside Avenue, NYC. The bill is for $68.34 for mostly local calls.");

				} else {
					engine.update("You don't see a bill.");
				}
				
			} else if (item === "number") {
				if (cia.player.room === cia.objects[24].room) {
					engine.update("322-8721");

				} else if (cia.player.room === cia.objects[29].room) {
					engine.update("322-9678");

				} else if (cia.player.room === cia.objects[55].room) {
					engine.update("322-8721");

				} else {
					engine.update("You don't see a number.");
				}						
			} else if (item === "paper") {
				if (cia.player.room === cia.objects[41].room) {
					engine.update("20-15-9");
				} else if (cia.player.room === cia.objects[56].room) {
					engine.update("2-4-8");
				} else {
					engine.update("You don't see a paper.");
				}
			} else {
				engine.update("Nothing to read.")
			}
		},
		call : function (item) {
			var temp_room, temp_score;
			temp_room = cia.player.room;
			temp_score = 0;
			if (item === cia.objects[52].key && temp_room === 5 || temp_room === 6 || temp_room === 9) {
				//enter evidence function
				engine.update("Ring... Ring...\n Hello Agent, this is your Control speaking. We are checking your inventory for tangible evidence.");
				cia.commands.i();
				for (i = 0; i < cia.objects.length; i += 1) {
					if (cia.objects[i].room === 0) {
						temp_score += cia.objects[i].take_val;
					}
				}
				if (temp_score < 40) {
					engine.update("I'm sorry, you have insufficient evidence for a conviction. Call me when you have more information.");
					cia.commands.score();

				} else if (temp_score >= 40) {
					engine.update("Fantastic Job!\n We'll be right over in a flash to arrest the suspect.");
					cia.player.time += 6;
					if (cia.player.time > cia.end_time) {
						engine.update("Sorry... you ran out of time.");
						engine.end();

					} else {
						engine.update("---------- \nAmbassador Griminski arrives home at 10:30 pm to find operatives waiting to arrest him.\n ---------- \n You are handsomely rewarded for your clever sleuthing. You solved the mystery in " + cia.player.time + " minutes.")
						engine.end();
					}
				}
			} else if (item !== cia.objects[52].key) {
				engine.update("It's no use to call " + item);
			} else if (temp_room !== 5 || temp_room !== 6 || temp_room !== 9) {
				engine.update("You are not near a phone.");
			}
		},
		unscrew : function (item) {
			if (cia.objects[12].key === item) {
				if (cia.objects[5].room === 0) {
					cia.objects[12].take_code = 4;
					cia.objects[12].look = "The alarm is disabled";
					engine.update("The alarm system is off.");
				} else {
					engine.update("You have nothing to unscrew with.");
				}
			} else {
				engine.update("You can't unscrew a " + item + ".");
			}

		},			
		spray : function (item) {
			if (item === cia.objects[13].key || item === cia.objects[9].key) {
				if (cia.objects[9].room === 0){
					if (cia.player.room === cia.objects[13].room) {
						cia.rooms[3].exits = [5,9,2,4];
						cia.rooms[3].look = cia.rooms[3].look.replace("charges to attack.", "lies drugged on the floor.");
						cia.objects[13].look = "The fierce doberman lies drugged on the floor.";
						cia.objects[13].take_code = 5;
						engine.update("The dog is drugged and falls harmlessly at your feet.")
// remove drug from game
						cia.objects[9].room = -1;
						engine.update("The drug is used up and is no longer in your inventory.")
					} else {
						engine.update("I don't think it will do any good here.")
					}
				} else {
					engine.update("You have nothing to spray with.");
				}
			} else {
				engine.update("You can't spray a " + item + ".");
			}
		},
		push : function (item) {
			if (item === cia.objects[25].key) {
				cia.rooms[5].exits = [7,6,3,0];
				cia.objects[25].look = "The panels are toungue-in-groove. A hidden room can be seen behind one panel."
				engine.update ("The panel pops open to reveal the entrance to a previously hidden room.");
			} else {
				engine.update("It doesn't do any good to push a " + item + ".");
			}
		},
		load : function (item) {
			if (item === cia.objects[27].key) {
				if (cia.objects[27].room === 6 && cia.player.room === 6) {
					engine.update("The program is already loaded.");
				} else if (cia.objects[27].room === 0 && cia.player.room === 6) {
					cia.objects[27].room = 6;
					engine.update("You slide the disk into the computer.");
				} else {
					engine.update("That won't help you."); 
				}
			} else {
				engine.update("Can't load a " + item +".");
			}
		},
		run : function (item) {
// run program
			if (item === cia.objects[27].key) { 
				if (cia.player.room === 6) {						
					if (cia.objects[30].take_code === 5 || cia.objects[31].take_code === 5 || cia.objects[32].take_code === 5) {
						engine.update("The computer can't run the program yet.");
					} else {								
						cia.objects[27].take_code = 1;
						engine.update ("The program dials a Washington D.C. number. A message appears on the monitor.\n Please log in: (password: pWord3)")
						}
				} else {
					engine.update("I don't see a computer here.")
				}

			} else {
				engine.update("You can't run a " + item + ".");
			}
// Still needs programed
		},
		password : function (item) {
			if (cia.objects[30].take_code === 5 || cia.objects[31].take_code === 5 || cia.objects[32].take_code === 5) {

				engine.update("The computer can't run the program yet.");
			} else {

				if (item === "HEL-ZXT.93.ZARF.1") {
					engine.update("The folloing message appears on the monitor: This is the United States Devense Department's top secret account for weapons development and radar resistant airrcraft data. All information is classified.")
				} else {
					if (cia.player.g = 0) {
						cia.player.g = 2;
						cia.objects[57].room = 6;
						engine.update("Invalid Password... the screen goes blank. \n ----------\n You hear footsteps. Griminski looms in the doorway with an 8-mm lugar in hand. You'd better have brought the PPK-3 pistol from the department or you're finished!");
						if (cia.objects[7].room !== 0) {
							engine.update("You don't have the pistol, anything else takes too much time. \n It's hopeless, Griminski fires...\n You crumple to the floor. Game Over.");
							engine.end(); 
						}
// if you do have the pistol, you get one shot ( See engine.verb_check(); )
					}
				}
			}
		},
		drink : function (item) {
			if (item === cia.objects[35].key) {
				if (cia.objects[35].room === 0 || cia.objects[35].room === cia.player.room) {
					engine.update("You are poisoned. You stagger to the phone and call an ambulance...\n Game Over.");
					engine.end();
				} else {
					engine.update("There is nothing to drink here.");
				}
			} else {
				engine.update("You can't drink " + item + ".");
			}
		},
		eat : function (item) {
			if (item === cia.objects[38].key || item === cia.objects[53].key) {
				if (cia.objects[35].room === 0 || cia.objects[35].room === cia.player.room) {
					engine.update("You fool! These are cyanide capsules. You fall writhing to the floor and die in agony...\n Game Over.");
					engine.end();
				} else {
					engine.update("There is nothing to eat here.");
				}
			} else if (item === cia.objects[44].key) {
				if (cia.objects[44].room === 0 || cia.objects[44].room === cia.player.room) {
					engine.update("You idiot! The gum is plastic explosive. you have just blown yourself to smithereens!! \n...\n Game Over.");
					engine.end();
				} else {
					engine.update("There is nothing to eat here.");
				}

			} else {
				engine.update("You can't eeat " + item + ".");
			}
		},
		chew : function (item) {
			cia.verbs.eat(item);
		},
		unwrap : function (item) {
			if (item === cia.objects[44]) {
				if (cia.objects[44].room === 0 || cia.objects[44].room === cia.player.room) {
					cia.objects[45].take_code = 1;
					engine.update("The wrapper conceals a tiny strip of microfilm.");
				} else {
					engine.update("There is nothing to unwrap here.");
				}
			} else {
				engine.update("It doesn't help to unwrap a " + item + ".");
			}
		},
		talk : function (item) {
			if (item === cia.objects[13]) {
				if (cia.objects[13].room === cia.player.room) {
					engine.update("He doesn't speak english.");
				} else {
					engine.update("I don't see a dog here.");
				}
			} else {
				engine.update("That won't help you.");
			}
		},
		shoot : function (item) {
// clean up input
			if (item === "pistol" && cia.player.room === 3) {
				cia.verbs.shoot("dog");
			}
			if (item === "pistol" && cia.player.room === 6) {
				cia.verbs.shoot("griminski");
			}
// Do you have the gun or pistol?
			if (cia.objects[7].room === 0 || cia.objects[10].room === 0){
// Are you shooting something that makes sense?
				if (cia.player.room === 3 && item === cia.objects[13].key && cia.objects[13].take_code === 4) {
// Dog
					engine.update("The dog bites your hand.");

				} else if (item === cia.objects[57].key && cia.player.room === 6 && cia.player.g === 2) {
// Griminski 
						if (cia.objects[7].room === 0) {
							cia.rooms[6].look += " Griminski is lying unconscious on the floor."
							cia.player.g = 1;
							engine.update("Your shot grazes his forehead. He crashes to the floor unconscious. You have time to gater additional evidence to apperhend him.");
						}								
				} else if (item === cia.objects[57].key && cia.player.room === 6 && cia.player.g !== 2) {
					engine.update("That won't help.");
				} else {
					engine.update("That would just make a big mess.");
				}

			} else {
				engine.update("You have nothing to shoot with.");
			}
		},
		unlock : function (item) {
			if (item === cia.objects[11].key) {
				if (cia.objects[11].room === cia.player.room && cia.objects[8].room === 0) {
					
					cia.objects[11].take_code = 4;
					engine.update("Unlocked.");
					
				} else if (cia.objects[11].room === cia.player.room && cia.objects[8].room !== 0) {
					engine.update("You have nothing to use to unlock the door.");
				}
			} else {
				engine.update("You can't unlock a " + item + ".");
			}
		},
		on : function (item) {
			if (item === cia.objects[30]) {
				if (cia.objects[30].room === cia.player.room) {
					cia.objects[30].look = cia.objects[30].look.replace("off","on")
					cia.objects[30].take_code = 3;
					engine.update("On.");
					
				} else {
					engine.update("I don't see one of those here.");
				}
			} else if (item === cia.objects[31]) {
				if (cia.objects[31].room === cia.player.room) {
					cia.objects[31].look = cia.objects[31].look.replace("off","on")
					cia.objects[31].take_code = 3;
					engine.update("On.");
					
				} else {
					engine.update("I don't see one of those here.");
				}
			} else if (item === cia.objects[32]) {
				if (cia.objects[32].room === cia.player.room) {
					cia.objects[32].look = cia.objects[32].look.replace("off","on")
					cia.objects[32].take_code = 3;
					engine.update("On.");
					
				} else {
					engine.update("I don't see one of those here.");
				}
			} else {
				engine.update("You can't turn on a " + item + ".");
			}
		},
		off : function (item) {
			if (item === cia.objects[30]) {
				if (cia.objects[30].room === cia.player.room) {
					cia.objects[30].look = cia.objects[30].look.replace("o","off")
					cia.objects[30].take_code = 3;
					engine.update("Off.");
					
				} else {
					engine.update("I don't see one of those here.");
				}
			} else if (item === cia.objects[31]) {
				if (cia.objects[31].room === cia.player.room) {
					cia.objects[31].look = cia.objects[31].look.replace("on","off")
					cia.objects[31].take_code = 3;
					engine.update("Off.");
					
				} else {
					engine.update("I don't see one of those here.");
				}
			} else if (item === cia.objects[32]) {
				if (cia.objects[32].room === cia.player.room) {
					cia.objects[32].look = cia.objects[32].look.replace("on","off")
					cia.objects[32].take_code = 3;
					engine.update("Off.");
					
				} else {
					engine.update("I don't see one of those here.");
				}
			} else {
				engine.update("You can't turn off a " + item + ".");
			}
		},
		examine : function (item) {
			cia.verbs.look(item);
		},
		x : function (item) {
			cia.verbs.look(item);
		}

	},
	rooms : [{
			room : 0,
			id : " \n\nYour two hours begin right now!",
			visits : 0,
			exits : [1,0,0,0],
			look : "Type 'about' if you haven't played before, or 'help' if you need a hint. Each command you type will cost you 1 minute, so plan carefully.",
			help : "I don't understand."	
		},{
			room : 1,
			id : "Your Office- CIA",
			visits : 0,
			exits : [2,0,0,0],
			look : "You are in your office at the CIA. On the shelves are tools you've used in past missions. Ambasador Griminski's apartment is north",
			help : "You'll need some tools to get in the apartment."
		},{
			room : 2,
			id : "Grminski's Appartment",
			visits : 0,
			exits : [0,0,1,0],
			look : "You are at 14 Parkside Avenue, the entrance to Ambassador Griminski's small but elegant bachelor apartment. You see a heavy wooden door with a notice on it warning of an alarm system.",
			help : "Maybe your tools will help you."
		},{
			room : 3,
			id : "Foyer",
			visits : 0,
			exits : [0,0,2,0],
			look : "This is the marbled foyer of the Ambassador's appartment. There is a table in the corner. The master bedroom is east, the drawing room is north, and a closet is west. A fierce dog charges to attack.",
			help : "Something from your office could be helpful now."
		},{
			room : 4,
			id : "Front Hall Closet",
			visits : 0,
			exits : [0,3,0,0],
			look : "You are in the front hall cedar closet. Heavy overcoats and a trenchcoat are handing up. Boots are on the floor and other items are in the corner.",
			help : "First impressions can be deceiving."
		},{
			room : 5,
			id : "Drawing Room",
			visits : 0,
			exits : [7,0,3,0],
			look : "You are in the Drawing Room. A desk is here. A sofa and a coffee table are in front of the fireplace set into the paneled east wall. The dining room is north.",
			help : "There is more here than meets the eye."
		},{
			room : 6,
			id : "Hidden Room",
			visits : 0,
			exits : [0,0,0,5],
			look : "You can see a microcomputer, phone modem, and monitor on a table against the east wall of this over-sized closet. A phone is by the computer. A chair and shelves are here.",
			help : "Running a program is always interesting."
		},{
			room : 7,
			id : "Dining Room",
			visits : 0,
			exits : [8,0,5,0],
			look : "You are standing in a small formal dining room. The table seats six guests. A sideboard with a tray on it is against the east wall. The kitchen in North.",
			help : "I can't help you here."
		},{
			room : 8,
			id : "Kitchen",
			visits : 0,
			exits : [0,0,7,0],
			look : "You are in the apartment kitchen which shimmers with polished chrome appliances and butcher block counters. A long cabinet above the stainless steel sinks is closed. A freezer stands in the corner.",
			help : "Be suspicious of items in small bottles."
		},{
			room : 9,
			id : "Bedroom",
			visits : 0,
			exits : [10,0,0,3],
			look : "This is Ambassador Griminski's bedroom. A bed and bedside table are here. A safe is in the wall above the bureau. The bathroom and dressing area are to the north.",
			help : "Things are often not what they seem."
		},{
			room : 10,
			id : "Bathroom",
			visits : 0,
			exits : [0,0,9,0],
			look : "You are in a combined bathroom and dressing area. The Ambassador's clothes are hanging neatly on rods and open shelves hold towels and sweaters. The medicine cabinet is closed. ",
			help : "Don't overlook the obvious."
	}],
// Objects
	objects : [{
		num: 0,
		key: "north",
		look: "It doesn't help.",
		room: -1,
		link: 0,
		take_val: 0,
		take_code: 4
	},{
		num: 1,
		key: "east",
		look: "It doesn't help.",
		room: -1,
		link: 0,
		take_val: 0,
		take_code: 4
	},{
		num: 2,
		key: "south",
		look: "It doesn't help.",
		room: -1,
		link: 0,
		take_val: 0,
		take_code: 4
	},{
		num: 3,
		key: "west",
		look: "It doesn't help.",
		room: -1,
		link: 0,
		take_val: 0,
		take_code: 4
	},{
		num: 4,
		key: "shelves",
		look: "Shelves for weapons and tools line the wall near your desk. There are numerous items which may help you on your assignment.",
		room: 1,
		link: 0,
		take_val: 0,
		take_code: 3
	},{
		num: 5,
		key: "screwdriver",
		look: "An all purpose screwdriver with collapsible handle.",
		room: 1,
		link: 4,
		take_val: 0,
		take_code: 1
	},{
		num: 6,
		key: "bomb",
		look: "A Mark MX high-intensity smoke bomb.",
		room: 1,
		link: 4,
		take_val: 0,
		take_code: 1
	},{
		num: 7,
		key: "pistol",
		look: "An automatic PPK-3 pistol.",
		room: 1,
		link:4,
		take_val: 0,
		take_code: 1
	},{
		num: 8,
		key: "key",
		look: "A skeleton key.",
		room: 1,
		link: 4,
		take_val: 0,
		take_code: 1
	},{
		num: 9,
		key: "drug",
		look: "A small can of Insta-Knockout drug.",
		room: 1,
		link: 4,
		take_val: 0,
		take_code: 1
	},{
		num: 10,
		key: "gun",
		look: "A Mark 3K harpoon gun with grapple and line.",
		room: 1,
		link: 4,
		take_val: 0,
		take_code: 1
	},{
		num: 11,
		key: "door",
		look: "The heavy door is painted black. A brass keyhole and doorknob are here. You can see the circular holes on either side of the door which must radiate an electronic alarm beam.",
		room: 2,
		link: 0,
		take_val: 0,
		take_code: 5
	},{
		num: 12,
		key: "alarm",
		look: "The alarm is screwed into place.",
		room: 2,
		link: 11,
		take_val: 0,
		take_code: 5
	},{
		num: 13,
		key: "dog",
		look: "The savage doberman leaps toward you with bared fangs. He will not let you past him.",
		room: 3,
		link: 0,
		take_val: 0,
		take_code: 4
	},{
		num: 14,
		key: "table",
		look: "The Venetian front hall table has a tortoise shell letter tray on it for business cards and mail. There is a letter in the tray.",
		room: 3,
		link: 0,
		take_val: 0,
		take_code: 3
	},{
		num: 15,
		key: "letter",
		look: "This is apparently a telephone bill that has been paid and is being sent to the telephone company.",
		room: 3,
		link: 0,
		take_val: 10,
		take_code: 1
	},{
		num: 16,
		key: "umbrella",
		look: "There is a black businessman's umbrella with a pointed end.",
		room: 4,
		link: 58,
		take_val: 0,
		take_code: 1
	},{
		num: 17,
		key: "briefcase",
		look: "There is a black leather briefcase with a combination lock.",
		room: 4,
		link: 58,
		take_val: 0,
		take_code: 1
	},{
		num: 18,
		key: "desk",
		look: "The large oak desk has a blotter and pen set on it. A Phone is here. A blank note pad is by the phone. The desk has a pidgeon hole and one drawer in it.",
		room: 5,
		link: 0,
		take_val: 0,
		take_code: 3

	},{
		num: 19,
		key: "pad",
		look: "Although the note pad is blank, you can see the indentation of writing on it.",
		room: 5,
		link: 18,
		take_val: 0,
		take_code: 1
	},{
		num: 20,
		key: "drawer",
		look: "This is a standard pull desk drawer.",
		room: 5,
		link: 18,
		take_val: 0,
		take_code: 4
	},{
		num: 21,
		key: "pigeonhole",
		look: "The pigeonhole has a paid bill in it.",
		room: 5,
		link: 18,
		take_val: 0,
		take_code: 4
	},{
		num: 22,
		key: "bill",
		look: "This bill is from the telephone company.",
		room: 5,
		link: 21,
		take_val: 0,
		take_code: 1
	},{
		num: 23,
		key: "phone",
		look: "This is a beige push button desk phone.",
		room: 5,
		link: 18,
		take_val: 0,
		take_code: 4
	},{
		num: 24,
		key: "number",
		look: "The telephone number is printed on the base.",
		room: 5,
		link: 23,
		take_val: 0,
		take_code: 4
	},{
		num: 25,
		key: "panel",
		look: "The panels are tongue-in-groove. One of the panels seems more worn than the others.",
		room: 5,
		link: 0,
		take_val: 0,
		take_code: 4
	},{
		num: 26,
		key: "shelves",
		look: "There are software programs, blank discs, and manuals on the shelves.",
		room: 6,
		link: 0,
		take_val: 0,
		take_code: 4
	},{
		num: 27,
		key: "program",
		look: "One program is for communicating with the U.S. Defense Department's mainframe computer.",
		room: 6,
		link: 26,
		take_val: 10,
		take_code: 5
	},{
		num: 28,
		key: "phone",
		look: "This is a standard desk-type dial telephone. The receiver is set into a modem.",
		room: 6,
		link: 0,
		take_val: 0,
		take_code: 4
	},{
		num: 29,
		key: "number",
		look: "The telephone number is printed on the base.",
		room: 6,
		link: 28,
		take_val: 0,
		take_code: 4
	},{
		num: 30,
		key: "computer",
		look: "This is a standard type business microcomputer with a keyboard and a brogram in one of the disk drives. The on/off switch is off.",
		room: 6,
		link: 0,
		take_val: 0,
		take_code: 5
	},{
		num: 31,
		key: "monitor",
		look: "This is a hi-res color monitor. The on/of switch is off.",
		room: 6,
		link: 0,
		take_val: 0,
		take_code: 5
	},{
		num: 32,
		key: "modem",
		look: "The phone modem is one that can use an automatic dialing communications program. The on/off switch is off.",
		room: 6,
		link: 0,
		take_val: 0,
		take_code: 5
	},{
		num: 33,
		key: "tray",
		look: "The silver tray holds a decanter partially filled with claret.",
		room: 7,
		link: 54,
		take_val: 0,
		take_code: 1
	},{
		num: 34,
		key: "decanter",
		look: "The decanter is of etched crystal. It probably holds claret.",
		room: 7,
		link: 33,
		take_val: 0,
		take_code: 1
	},{
		num: 35,
		key: "claret",
		look: "An amber liquid",
		room: 7,
		link: 34,
		take_val: 0,
		take_code: 1
	},{
		num: 36,
		key: "cabinet",
		look: "This is a fairly standard kitchen cabinet.",
		room: 8,
		link: 0,
		take_val: 0,
		take_code: 4
	},{
		num: 37,
		key: "bottle",
		look: "A bottle of capsules are here.",
		room: 8,
		link: 36,
		take_val: 0,
		take_code: 4
	},{
		num: 38,
		key: "capsule",
		look: "The capsules are elongated and have a slight aroma of burnt almonds.",
		room: 8,
		link: 37,
		take_val: 0,
		take_code: 1
	},{
		num: 39,
		key: "table",
		look: "The bedside table has a phone on it. A piece of paper and a lamp are here.",
		room: 9,
		link: 0,
		take_val: 0,
		take_code: 3
	},{
		num: 40,
		key: "phone",
		look: "There is a number printed on the phone.",
		room: 9,
		link: 39,
		take_val: 0,
		take_code: 4

	},{
		num: 41,
		key: "paper",
		look: "A piece of monogramed writing paper.",
		room: 9,
		link: 39,
		take_val: 0,
		take_code: 5
	},{
		num: 42,
		key: "combination",
		look: "There is a combination written on it.",
		room: 9,
		link: 41,
		take_val: 0,
		take_code: 4
	},{
		num: 43,
		key: "safe",
		look: "This is a standard combination safe.",
		room: 9,
		link: 0,
		take_val: 0,
		take_code: 4
	},{
		num: 44,
		key: "gum",
		look: "A pack of stick type peppermint gum. Each piece is wrapped in paper.",
		room: 9,
		link: 0,
		take_val: 0,
		take_code: 2
	},{
		num: 45,
		key: "microfilm",
		look: "The microfilm has been developed buy you can't see it without special equipment. Nevertheless it's pretty certain what you have found.",
		room: 9,
		link: 44,
		take_val: 10,
		take_code: 2
	},{
		num: 46,
		key: "shelves",
		look: "A very sophisticated camera is on one of the shelves.",
		room: 10,
		link: 0,
		take_val: 0,
		take_code: 4
	},{
		num: 47,
		key: "camera",
		look: "This camera is used to photograph documents on microfilm.",
		room: 10,
		link: 46,
		take_val: 10,
		take_code: 1
	},{
		num: 48,
		key: "cabinet",
		look: "This is a large mirrored bathroom cabinet.",
		room: 10,
		link: 0,
		take_val: 0,
		take_code: 4
	},{
		num: 49,
		key: "bureau",
		look: "A wall safe is set into the wall above the low mahogany carved bureau.",
		room: 9,
		link: 0,
		take_val: 0,
		take_code: 3
	},{
		num: 50,
		key: "bottles",
		look: "Bottles of fixer and photoflo are on the shelves.",
		room: 10,
		link: 46,
		take_val: 0,
		take_code: 2
	},{
		num: 51,
		key: "tank",
		look: "There is a film developing tank here. There is an apron and tank cover here too.",
		room: 10,
		link: 50,
		take_val: 0,
		take_code: 2
	},{
		num: 52,
		key: "headquarters",
		look: "Headquarters",
		room: 100,
		link: 0,
		take_val: 0,
		take_code: 4
	},{
		num: 53,
		key: "capsules",
		look: "The capsules are elongated and have a slight aroma of burnt almonds.",
		room: 8,
		link: 0,
		take_val: 0,
		take_code: 1
	},{
		num: 54,
		key: "sideboard",
		look: "A large ornate sideboard with a beveled glass mirror dominates the east wall.",
		room: 7,
		link: 0,
		take_val: 0,
		take_code: 4
	},{
		num: 55,
		key: "number",
		look: "The number is printed on the phone.",
		room: 9,
		link: 40,
		take_val: 0,
		take_code: 4
	},{
		num: 56,
		key: "paper",
		look: "The numbers 2-4-8 are written on a piece of paper on top of the drawer.",
		room: 5,
		link: 20,
		take_val: 0,
		take_code: 2
	},{
		num: 57,
		key: "griminski",
		look: "The white-haired man is dressed in evening clothes.",
		room: 100,
		link: 0,
		take_val: 0,
		take_code: 4
	},{
		num: 58,
		key: "corner",
		look: "You are looking in the corner of the closet.",
		room: 4,
		link: 0,
		take_val: 0,
		take_code: 4
	},{
		num: 59,
		key: "freezer",
		look: "This is a small white freezer",
		room: 8,
		link: 0,
		take_val: 0,
		take_code: 5
	}]
};

engine.init();
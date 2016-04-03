// store user information in a variable
var session_info = [];
// store messsages in a variable
var messages = [];
// function to check if user is already login / session credentials are active
var is_user = function(session_id){
	number_of_users = session_info.length;

	var current_user = false;

	if(number_of_users > 0){
		for(var ctr = 0; ctr < number_of_users; ctr++){
			if(session_info[ctr].id == session_id){
				current_user = session_info[ctr];
				break;
			}
			else{
				current_user = false;	
			}
		}
	}
	console.log("current user", current_user)
	return current_user;
}

module.exports = function Route(app){
	app.get("/", function(req, res){
		res.render("index", {title: "Broadcast Example"});
	});
	//load the messages on page load
	app.io.route("page_load", function(req){
		req.io.emit("load_messages", {messages: messages});
		//ask the name of the user if it's a new user
		if(is_user(req.session.id) === false)
			req.io.emit("get_user_name");
	})
	//this handles the saving of info of new user
	app.io.route("new_user", function(req){
		session_info.push({id: req.session.id, name: req.data.name});
		console.log(session_info)
	})
	//saving of messages to messages variable in the server
	app.io.route("new_message", function(req){
		var user = is_user(req.session.id);
		if(user){
			messages.push({ name: user.name, message: req.data.message });
			app.io.broadcast("post_new_message", { new_message: req.data.message, user: user.name });
		}
	})
}

/*
Note in this assignment we are saving messages into variables in the server. 
But once we are into mongodb, the messages will be saved on a NoSQL database. 
*/
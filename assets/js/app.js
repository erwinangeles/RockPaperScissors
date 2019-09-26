  // Your web app's Firebase configuration
  let firebaseConfig = {
    apiKey: "AIzaSyCsVDOlLHoBI5QNLIRIGLF5ZK8TuBDqe9o",
    authDomain: "rockpaperscissors-7cfb2.firebaseapp.com",
    databaseURL: "https://rockpaperscissors-7cfb2.firebaseio.com",
    projectId: "rockpaperscissors-7cfb2",
    storageBucket: "",
    messagingSenderId: "622745585858",
    appId: "1:622745585858:web:4341d6699f66a4f35d535b"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  let database = firebase.database();

//Varibales
let gameover = false;
let currentPlayer;

  let player1 = {
    name: "Player 1",
    choice: {rock: false, paper: false, scissors: false, hasPicked: false},
    wins: 0,
    ties: 0,
    losses: 0,
    connected: false,
  }

  let player2 = {
    name: "Player 2",
    choice: {rock: false, paper: false, scissors: false, hasPicked: false},
    wins: 0,
    ties: 0,
    losses: 0,
    connected: false,
  }

     // Firebase watcher + initial loader HINT: .on("value")
    //  database.ref().on("value", function(snapshot) {
    //     // Log everything that's coming out of snapshot
    //       console.log(snapshot.val());
    //       player1 = snapshot.val().player1;
    //       player2 = snapshot.val().player2;
    //       $("#player1-h2").html(`<h2>${snapshot.val().player1.name} Controls</h2>`)

    //     // Handle the errors
    //   }, function(errorObject) {
    //     console.log("Errors handled: " + errorObject.code);
    //   });

  $(document).ready(function(){   
    $('#player1-controls').hide()
    $('#player2-controls').hide()
    $('#messages-controls').hide()


   
    //Updates the local changes to FB
    function UpdatePlayers(){
        database.ref().set({
            players: {
                player1, 
                player2,
                gameover}
          });
    }


   

    function getPlayerName(){
        let name;
        if(currentPlayer == "Player1"){
            name = player1.name;
        }else{
            name = player2.name;
        }
        return name;
    }

    function UpdateMessages(){
            let name =  getPlayerName();
            let msg = `[${new moment().format("HH:mm A")}] ${name}: ${$("#message").val()}`
            database.ref("messages").push({
                msg
            });
            $("#message").val("");
       
    }

    database.ref("messages").on("child_added", function (snapshot) {
        let sv = snapshot.val();
       $("#messages-box").append(`<p>${sv.msg}</p>`)


       //script to automatically scroll the chat div http://jsfiddle.net/jPVAf/50/
            var height = 0;
            $('div p').each(function(i, value){
                height += parseInt($(this).height());
            });
            height += '';
            $('div').animate({scrollTop: height});
    })


    // function checkReconnect(){
    //     let currentPlayer = localStorage.getItem("player");
    //     if(hasExistingUserCookie() == true && player1.connected == false && player2.connected == false){
    //         localStorage.clear("player")
    //     }else if(hasExistingUserCookie() == true && player1.connected == true && player2.connected == false || hasExistingUserCookie() == true && player1.connected == false && player2.connected == true){
    //         $("#player_name").val(currentPlayer);
    //         $("#submit").text("Continue");
    //     }
    //     console.log("here we check for reconnect")
    // }

    // function hasExistingUserCookie() {
    //     let currentPlayer = localStorage.getItem("player")

    //     if(currentPlayer == null){
    //         localStorage.clear("player");
    //     return false;
    //     }
    //     else
    //     {
    //         return true;
    //     }
    // }
    //set the name of players
    database.ref().on("value", function (snapshot) {
        let sv = snapshot.val();
        if(sv == null){
            console.log("nothing here")
        }else{

            //pulling data from Firebase and then updating local variables
            player1 = sv.players.player1;
            player2 = sv.players.player2;
            gameover = sv.players.gameover;

            console.log(player1);
            console.log(player2);
           
            gameLogic();
            readData();
            if(gameover == false){
                $("#newgame").empty();
            }
        }
    })

    function readData(){
        console.log("reading new data from DB")
        //Player 1
        $("#player1-h2").text(`Player 1: ${player1.name}`)
        $("#player1Wins").text(`Wins: ${player1.wins}`);
        $("#player1Losses").text(`Losses: ${player1.losses}`);
        $("#player1Ties").text(`Ties: ${player1.ties}`);

        //Player 2
        $("#player2-h2").text(`Player 2: ${player2.name}`)
        $("#player2Wins").text(`Wins: ${player2.wins}`);
        $("#player2Losses").text(`Losses: ${player2.losses}`);
        $("#player2Ties").text(`Ties: ${player2.ties}`);

        //get messages
      
    }

$(document).on("click", ".set-name", function(e) {
    e.preventDefault();
    if(player1.connected == false && player2.connected == false){
        //save Player1 to FireBase
        currentPlayer = "Player1"
        player1.connected = true;
        player1.name = $("#player_name").val().trim();
        console.log("we're starting a fresh new game")
        UpdatePlayers()
        readData();

        $("#name-modal").hide()
        $("#player1-controls").show();
        $('#messages-controls').show();

        //send status msg
        let msg = `<p class="status-msg">[${new moment().format("HH:mm A")}] ${player1.name} connected.</p>`
        database.ref("messages").push({
            msg
        });
    }else if(player1.connected == false && player2.connected == true){
        //save Player1 to FireBase
        currentPlayer = "Player1"
        player1.connected = true;
        player1.name = $("#player_name").val().trim();
        UpdatePlayers()
        readData();

        $("#name-modal").hide()
        $("#player1-controls").show();
        $('#messages-controls').show();

        //send status msg
        let msg = `<p class="status-msg">[${new moment().format("HH:mm A")}] ${player1.name} connected.</p>`
        database.ref("messages").push({
            msg
        });
    }else if(player1.connected == true && player2.connected == false){
        //save Player2 to FireBase
        currentPlayer = "Player2";
        player2.connected = true;
        player2.name = $("#player_name").val().trim();
        UpdatePlayers();
        readData();


        $("#name-modal").hide()
        $("#player2-controls").show();
        $('#messages-controls').show();

        //send status msg
        let msg = `<p class="status-msg">[${new moment().format("HH:mm A")}] ${player2.name} connected.</p>`
        database.ref("messages").push({
            msg
        });
    }
    
});

//CHECK USER INPUTS-Player 1
$(document).on("click", ".player1-choice", function (){
    let player1Choice = $(this).data("value");
    if(gameover == false){
    switch(player1Choice){
        case 'rock':
        if(player1.choice.hasPicked == false){
            player1.choice.rock = true;
            player1.choice.hasPicked = true;
            $("#messages-box").append(`<p class="status-msg">[${new moment().format("HH:mm A")}] You've chosen rock.</p>`)
            UpdatePlayers()
        }else{
            console.log("user one already picked")
            $("#messages-box").append(`<p class="status-msg">[${new moment().format("HH:mm A")}] You've already picked. Waiting on the other player.</p>`)
        }
            break;
        case 'paper':
        if(player1.choice.hasPicked == false){
            player1.choice.paper = true;
            player1.choice.hasPicked = true;
            $("#messages-box").append(`<p class="status-msg">[${new moment().format("HH:mm A")}] You've chosen paper.</p>`)
            UpdatePlayers()
        }else{
            $("#messages-box").append(`<p class="status-msg">[${new moment().format("HH:mm A")}] You've already picked. Waiting on the other player.</p>`)
        }
            break;
        case 'scissors':
        if(player1.choice.hasPicked == false){
            player1.choice.scissors = true;
            player1.choice.hasPicked = true;
            $("#messages-box").append(`<p class="status-msg">[${new moment().format("HH:mm A")}] You've chosen scissors.</p>`)
            UpdatePlayers()
        }else{
            $("#messages-box").append(`<p class="status-msg">[${new moment().format("HH:mm A")}] You've already picked. Waiting on the other player.</p>`)
        }
            break;
    }
    }
});





//CHECK USER INPUTS-Player 2
$(document).on("click", ".player2-choice", function (){
    let player2Choice = $(this).data("value");
if(gameover == false){
    switch(player2Choice){
        case 'rock':
        if(player2.choice.hasPicked == false){
            player2.choice.rock = true;
            player2.choice.hasPicked = true;
            $("#messages-box").append(`<p class="status-msg">[${new moment().format("HH:mm A")}] You've chosen rock.</p>`)
            UpdatePlayers()
        }else{
            $("#messages-box").append(`<p class="status-msg">[${new moment().format("HH:mm A")}] You've already picked. Waiting on the other player.</p>`)
        }
            break;
        case 'paper':
        if(player2.choice.hasPicked == false){
            player2.choice.paper = true;
            player2.choice.hasPicked = true;
            $("#messages-box").append(`<p class="status-msg">[${new moment().format("HH:mm A")}] You've chosen paper.</p>`)
            UpdatePlayers()
        }else{
            $("#messages-box").append(`<p class="status-msg">[${new moment().format("HH:mm A")}] You've already picked. Waiting on the other player.</p>`)
        }
            break;
        case 'scissors':
        if(player2.choice.hasPicked == false){
            player2.choice.scissors = true;
            player2.choice.hasPicked = true;
            $("#messages-box").append(`<p class="status-msg">[${new moment().format("HH:mm A")}] You've chosen scissors.</p>`)
            UpdatePlayers()
        }else{
            $("#messages-box").append(`<p class="status-msg">[${new moment().format("HH:mm A")}] You've already picked. Waiting on the other player.</p>`)
        }
            break;
    }
    }
});


function gameLogic(){
    console.log("running game logic");
    if(gameover && player1.connected == true && player2.connected == true & currentPlayer !== undefined ){

        // //hides player controls
        // $("#player1-controls").hide();
        // $("#player2-controls").hide();

        //shows start new game button
        $("#newgame").empty();
        $("#newgame").append(`<button class="btn btn-danger new-game col-md-12">New Game</button>`)
    }else if(gameover == false && player1.connected == true && currentPlayer !== undefined || gameover == false && player2.connected == true && currentPlayer !== undefined ){
        //show player control again
        if(currentPlayer == "Player1"){
            $("#player1-controls").show();
        }else if(currentPlayer == "Player2"){
            $("#player2-controls").show();
        }
    }  
    if(player1.choice.hasPicked && player2.choice.hasPicked && gameover == false){
        let player1_rock = player1.choice.rock;
        let player1_paper = player1.choice.paper;
        let player1_scissors = player1.choice.scissors;
        
        let player2_rock = player2.choice.rock;
        let player2_paper = player2.choice.paper;
        let player2_scissors = player2.choice.scissors;
        gameover = true;
        
        if((player1_rock && player2_rock) || (player1_paper && player2_paper) || (player1_rock && player2_rock) || (player1_scissors && player2_scissors)){
        player1.ties++;
        player2.ties++;
        console.log("It's a tie!")
        $("#messages-box").append(`<p class="font-weight-bold">[${new moment().format("HH:mm A")}] Oh dear! It's a tie!</p>`)
        gameover = true;
    
        }else if(player1_rock && player2_paper) {
          player1.losses++;
          player2.wins++;
          console.log("Player 2 wins!");
          $("#messages-box").append(`<p class="font-weight-bold">[${new moment().format("HH:mm A")}] ${player1.name} picked rock, and ${player2.name} picked paper. ${player2.name} wins!</span>`)
          gameover = true;
        }else if(player1_rock && player2_scissors) {
          player1.wins++;
          player2.losses++;
          console.log("Player 1 wins!");
          $("#messages-box").append(`<p class="font-weight-bold">[${new moment().format("HH:mm A")}] ${player1.name} picked rock, and ${player2.name} picked scissors. ${player1.name} wins!</span>`)
          gameover = true;
        }else if(player1_paper && player2_rock) {
          player1.wins++;
          player2.losses++;
          console.log("Player 1 wins!");
          $("#messages-box").append(`<p class="font-weight-bold">[${new moment().format("HH:mm A")}] ${player1.name} picked paper, and ${player2.name} picked rock. ${player1.name} wins!</span>`)
          gameover = true;
        }else if(player1_scissors && player2_rock) {
          player1.losses++;
          player2.wins++;
          console.log("Player 2 wins!");
          gameover = true;
          $("#messages-box").append(`<p class="font-weight-bold">[${new moment().format("HH:mm A")}] ${player1.name} picked scissors, and ${player2.name} picked rock. ${player2.name} wins!</span>`)
        }else if(player1_scissors && player2_paper) {
          player1.wins++;
          player2.losses++;
          console.log("Player 1 wins!");
          $("#messages-box").append(`<p class="font-weight-bold">[${new moment().format("HH:mm A")}] ${player1.name} picked scissors, and ${player2.name} picked paper. ${player1.name} wins!</span>`)
          gameover = true;
        }else if(player1_paper && player2_scissors) {
          player1.losses++;
          player2.wins++;
          console.log("Player 2 wins!");
          $("#messages-box").append(`<p class="font-weight-bold">[${new moment().format("HH:mm A")}] ${player1.name} picked paper, and ${player2.name} picked scissors. ${player2.name} wins!</span>`)
          gameover = true;
        }
        UpdatePlayers();
        } 
    }

    $(document).on("click", ".new-game", function (){
        let PlayerName = getPlayerName();
        player1.choice.rock = false;
        player1.choice.paper = false;
        player1.choice.scissors = false;
        player1.choice.hasPicked = false;
    
        player2.choice.rock = false;
        player2.choice.paper = false;
        player2.choice.scissors = false;
        player2.choice.hasPicked = false;
        gameover=false;
        UpdatePlayers();

      
        //send status msg
        let msg = `<p class="status-msg">[${new moment().format("HH:mm A")}] ${PlayerName} has started a new match.</p>`
        database.ref("messages").push({
            msg
        });
    });

    $(document).on("click", ".send-message", function (e){
        e.preventDefault();
        UpdateMessages();
     });

    // //detecs window close
    $(window).on("unload", function(e) {

        //Check to see if the other player is still connected, if so it'll send the new status. If not then end the game. I
        if(currentPlayer == "Player1" && player2.connected == true){
            player1.connected = false;

            UpdatePlayers();

             //send status msg
            let msg = `<p class="status-msg">[${new moment().format("HH:mm A")}] ${player1.name} dissconnected.</p>`
            database.ref("messages").push({
                msg
            });
        }else if(currentPlayer == "Player2" && player1.connected == true){
            player2.connected = false;
            UpdatePlayers();

            //send status msg
            let msg = `<p class="status-msg">[${new moment().format("HH:mm A")}] ${player2.name} dissconnected.</p>`
            database.ref("messages").push({
                msg
            });
        }else{
            shutItDown();
        }      
    });

    // function startNewGameSession(){
    //     console.log("doing it")
    //     database.ref().set({
    //       clearObj
    //     });
    //     console.log('clear fb')
    // }

    function shutItDown(){
        gameover = false;
         player1 = {
            name: "Player 1",
            choice: {rock: false, paper: false, scissors: false, hasPicked: false},
            wins: 0,
            ties: 0,
            losses: 0,
            connected: false,
          }
        
           player2 = {
            name: "Player 2",
            choice: {rock: false, paper: false, scissors: false, hasPicked: false},
            wins: 0,
            ties: 0,
            losses: 0,
            connected: false,
          }
          UpdatePlayers()
    }


 

});




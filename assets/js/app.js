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
    gameover = false;

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
    //Updates the local changes to FB
    function UpdatePlayers(){
        database.ref().set({
            players: {
                player1, 
                player2,
                gameover}
          });
    }
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
        $("#player1-h2").html(`<h2>${player1.name} Controls</h2>`)
        $("#player1Wins").text(`Wins: ${player1.wins}`);
        $("#player1Losses").text(`Losses: ${player1.losses}`);
        $("#player1Ties").text(`Ties: ${player1.ties}`);

        //Player 2
        $("#player2-h2").html(`<h2>${player2.name} Controls</h2>`)
        $("#player2Wins").text(`Wins: ${player2.wins}`);
        $("#player2Losses").text(`Losses: ${player2.losses}`);
        $("#player2Ties").text(`Ties: ${player2.ties}`);
    }

$(document).on("click", ".set-name", function(e) {
    e.preventDefault();
    if(player1.connected == false && player2.connected == false){
        //save Player1 to FireBase
        player1.connected = true;
        player1.name = $("#player_name").val().trim();
        UpdatePlayers()
        readData();
        $("#player1-controls").show();
        
        
    }else if(player1.connected == true && player2.connected == false){
        //save Player2 to FireBase
        player2.connected = true;
        player2.name = $("#player_name").val().trim();
        UpdatePlayers();
        readData();
        $("#player2-controls").show();
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
            UpdatePlayers()
        }else{
            console.log("user one already picked")
        }
            break;
        case 'paper':
        if(player1.choice.hasPicked == false){
            player1.choice.paper = true;
            player1.choice.hasPicked = true;
            UpdatePlayers()
        }else{
            console.log("user one already picked")
        }
            break;
        case 'scissors':
        if(player1.choice.hasPicked == false){
            player1.choice.scissors = true;
            player1.choice.hasPicked = true;
            UpdatePlayers()
        }else{
            console.log("user one already picked")
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
            UpdatePlayers()
        }else{
            console.log("user two already picked")
        }
            break;
        case 'paper':
        if(player2.choice.hasPicked == false){
            player2.choice.paper = true;
            player2.choice.hasPicked = true;
            UpdatePlayers()
        }else{
            console.log("user two already picked")
        }
            break;
        case 'scissors':
        if(player2.choice.hasPicked == false){
            player2.choice.scissors = true;
            player2.choice.hasPicked = true;
            UpdatePlayers()
        }else{
            console.log("user two already picked")
        }
            break;
    }
    }
});


function gameLogic(){
    if(gameover){
        $("#newgame").empty();
        $("#newgame").append(`<button class="btn btn-danger new-game">New Game</button>`)
    }  
    if(player1.choice.hasPicked && player2.choice.hasPicked && gameover == false){
        let player1_rock = player1.choice.rock;
        let player1_paper = player1.choice.paper;
        let player1_scissors = player1.choice.scissors;
        
        let player2_rock = player2.choice.rock;
        let player2_paper = player2.choice.paper;
        let player2_scissors = player2.choice.scissors;
        
        if((player1_rock && player2_rock) || (player1_paper && player2_paper) || (player1_rock && player2_rock) || (player1_scissors && player2_scissors)){
        player1.ties++;
        player2.ties++;
        console.log("its a tie");
        gameover = true;

        }else if(player1_rock && player2_paper) {
          player1.losses++;
          player2.wins++;
          console.log("Player 2 wins!");
          gameover = true;
        }else if(player1_rock && player2_scissors) {
          player1.wins++;
          player2.losses++;
          console.log("Player 1 wins!");
          gameover = true;
        }else if(player1_paper && player2_rock) {
          player1.wins++;
          player2.losses++;
          console.log("Player 1 wins!");
          gameover = true;
        }else if(player1_scissors && player2_rock) {
          player1.losses++;
          player2.wins++;
          console.log("Player 2 wins!");
          gameover = true;
        }else if(player1_scissors && player2_paper) {
          player1.wins++;
          player2.losses++;
          console.log("Player 1 wins!");
          gameover = true;
        }else if(player1_paper && player2_scissors) {
          player1.losses++;
          player2.wins++;
          console.log("Player 2 wins!");
          gameover = true;
        }
        
        UpdatePlayers();
        } 
    }

    $(document).on("click", ".new-game", function (){
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
    });





});
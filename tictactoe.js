var net = require('net');
//let myModule = require('./tictactoeModule');
let board = [];
let user = [];
let ans;
let session = [];
let counter = 0;;


let r = 3; // 3 rows
let c = 3; // of 3 cells

for ( var y = 0; y < r; y++ ) {
    board[y] = [];
    for ( var x = 0; x < c; x++ ) {
        board[y][x] = 0;
    }
}


var server = net.createServer(function(connection) { 
   console.log('Player '+(counter+1)+' is connected');
   session[counter]= connection;
   user[counter]= counter+1;

   if (counter==1){
    //Printing out the board to the first player
      session[0].write(JSON.stringify(board[0]));
      session[0].write('\r\n');
      session[0].write(JSON.stringify(board[1]));
      session[0].write('\r\n');
      session[0].write(JSON.stringify(board[2]));
      session[0].write('\r\n');

   //Telling player 1 to choose a spot on the board
      session[0].write("Choose a spot on the board\r\n");
   }

   
   connection.on('data', function(choice){    

   //take in choice from the player
      ans = choice.toString();
      let row = ans.charAt(0);
      let col = ans.charAt(1);


   //checking if the spot is available
      if( board[row-1][col-1] != 0 ) {
         session[counter-1].write("Choose another place. This place is either in use or doesn't exist. Please make sure you chose a spot between 1 and 3.\r\n");
         ans = choice.toString();
         row = ans.charAt(1);
         col = ans.charAt(2);
      }
      else{
       //inputs the choice of each player into the board
         board[row-1][col-1]=(counter);

         if(checkWin(counter, board)){
            session[0].write("Player "+counter+" is the winner");
            session[1].write("Player "+counter+" is the winner");
            session[0].destroy();
            session[1].destroy();
         }
         else if(checkTie(board)){
            session[0].write("It is a stale mate!");
            session[1].write("It is a stale mate!");
            session[0].destroy();
            session[1].destroy();
         };
      

       //changes the counter, thereby going to the next user
         if(counter==1){
            counter++;
         }
         else if(counter==2){
            counter--;
         };

         //prints out the board to the next person and awaits their input
         session[counter-1].write('\r\n');
         session[counter-1].write(JSON.stringify(board[0]));
         session[counter-1].write('\r\n');
         session[counter-1].write(JSON.stringify(board[1]));
         session[counter-1].write('\r\n');
         session[counter-1].write(JSON.stringify(board[2]));
         session[counter-1].write('\r\n');
         session[counter-1].write("Your turn!\r\n");

      }
   });

   if(counter!=1){
      counter += 1;
   };
   
});




server.listen(1235, '127.0.0.1', function() { 
   console.log('server is listening');
});



//Checks if there is a winner
function checkWin(p, board){
   if(board[0][0] == p && board[0][1] == p && board[0][2] == p || 
      board[1][0] == p && board[1][1] == p && board[1][2] == p ||
      board[2][0] == p && board[2][1] == p && board[2][2] == p ||
      board[0][0] == p && board[1][0] == p && board[2][0] == p ||
      board[0][1] == p && board[1][1] == p && board[2][1] == p ||
      board[0][2] == p && board[1][2] == p && board[2][2] == p ||
      board[0][0] == p && board[1][1] == p && board[2][2] == p ||
      board[0][3] == p && board[1][2] == p && board[2][0] == p){
      return true;
   };
   return false;
};

//Checks if there is a Stalemate
function checkTie(board){
   if(board[0][0] != 0 && board[0][1] != 0 && board[0][2] != 0 && board[1][0] != 0 &&
      board[1][1] != 0 && board[1][2] != 0 && board[2][0] != 0 && board[2][1] != 0 && 
      board[2][2] != 0){
         return true
      }
      return false
}

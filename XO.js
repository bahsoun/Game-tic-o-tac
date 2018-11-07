var p1Typ,p1Typ,p1Nam,p2Nam,comPlNames=["Hacker Comp","Goo","Hard PC","Innvoative"], nbrPlays, nbrPlay, turn=false,turnTimeout, hgScor, newHS, recGamePlay={},liveGameMap={}, saveToDb,rowsCols=9,directions=[];
var winning=false;

//1st user interface
function drawStart(){
    $("#play").html('');
    $("#play").append(function(){ //asking for input, this will be cleared on play begin to prevent modification
        var inputs="<input name=p1Name type=text placeholder='Type in your name'><br>Player 2 Type:<br><label><input name=p2type value=h type=radio disabled> Human</label><br><label><input name=p2type value=c type=radio> Computer</label><br><input name=totalTourn type=text placeholder='Type the number of tournements'><div id=startGame> Start The Game </div>";
        return inputs;
    });
    stratGame();
}

//Initiate the game after input
function stratGame(){
    function saveSetStart(){
        $(".player1").text($("input[name='p1Name']").val());
        $(".turn").text($("input[name='p1Name']").val());
        $(".player2").text(comPlNames[3]);
    //    p2Nam=comPlNames[random(Number(comPlNames.length01))];
        p1Nam=$("input[name='p1Name']").val();
        p2Nam=comPlNames[3];
        drawBoard();
    }
    //binding mouse clicks & kb events to play the game,binding is made after making the html elements
    $("#play input").on('keypress',function(e){
        (e.keyCode ==13 ? saveSetStart() : '');// hit enter begins the game also, (no submit)
    });
    $("#startGame").click(function(){
        saveSetStart();
    });
}

//draw the board Cells and Info (Score, player..)
function drawBoard(){
    $("#play").html('');
    $("#play").append(function(){
        var bf="<table border=1>",bd="",af="</table>";
        for (var i=0;i < rowsCols;i++){
            liveGameMap[i]={};//declare rows as object for storing results as objects, keys are cell coordinates,& val its value
            bd+="<tr id="+i+">";
            for (var j=0;j < rowsCols;j++){
                liveGameMap[i][j]='';
                bd+="<td class='gameCell' id="+i+j+">&nbsp;</td>";
            }
            bd+="</tr>";
        }
        var code=bf+ bd + af;
        return code;
    });
    printResults();//calling 1st time to draw results pane
    writeCell();//bind mouse clicks after board elements are created
}

//Check for the winner
function winCheckA(txt,cell){
    var winCells=[];
    var winnv=0;
    //variables to test each direction
    var all=[
        [-1,"d","Diagonal Right To Left"],
        [1,"d","Diagonal Left To Right"],
        [0,'',"Vertically"],
        [1,'',"Horizontal"]
    ];
    
    //This will check only the needed cells to see if player wins, it will not scan the whole board in 4 directions
    function verifyWinAllDir(a,b,c){
        var cellXY;
        var cond;
        //Diagonal set fixed min / max, if vert/horiz set special calulated min/max
        var vlMinCell= (b === "d" ? -2 : Number(Number(cell[a])-2));
        var vlMaxCell= (b === "d" ? 3 : Number(Number(cell[a])+3));
        
        //Loop from 2 cells before to 2 cells after the current clicked cell
        for (var p = vlMinCell; p < vlMaxCell; p++){
            //Diagonal, special coordinates & board borders condition
            if ( b === "d"){
                var cX = Number(cell[0])+p;
                var cY = Number(cell[1])+(p*a);   
                cellXY=cX+""+cY;
                cond = "0 <= cX && cX < rowsCols && 0 <= cY && cY < rowsCols";
            }else {
                (a === 0 ? cellXY=p+cell[1] : (a === 1 ? cellXY=cell[0]+p : "" ) );
                cond = "0 <= p && p < rowsCols";
            }
            //Prevent checking outside board borders
            if ( cond ){
//                $("#"+cellXY).text("i"+cellXY);
                if ($("#"+cellXY).text() === txt){
                    winnv++;
                    winCells.push(cellXY);
                }else{
                    winnv=0;
                    winCells=[];
                }
                if (winnv >=3){
                    console.log("WINNER " + c);
                    for (var o=0;o < winCells.length;o++){
                        $("#"+winCells[o]).addClass("red");
                    }
                    window.winning=true;
                    break;
                }
            }
        }
    }
    
    //Loop over each direction and pass its variables
    for (var i = 0; i < all.length;i++){
      verifyWinAllDir(all[i][0],all[i][1],all[i][2])  ;
    }
}



//Print the played board results
function printResults(){
    $("#map").html('');
    $("#map").append('<table>');
    $.each(liveGameMap,function(k,v){
        $("#map table").append("<tr>");
        $.each(v,function(a,b){
            $("#map table tr:last-child").append("<td>"+b+"</td>");
        });
        $("#map").append("</tr>");
    });
    $("#map").append('</table>');
}

//add the x / O to the cell
function writeCell(){
     function exec(x,y){
//        console.log(window.winning);
         //cell empty & no winner yet
        if ( liveGameMap[x][y] === '' && !window.winning){
            if (turn){
                indice = "X";
                $(".turn").text(p1Nam);
            } else{
                indice = "O";
                $(".turn").text(p2Nam);
            }
            $("#"+x+y).text(indice);
            liveGameMap[x][y]=indice;
            winCheckA(indice,x+''+y);//check for the winner on each click
            turn = !turn;
        }
         printResults();
    }
    
    $(".gameCell").click(function(){
        exec(this.id[0],this.id[1]);
    });
    
    $(document).keypress(function(e){
        switch (e.keyCode){
                case 113 : exec(0,0);break;
                case 119 : exec(0,1);break;
                case 101 : exec(0,2);break;
        
                case 97 : exec(1,0);break;
                case 115 : exec(1,1);break;
                case 100 : exec(1,2);break;
      
                case 122 : exec(2,0);break;
                case 120 : exec(2,1);break;
                case 99 : exec(2,2);break;
        }
    });
}



function main(){
    drawBoard();
//    drawStart();
}

main();
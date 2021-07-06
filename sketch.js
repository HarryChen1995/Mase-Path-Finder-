var cols, rows;
var w = 40
var grid = [];

var current;

var stack = [];

function setup(){
	var canvas = createCanvas(1000, 1000);
	canvas.parent("maze")
	cols = floor(width/w);
	rows = floor(height/w);
	frameRate(50); //increase to speed up

	for(var y = 0; y < rows; y++){
		for(var x = 0; x < cols; x++){
			var cell = new Cell(x, y);
			grid.push(cell);
		}
	}

	// generate maze

	current = grid[0];
	var finished = false
	while(!finished){ 
	current.visited = true;
	//STEP 1
	var next =  current.checkNeighbours();
	if(next){
		next.visited = true;
		//STEP 2
		stack.push(current);
		//STEP 3
		removeWalls(current, next);
		//STEP 4
		current = next;
	} else if (stack.length > 0){
			current = stack.pop();
	}

	if (current.x == 0 && current.y ==0 && current.checkNeighbours() == undefined){
		finished = true
	}
	
 }

  for(var x = 0; x < grid.length; x++){
	  grid[x].visited = false
  }
  current = grid[0]
  stack = []
}
var findedPath = false
function draw(){

	if (current.x == cols - 1  &&  current.y == rows - 1) {
		findedPath = true
	}
	if (!findedPath){
	current.visited = true
	next = current.returnWalls()
	if (next) {

	next.visited = true
	stack.push(current)
	current = next
	}
	else if (stack.length > 0){
		current = stack.pop()
	}
	
}


	for(var x = 0; x < grid.length; x++){
		grid[x].show();
		
	}


	if (!findedPath) {
	showPath();
	}else{
      sohwFinalPath()
	}


 

}
fadeAmount  =  0 
function sohwFinalPath(){
	fadeAmount += 1
	if (fadeAmount > 60) {
		fadeAmount = 0
	}
	for(let s = 0; s < stack.length; s++){
		var x = stack[s].x * w;
		var y = stack[s].y * w;
		noStroke()
		fill(50, 220, 103, fadeAmount)
		rect(x,y,w,w )
	}
	x =  (cols - 1) * w 
	y = (rows - 1) * w
	noStroke()
	fill(50, 220, 103, fadeAmount)
	rect(x,y,w,w )
}

function showPath(){
	for(let s = 0; s < stack.length; s++){
		var x = stack[s].x * w;
		var y = stack[s].y * w;
		noStroke()
		if (s != stack.length -1 ){
		fill(123, 122, 223, 50)
		}
		else {
			fill(220, 220, 223, 50)
		}
		rect(x,y,w,w )
	}
}

function index(x, y){
	if(x < 0 || y < 0 || x > cols-1 || y > rows-1){
		return -1;
	}
	return x + y * cols;
}

function Cell(x, y){
	this.x = x;
	this.y = y;
	this.walls = [true, true, true, true]; //Top, Right, Bottom, Left
	this.visited = false;


	this.returnWalls = function(){
		var w = []
	

		var top = grid[index(x, y - 1)];
		var right = grid[index(x + 1, y)];
		var bottom = grid[index(x, y + 1)];
		var left = grid[index(x - 1, y)];

		if( top &&  !top.visited && !this.walls[0]){
			w.push(top);
		}
		if( right  &&  !right.visited  &&!this.walls[1]){
			w.push(right);
		}
		if( bottom &&  !bottom.visited &&!this.walls[2]){
			w.push(bottom);
		}
		if( left  && !left.visited && !this.walls[3]){
			w.push(left);
		}

		if(w.length > 0){
			var r = floor(random(0, w.length));
			return w[r];
		} else{
			return undefined;
		}

	}


	this.checkNeighbours = function(){
		var neighbours = [];

		var top = grid[index(x, y - 1)];
		var right = grid[index(x + 1, y)];
		var bottom = grid[index(x, y + 1)];
		var left = grid[index(x - 1, y)];

		if(top && !top.visited){
			neighbours.push(top);
		}
		if(right && !right.visited){
			neighbours.push(right);
		}
		if(bottom && !bottom.visited){
			neighbours.push(bottom);
		}
		if(left && !left.visited){
			neighbours.push(left);
		}

		if(neighbours.length > 0){
			var r = floor(random(0, neighbours.length));
			return neighbours[r];
		} else{
			return undefined;
		}
	}

	this.show = function(){
		var x = this.x * w;
		var y = this.y * w;
		stroke(255);
		if(this.walls[0]){
			line(x, y, x+w, y);
		}
		if(this.walls[1]){
			line(x+w, y, x+w, y+w);
		}
		if(this.walls[2]){
			line(x+w, y+w, x, y+w);
		}
		if(this.walls[3]){
			line(x, y+w, x, y);
		}
			noStroke()
			fill(51)
			rect(x,y,w,w)
		
			if (this.x == 0 && this.y == 0){
				textSize(23)
				fill(230)
				text("start", x, y)
			}
	}
}

function removeWalls(a, b){
	var x = a.x - b.x;
	if(x === 1){
		a.walls[3] = false;
		b.walls[1] = false;
	} else if(x === -1){
		a.walls[1] = false;
		b.walls[3] = false;
	}

	var y = a.y - b.y;
	if(y === 1){
		a.walls[0] = false;
		b.walls[2] = false;
	} else if(y === -1){
		a.walls[2] = false;
		b.walls[0] = false;
	}
}

function make_board_with_values(){
	var x = document.getElementById("form_id");
	const width = x.elements[0].value
	const bombs = x.elements[1].value

	if (width>9 && width < 50 && bombs > 0 && bombs <= width*width/2){
		let isGameOver = false;
		const board = document.querySelector(".board")
		const flagsLeft = document.querySelector('#flags-left')
		const result = document.querySelector('#result')
		let tegels = []
		let flags = 0
		let bombs_number = 0
		make_board(parseInt(width), parseInt(bombs))
	}
}





//document.addEventListener('DOMContentLoaded', () => { //zodat de js file pas begint wanneer de hele html is opgestart

	// definiëren van aantal belangrijke veriabelen:
	let isGameOver = false;
	const board = document.querySelector(".board")
	const flagsLeft = document.querySelector('#flags-left')
	const result = document.querySelector('#result')
	let tegels = []
	let flags = 0
	let bombs_number = 0

	//make board
	function make_board(width, bombs_amount){

		isGameOver = false;
		const board = document.querySelector(".board")
		const flagsLeft = document.querySelector('#flags-left')
		const result = document.querySelector('#result')
		tegels = []
		flags = 0

		document.querySelector(".board").innerHTML = "";



		width_px = width*40
		blab = width_px.toString()+'px'
		board.style.width = blab;
		board.style.height = blab;



		bombs_number = bombs_amount
    	flagsLeft.innerHTML = bombs_number
		// geef elke tegel een attribuut 'bomb' of 'empty'
		const bombarray = []
		for (let i = 0; i < bombs_number; i++){
			bombarray.push('bomb')
		}
		for (let i = 0; i < (width*width-bombs_number); i++){
			bombarray.push('empty')
		}
		const finalarray = bombarray.sort(() => Math.random() -0.5)
		console.log(finalarray)
		// nu heb je een array met elementen 'bomb' of 'empty' --> deze toepassen op de vakjes/tegels

		for (let i = 0; i < width*width; i++){
			const tegel = document.createElement("div")
			tegel.setAttribute("id", i)
			tegel.classList.add(finalarray[i])
			board.appendChild(tegel)
			tegels.push(tegel)

			// click function met linkermuisknop
			tegel.addEventListener('click', function(e){
				click(tegel, width)
			})
		

		     //click met rechtermuisknop
			tegel.oncontextmenu = function(e) {
				e.preventDefault()
				addFlag(tegel)
			}
			
		}

		// set numbers on tegels
		for (let i = 0; i < width*width; i++){
			let total_number = 0
			const isLeft = (i % width === 0);
			const isRight = (i % width === width -1);

			if (tegels[i].classList.contains('empty')) {
				if (i>0 && !isLeft && tegels[i-1].classList.contains("bomb")){ total_number ++} //links
				if (i>(width-1) && !isRight && tegels[i+1-width].classList.contains("bomb")){ total_number++} // boven rechts
				if (i>(width-1) &&  tegels[i-width].classList.contains("bomb")) { total_number ++} // boven
				if (i>(width-1) && !isLeft && tegels[i-1-width].classList.contains("bomb")) { total_number ++} // boven links
				if (i< (width*width-1) && !isRight && tegels[i+1].classList.contains("bomb")){ total_number ++} // rechts
				if (i<(width-1)*width && !isRight && tegels[i+1+width].classList.contains("bomb")){ total_number++} // onder rechts
				if (i<(width-1)*width &&  tegels[i+width].classList.contains("bomb")) { total_number ++} // onder
				if (i<(width-1)*width && !isLeft && tegels[i-1+width].classList.contains("bomb")) { total_number ++} // onder links

				tegels[i].setAttribute("number", total_number)
			}
		}

	}









	//add Flag with right click
	function addFlag(tegel) {
		if (isGameOver) return
		if (!tegel.classList.contains('checked') && (flags < bombs_number)) {
		  if (!tegel.classList.contains('flag')) {
		    tegel.classList.add('flag')
		    tegel.innerHTML = ' 🚩'
		    flags ++
		    flagsLeft.innerHTML = bombs_number- flags
		    checkForWin()
		  } else {
		    tegel.classList.remove('flag')
		    tegel.innerHTML = ''
		    flags --
		    flagsLeft.innerHTML = bombs_number- flags
		  }
		}
	}

	// recursieve functie
	// invoer: tegel, returnt bij bom, checked, flag. als dit niet zo is, zal hij checken en in het geval dat er geen nummber staat de functie checktegel oproepen.
	function click(tegel, width) {
		console.log(1)
		let currentId = tegel.id
		if (isGameOver) return
		console.log(2)
		if (tegel.classList.contains('checked') || tegel.classList.contains('flag')) return
		console.log(3)
		if (tegel.classList.contains("bomb")){
			console.log(4)
			alert("GAME OVER")
			isGameOver = true
			//show ALL the bombs
	    	tegels.forEach(tegel=> {
	    		if (tegel.classList.contains('bomb')){
		        	tegel.innerHTML = '💣'
		        	tegel.classList.remove('bomb')
		        	tegel.classList.add('checked')
	        	}
	      	})
	      	return
		} else {
			let total = tegel.getAttribute("number")
			if (total != 0) {
				tegel.classList.add('checked')
				tegel.innerHTML = total
				return
			}
			tegel.classList.add('checked')
			checktegel(tegel, currentId, width)
		}		

	}


	// check neigbours after click
	function checktegel(tegel, currentId, width){
		if (tegel.classList.contains('number')){
			click(tegel)
			return
		}
		else{
			neigbours = get_neighbours(currentId, width)
			for (let neigbour of neigbours){
				click(tegels[neigbour],width)
			}
		}
	}




	// hulpfuncties
	function get_neighbours(a, width){
		i = parseInt(a)
		// i = tegelId
		const isLeft = (i% width === 0);
		const isRight = (i % width === width -1);

		neigbours = []
		if (i>0 && !isLeft && is_square_to_discover(tegels[i-1]))                      {neigbours.push(i-1)} //links
		if (i>(width-1) && !isRight && is_square_to_discover(tegels[i+1-width]))  {neigbours.push(i+1-width)}// boven rechts
		if (i>(width-1) && is_square_to_discover(tegels[i-width]))                 {neigbours.push(i-width)} // boven
		if (i>(width-1) && !isLeft  && is_square_to_discover(tegels[i-1-width]))   {neigbours.push(i-1-width)} // boven links
		if (i< (width*width-1) && !isRight && is_square_to_discover(tegels[i+1]))                    {neigbours.push(i+1)} // rechts

		if (i<(width-1)*width && !isRight  && is_square_to_discover(tegels[i+1+width]))   {neigbours.push(i+1+width)} // onder rechts
		if (i<(width-1)*width && is_square_to_discover(tegels[i+width]))                  {neigbours.push(i+width)}// onder
		if (i<(width-1)*width && !isLeft  && is_square_to_discover(tegels[i-1+width]))    {neigbours.push(i-1+width)} // onder links
		return neigbours
	}

	function is_square_to_discover(tegel){
		if (tegel.classList.contains("bomb") || tegel.classList.contains("checked") || tegel.classList.contains("flag")){
			return false
		}
		else{
			return true
		}
	}







	//check for win
	function checkForWin() {
	///simplified win argument
		let matches = 0

		for (let i = 0; i < tegels.length; i++) {
		  if (tegels[i].classList.contains('flag') && tegels[i].classList.contains('bomb')) {
		    matches ++
		  }
		  if (matches === bombs_number) {
		    result.innerHTML = 'YOU WIN!'
		    alert('YOU WIN!')
		    isGameOver = true
		    return
		  }
		}
	}









//})
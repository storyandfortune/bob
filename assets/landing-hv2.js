

const app = Vue.createApp({

	data() {
		return {
			ready:false,
            endPoint:"https://api.storyandfortune.com/bobs/",
			showModal:false,
            firstName:"",
            lastName:"",
			subscribe:true,
			formState:{
				verify :false,
				form:false ,
				thanks:false,
				error:false,
				message:'This is the message.'
			},
			email:{
				address:'',
				valid:true,
				sending:false
			},
			game:{
				puzzle:document.getElementById('puzzle'),
				shuffleBtn:document.getElementById('shuffleBtn'),
				playAgainBtn:document.getElementById('playAgain'),
				tryAgainBtn:document.getElementById('tryAgain'),
				solveBtn:document.getElementById('solveBtn'),
				countdown:document.getElementById('countdown'),
				alertModule:document.getElementById('alert'),
				winAlert:document.getElementById('win'),
				winSticker:document.getElementById('winSticker'),
				looseAlert:document.getElementById('loose'),
				countdownDisplay:document.getElementById('countdown'),
				pieces:[],
				canWin:true,
				activePiece:null,
				gameActive:false,
				timeLeft:60,
				countdownTimer:null,
				stickers = [
				   'https://cdn.shopify.com/s/files/1/0593/5942/8759/files/hv-burgler.png?v=1727127335',
				   'https://cdn.shopify.com/s/files/1/0593/5942/8759/files/hv-frankenboy.png?v=1727127335',
				   'https://cdn.shopify.com/s/files/1/0593/5942/8759/files/hv-dracula.png?v=1727127335',
				   'https://cdn.shopify.com/s/files/1/0593/5942/8759/files/hv-superboy.png?v=1727127335',
				   'https://cdn.shopify.com/s/files/1/0593/5942/8759/files/hv-cowboy.png?v=1727127351',
				   'https://cdn.shopify.com/s/files/1/0593/5942/8759/files/hv-beetlejuice.png?v=1727127369',
				   'https://cdn.shopify.com/s/files/1/0593/5942/8759/files/hv-evel.png?v=1727127369',
				   'https://cdn.shopify.com/s/files/1/0593/5942/8759/files/hv-lebowski.png?v=1727127369',
				   'https://cdn.shopify.com/s/files/1/0593/5942/8759/files/hv-gojira.png?v=1727127369',
				   'https://cdn.shopify.com/s/files/1/0593/5942/8759/files/hv-rat-fink.png?v=1727127369'
				];
				
			}
		}
	},
	methods: {
		resetFormState(){
			this.formState.verify = false;
			this.formState.form = false;
			this.formState.thanks = false;
			this.formState.error = false;
		},
		validateEmail(val){
			return String(val)
			.toLowerCase()
			.match(
			  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			)
		},
		resetEmail(){
			this.email.address = ""
			this.email.valid = true
		},
		addEmail(){

				this.email.sending = true

				let dataObj = {
                    'fname':this.firstName,
                    'lname':this.lastName,
					'email': this.email.address,
					'subscribe':this.subscribe,
					'tag':'heros-and-villians'
				}

				$.ajax({
					method: "POST",
					url: this.endPoint + 'social/',
					data: dataObj
				}).done( (response)  => {
					console.log(response)
					this.email.sending = false
					this.resetFormState()
					this.formState.thanks = true
				}).fail((error) => {
					console.log(error)
					this.email.sending = false
					this.resetFormState()
					this.formState.error = true
				});

		

		},
		verifyEmail(){


			this.email.valid = this.validateEmail(this.email.address)

			if(this.email.valid && this.subscribe){

			this.email.sending = true
			let dataObj = {
				'fname':this.firstName,
				'lname':this.lastName,
				'email': this.email.address,
				'subscribe':this.subscribe.toString()
			}
			$.ajax({
				method: "POST",
				url: this.endPoint + "verify/add/",
				data: dataObj
			}).done( (response)  => {
				console.log(response)
				this.email.sending = false
				this.formState.message = response.message

				if(response.status === true && response.newUser === true){
					this.resetFormState()
					setTimeout(() => {	this.formState.verify = true}, 1000)
				
				}
				else if(response.status === true && response.newUser === false){
					this.resetFormState()
					this.formState.thanks = true
				}
				else{
					this.resetFormState()
					this.formState.error = true
				}

			}).fail((error) => {
				console.log(error)
				this.email.sending = false
				this.formState.message = error
				this.resetFormState()
				this.formState.error = true
			});
		}
		},
		checkVerify(id){
			let dataObj = {
				'id':id
			}
			this.email.sending = true
			$.ajax({
				method: "POST",
				url: this.endPoint + "verify/check/",
				data: dataObj
			}).done( (response)  => {

				console.log(response)

				this.email.address = response.data.fields[0].value
				this.firstName = response.data.fields[1].value
				this.lastName = response.data.fields[2].value
				this.subscribe = response.data.fields[3].value
				this.formState.message = response.message

				if(response.status){
					this.addEmail()
				}
			}).fail((error) => {
				console.log(error)
				this.email.sending = false
				this.resetFormState()
			    this.formState.error = true
			});
		},
		updateQR(){

				let dataObj = {
					'qrscan':'heros-and-villians'
				}

				/**/
				$.ajax({
					method: "POST",
					url: this.endPoint + "qr/",
					data: dataObj
				}).done( (response)  => {

					console.log(response)
					this.email.sending = false
					this.sent = true


				}).fail((error) => {
					console.log(error)
					this.email.sending = false
				});
		},
		buildGame() {
			console.log("init");
			this.createPieces();
			this.countdownDisplay.textContent = this.timeLeft;
			/*
			this.shuffleBtn.addEventListener('click', () => this.startGame());
			//this.solveBtn.addEventListener('click', () => this.solvePuzzle());
			this.playAgainBtn.addEventListener('click', () => this.closeAlert());
			this.tryAgainBtn.addEventListener('click', () => this.closeAlert());
			*/
		},
		createPieces() {
			for (let i = 0; i < 4; i++) {
				for (let j = 0; j < 4; j++) {
					const piece = document.createElement('div');
					piece.className = 'piece';
					piece.style.backgroundImage = `url(${this.randBob})`;
					piece.style.backgroundPosition = `${j * 33.33}% ${i * 33.33}%`;
					piece.dataset.order = i * 4 + j;
					piece.dataset.correctOrder = i * 4 + j;
					piece.addEventListener('click', (e) => this.handlePieceClick(e.target));
					this.pieces.push(piece);
					this.puzzle.appendChild(piece);
				}
			}
		},
		handlePieceClick(piece) {
			if (this.gameActive) {
				if (!this.activePiece) {
					this.activePiece = piece;
					piece.classList.add('active');
					this.tileSound.play();
				} else {
					this.swapPieces(this.activePiece, piece);
					this.activePiece.classList.remove('active');
					this.activePiece = null;
					console.log("Checking win condition after swap");
					if (this.checkWinCondition()) {
						this.winGame();
					} else {
						console.log("Win condition not met yet");
					}
				}
			}
		},
		swapPieces(piece1, piece2) {
			const tempOrder = piece1.dataset.order;
			piece1.dataset.order = piece2.dataset.order;
			piece2.dataset.order = tempOrder;
			
			const tempBgPosition = piece1.style.backgroundPosition;
			piece1.style.backgroundPosition = piece2.style.backgroundPosition;
			piece2.style.backgroundPosition = tempBgPosition;
			
			if (this.gameActive) {
				this.tileSound.play();
			}
		},
		checkWinCondition() {
			console.log("Checking win condition");
			let allCorrect = true;
			this.pieces.forEach((piece, index) => {
				const currentOrder = parseInt(piece.dataset.order);
				const correctOrder = parseInt(piece.dataset.correctOrder);
				console.log(`Piece ${index}: Current Order = ${currentOrder}, Correct Order = ${correctOrder}`);
				if (currentOrder !== correctOrder) {
					allCorrect = false;
				}
			});
			console.log(`Win condition result: ${allCorrect}`);
			return allCorrect;
		},
		shufflePieces() {
			for (let i = this.pieces.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				this.swapPieces(this.pieces[i], this.pieces[j]);
			}
			if (this.activePiece) {
				this.activePiece.classList.remove('active');
				this.activePiece = null;
			}
		},
		startCountdown() {
			this.countdownDisplay.textContent = this.timeLeft;
			
			this.countdownTimer = setInterval(() => {
				this.timeLeft--;
				this.clockTick.play();
				this.countdownDisplay.textContent = this.timeLeft;
				
				if (this.timeLeft <= 0) {
					clearInterval(this.countdownTimer);
					this.endGame();
				}
			}, 1000);
		},
		closeAlert(){
			this.alert.classList.remove('active');
			this.winAlert.classList.remove('on', 'animate__animated', 'animate__bouncein');
			this.looseAlert.classList.remove('on', 'animate__animated', 'animate__bouncein');
		},
		winGame(){
			console.log("Win condition met!");
			this.gameActive = false;
			clearInterval(this.countdownTimer);
			this.alert.classList.add('active');
			this.winAlert.classList.add('on', 'animate__animated', 'animate__bouncein');
			this.win.play();
			setTimeout(() => {  this.applause.play(); }, 1000)
		},
		endGame() {
			this.gameActive = false;
			this.alert.classList.add('active');
			this.loose.play();
			this.solvePuzzle();
		},
		solvePuzzle() {
			if (this.gameActive) {
				this.gameActive = false;
				clearInterval(this.countdownTimer);
			}
	
			const misplacedPieces = this.getMisplacedPieces();
			let index = 0;
	
			const solveInterval = setInterval(() => {
				if (index < misplacedPieces.length) {
					const piece = misplacedPieces[index];
					const correctPosition = parseInt(piece.dataset.correctOrder);
					const currentPosition = this.pieces.findIndex(p => parseInt(p.dataset.order) === correctPosition);
					
					this.swapPieces(piece, this.pieces[currentPosition]);
					this.tileSound.play();
					
					index++;
				} else {
					clearInterval(solveInterval);
					if (this.checkWinCondition()) {
						this.looseAlert.classList.add('on', 'animate__animated', 'animate__bouncein');
					}
				}
			}, 500);
		},
		getMisplacedPieces() {
			return this.pieces.filter(piece => 
				piece.dataset.order !== piece.dataset.correctOrder
			);
		},
		startGame() {
			console.log("Start Game");
			let i = 0;
			this.shufflePieces();
			this.tileSound.play();
			this.shuffleBtn.style.visibility = 'hidden';
			this.countdown.style.visibility = 'visible';
			this.winSticker.src = this.randBob;
			let startTime = setInterval(() => {
				this.shufflePieces();
				this.tileSound.play();
				i++;
				if (i === 20) {
					clearInterval(startTime);
					this.gameActive = true;
					this.startCountdown();
				}
			}, 100);
		},
		init(){
			
			const queryString = window.location.search;
	
			if(queryString === "?qr=true"){
				this.updateQR()
			}

			if(queryString.substring(0, 7) === "?verify"){
			   let id = queryString.slice(8);
			   this.email.sent = true;
			   this.checkVerify(id)
			}

			
			this.ready = true
	   }
	},
	delimiters: ['${', '}'],
	beforeMount() {
		if( window.location.hostname === '127.0.0.1'){
			this.endPoint = "http://dev.api/bobs/"
		}
	},
	mounted(){
		console.log('init 75th')
		this.init()
	}
})

app.mount("#app");



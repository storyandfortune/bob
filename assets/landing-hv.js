

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
				form:true ,
				thanks:false,
				error:false,
				message:'This is the message.'
			},
			email:{
				address:'',
				valid:true,
				sending:false
			},
			pieces: [],
			activePiece: null,
			gameActive: false,
			timeLeft: 60,
			countdownTimer: null,
			showAlert: false,
			showWinAlert: false,
			showLooseAlert: false,
			stickers: [
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
			],
			randBob: '',
			sounds: {
				tileSound: null,
				clockTick: null,
				win: null,
				applause: null,
				loose: null
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
		initSounds() {
			// For testing purposes, we'll use a single sound file
  
			this.sounds.tileSound = new Howl({ src: ['https://cdn.shopify.com/s/files/1/0593/5942/8759/files/hv-tile-click.mp3?v=1727127235'], preload: true });
			this.sounds.clockTick = new Howl({ src: ['https://cdn.shopify.com/s/files/1/0593/5942/8759/files/hv-count-down-clock.mp3?v=1727127235'], preload: true });
			this.sounds.win = new Howl({ src: ['https://cdn.shopify.com/s/files/1/0593/5942/8759/files/hv-win-sound.mp3?v=1727127235'], preload: true });
			this.sounds.applause = new Howl({  src: ['https://cdn.shopify.com/s/files/1/0593/5942/8759/files/hv-audience-applause.mp3?v=1727127235'], preload: true });
			this.sounds.loose = new Howl({  src: ['https://cdn.shopify.com/s/files/1/0593/5942/8759/files/hv-loose-sound.mp3?v=1727127235'], preload: true });
		},
		createPieces() {
			for (let i = 0; i < 16; i++) {
				this.pieces.push({
					order: i,
					correctOrder: i,
					backgroundPosition: `${(i % 4) * 33.33}% ${Math.floor(i / 4) * 33.33}%`,
					top: `${Math.floor(i / 4) * 100}px`,
					left: `${(i % 4) * 100}px`
				});
			}
		},
		getPieceStyle(piece) {
			return {
			  backgroundImage: `url(${this.randBob})`,
			  backgroundPosition: piece.backgroundPosition,
			  top: `${Math.floor(piece.order / 4) * 100}px`,
			  left: `${(piece.order % 4) * 100}px`
			};
		},
		handlePieceClick(piece) {
			console.log('Piece clicked:', piece);
			if (this.gameActive) {
			  if (!this.activePiece) {
				console.log('Setting active piece');
				this.activePiece = piece;
				this.sounds.tileSound.play();
			  } else {
				console.log('Swapping pieces');
				this.swapPieces(this.activePiece, piece);
				this.activePiece = null;
				if (this.checkWinCondition()) {
				  this.winGame();
				}
			  }
			} else {
			  console.log('Game is not active');
			}
		},
		swapPieces(piece1, piece2) {
			console.log('Swapping', piece1, 'with', piece2);
			
			// Store the indices of the pieces
			const index1 = this.pieces.indexOf(piece1);
			const index2 = this.pieces.indexOf(piece2);
			
			// Swap the entire piece objects
			[this.pieces[index1], this.pieces[index2]] = [this.pieces[index2], this.pieces[index1]];
			
			// Update the order property
			this.pieces[index1].order = index1;
			this.pieces[index2].order = index2;
			
			// Force a re-render
			this.pieces = [...this.pieces];
		  
			if (this.gameActive) {
			  this.sounds.tileSound.play();
			}
		},
		checkWinCondition() {
			return this.pieces.every(piece => piece.order === piece.correctOrder);
		},
		shufflePieces() {
			console.log('Shuffling pieces');
			
			// Create a new array of indices and shuffle it
			const indices = Array.from({ length: this.pieces.length }, (_, i) => i);
			for (let i = indices.length - 1; i > 0; i--) {
			  const j = Math.floor(Math.random() * (i + 1));
			  [indices[i], indices[j]] = [indices[j], indices[i]];
			}
			
			// Create a new array of pieces based on the shuffled indices
			const shuffledPieces = indices.map((index, newPosition) => {
			  const piece = { ...this.pieces[index] };  // Create a shallow copy of the piece
			  piece.order = newPosition;
			  piece.top = `${Math.floor(newPosition / 4) * 100}px`;
			  piece.left = `${(newPosition % 4) * 100}px`;
			  return piece;
			});
			
			// Update the pieces array
			this.pieces = shuffledPieces;
			
			this.activePiece = null;
			console.log('Pieces after shuffle:', this.pieces);
		},
		startCountdown() {
			this.countdownTimer = setInterval(() => {
				this.timeLeft--;
				this.sounds.clockTick.play();
				if (this.timeLeft <= 0) {
					clearInterval(this.countdownTimer);
					this.endGame();
				}
			}, 1000);
		},
		closeAlert() {
			this.showAlert = false;
			this.showWinAlert = false;
			this.showLooseAlert = false;
		},
		winGame() {
			this.gameActive = false;
			clearInterval(this.countdownTimer);
			this.showAlert = true;
			this.showWinAlert = true;
			this.sounds.win.play();
			setTimeout(() => { this.sounds.applause.play(); }, 1000);
		},
		endGame() {
			this.gameActive = false;
			this.showAlert = true;
			this.showLooseAlert = true;
			this.sounds.loose.play();
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
					const correctPosition = piece.correctOrder;
					const currentPosition = this.pieces.findIndex(p => p.order === correctPosition);
					
					this.swapPieces(piece, this.pieces[currentPosition]);
					this.sounds.tileSound.play();
					
					index++;
				} else {
					clearInterval(solveInterval);
					if (this.checkWinCondition()) {
						this.showLooseAlert = true;
					}
				}
			}, 500);
		},
		getMisplacedPieces() {
			return this.pieces.filter(piece => piece.order !== piece.correctOrder);
		},
		startGame() {
			console.log('Game started');
			let i = 0;
			this.shufflePieces();
			this.sounds.tileSound.play();
			this.gameActive = true;
			this.timeLeft = 60;
		
			const startInterval = setInterval(() => {
			  this.shufflePieces();
			  this.sounds.tileSound.play();
			  i++;
			  if (i === 20) {
				clearInterval(startInterval);
				this.gameActive = true;
				this.startCountdown();
			  }
			}, 100);
		},
		launchGame(){

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
			this.randBob = this.stickers[Math.floor(Math.random() * this.stickers.length)];
			this.createPieces();
			this.initSounds();
	   }
	},
	delimiters: ['${', '}'],
	beforeMount() {
		if( window.location.hostname === '127.0.0.1'){
			this.endPoint = "http://dev.api/bobs/"
		}
	},
	mounted(){
		console.log('Heros & Villians')
		this.init()
	}
})

app.mount("#app");



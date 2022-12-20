var app = Vue.createApp({

	data() {
		return {
			ready:false,     
			testing:{'test':false, 'index':null},
			fish:{
				useFish:true, 
				images:[
					'https://cdn.shopify.com/s/files/1/0593/5942/8759/files/fish-purple.png?v=1669509615', 
					'https://cdn.shopify.com/s/files/1/0593/5942/8759/files/fish-blue.png?v=1669509615', 
					'https://cdn.shopify.com/s/files/1/0593/5942/8759/files/fish-blue-orange.png?v=1669509615', 
					'https://cdn.shopify.com/s/files/1/0593/5942/8759/files/fish-red.png?v=1669509615', 
					'https://cdn.shopify.com/s/files/1/0593/5942/8759/files/fish-orange-blue.png?v=1669509616', 
					'https://cdn.shopify.com/s/files/1/0593/5942/8759/files/fish-green.png?v=1669509615', 
					'https://cdn.shopify.com/s/files/1/0593/5942/8759/files/fish-orange.png?v=1669509615', 
					'https://cdn.shopify.com/s/files/1/0593/5942/8759/files/fish-pink.png?v=1669509615'
				]},
			gameState:"init", // init, enter-email, start, reset-wheel, show-prize, your-code, game-over
			mainTitle:"",
			titleSvgs:{
				wheelOfFish:{file:"https://cdn.shopify.com/s/files/1/0593/5942/8759/files/s2w-wheel-of-fish.svg?v=1671557956"},
				spinToWin:{file:"https://cdn.shopify.com/s/files/1/0593/5942/8759/files/s2w-spin-to-win.svg?v=1671557956"},
				play:{file:"https://cdn.shopify.com/s/files/1/0593/5942/8759/files/s2w-play.svg?v=1671557955"},
				spinAgain:{file:"https://cdn.shopify.com/s/files/1/0593/5942/8759/files/s2w-spin-again.svg?v=1671557956"},
				orSpinAgain:{file:"https://cdn.shopify.com/s/files/1/0593/5942/8759/files/s2w-or-spin-again.svg?v=1671557956"},
				noSpinsLeft:{file:"https://cdn.shopify.com/s/files/1/0593/5942/8759/files/s2w-no-spins-left.svg?v=1671557956"},
				gameOver:{file:"https://cdn.shopify.com/s/files/1/0593/5942/8759/files/s2w-game-over.svg?v=1671557956"},
				youLose:{file:"https://cdn.shopify.com/s/files/1/0593/5942/8759/files/s2w-you-lose.svg?v=1671557955"},
				spin_btn:{file:"https://cdn.shopify.com/s/files/1/0593/5942/8759/files/s2w-spin_btn.svg?v=1671557956"}
			},
			titleFade:false,
			endPoint:"https://api.storyandfortune.com/bobs/customer-connect/",
			win:[
				{
					deg:0, 
					title:"Free <br/> Shirt", 
					code:"FREE-SHIRT", 
					ratio:3
				}, 
				{
					deg:45, 
					title:"More <br/> Spins", 
					code:"MORE-SPINS", 
					ratio:15
				}, 
				{
					deg:90, 
					title:"Free <br/> Hoodie", 
					code:"FREE-HOODIE", 
					ratio:1
				 },
				{
					deg:135, 
					title:"You <br/> Loose", 
					code:"YOU-LOOSE", 
					ratio:20
				},
				{
					deg:180, 
					title:"Free <br/> Stickers", 
					code:"FREE-STICKERS", 
					ratio:30
				},
				{
					deg:225, 
					title:"More <br/> Spins", 
					code:"MORE-SPINS", 
					ratio:10
				},
				{
					deg:270, 
					title:"Free <br/> PATCH", 
					code:"FREE-PATCH", 
					ratio:6
				},
				{
					deg:315, 
					title:"You <br/> Loose", 
					code:"YOU-LOOSE", 
					ratio:15
				}
			],
			win_ratio: [],
			winning_prize:{
				deg:0, 
				title:false, 
				code:false, 
				ratio:0
			},
			prize:null,
			credits:3,
			wonCredits:false,
			wheelActive:true,
			wheelPos:0,
			boy:{
				armUp:false,
				jump:"hide"
			},
			email:{
				address:'',
				valid:true,
				sending:false
			},
			audio:{
				boing:null,
				spin3:null,
				spin5:null,
				applause:null,
				winCredits:null,
				loose:null,
				soundLoaded:0,
			},
			modalMessage:{display:false, content:[]}
		}
	},
	methods: {
		returnDate(){
			return moment().format('MMMM Do YYYY, h:mm:ss a')
		},
		startGame(){
			this.audio.soundLoaded++;
			if(	this.audio.soundLoaded > 5){
				this.gameState = "enter-email"
				this.ready = true
			}
		},
		playGame(){
			this.gameState = "start"
			this.changeTitle(this.titleSvgs.spinToWin.file)
			this.boy.jump = "jump-in"
			this.audio.boing.play()
			setTimeout(() => {
				this.boy.armUp = true
			}, 1500);
		},
		winCredits(){
			let currentCredits = this.credits
			this.wonCredits = true
			this.audio.winCredits.play(); //play sound

			let winInt = setInterval(() => {
				if(this.credits === currentCredits + 3){
					clearInterval(winInt)
					this.wonCredits = false	
					this.gameState = "start"
				}
				else{
					this.credits++
					console.log(this.credits)
				}
			}, 300)
		},
		loseCredits(){
			if(this.credits > 0){
				this.wonCredits = true
				this.audio.loose.play(); //play sound
				this.wheelPos = 0
				this.changeTitle(this.titleSvgs.youLose.file)


				setTimeout(() => {
					this.audio.haha.play(); //play sound
					this.boy.jump = "laugh"
				}, 1000)

				setTimeout(() => {
					this.wonCredits = false	
					this.gameState = "start"
					this.changeTitle(this.titleSvgs.spinAgain.file)
				}, 2000)
			}
			else{
				this.gameOver()
			}
		},
		gameOver(){
			this.changeTitle(this.titleSvgs.gameOver.file)
			this.gameState = "game-over"
			this.boy.jump = "jump-out"
			this.audio.boing.play()
		},
		changeTitle(title){
			this.titleFade = true
			setTimeout(() => {
				this.mainTitle = title
				this.titleFade = false
			}, 450)
		},
		shop(){
			window.location = "/collections/all"
		},
		spin(){
			if(this.gameState === 'start' || this.testing.test === true){
	
				// testing ------------
				if(this.testing.test){
					this.prize = this.testing.index
					this.winning_prize = this.win[this.testing.index]
				}else{
					this.prize = (Math.floor(Math.random() * (1 - this.win_ratio.length)) + this.win_ratio.length) -1
					this.winning_prize = this.win[this.win_ratio[this.prize]]
				}

			
				this.wheelPos = -1 * (3600 + this.winning_prize.deg)
				this.audio.spin5.play(); //play sound
				this.boy.jump = ""
				this.credits--

				// show prize
				if(this.winning_prize.code != "MORE-SPINS" && this.winning_prize.code != "YOU-LOOSE"){

					// fade out wheel -------------
					setTimeout(() => {
						this.addCoupon()
						this.audio.applause.play()
						this.gameState = "show-prize"
						this.mainTitle = "You Won"
						this.boy.jump = "jump-out"
					}, 5750)


					// show prize ---------------
					setTimeout(() => {
						this.wheelPos = 0
						this.wheelActive = false
					}, 6750)

				}
				else{
					//wheel done spinning
					setTimeout(() => {
						this.gameState = "reset-wheel"
						if(this.winning_prize.code === "MORE-SPINS"){
							this.winCredits()
							this.wheelPos = 0
						}
						if(this.winning_prize.code === "YOU-LOOSE"){
							this.loseCredits()
						}

					}, 5500)

				}
			}else{
				this.email.valid = false
			}
		},
		addCoupon(){

			this.mainTitle = "Your Code"
			this.gameState = 'your-code'

			// add coupon to check out
			$.ajax({
				method: "GET",
				url: '/discount/' + this.winning_prize.code
			}).done( (response)  => {
				//console.log(response)
			}).fail((error) => {
				//console.log(error)
			});

	
		},
		reset(){
			this.gameState = "start"
			this.changeTitle(this.titleSvgs.spinAgain.file)
			this.wheelActive = true
			this.boy.jump = "jump-in"
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

			this.email.valid = this.validateEmail(this.email.address)

			if(this.email.valid){

				this.email.sending = true

				$.ajax({
					method: "POST",
					url: this.endPoint,
					data: {'email': this.email.address, 'note': 'Spin 2 Win'}
				}).done( (response)  => {

					console.log(response)
					this.email.sending = false

					if(response.data.customerCreate.userErrors.length){
						this.modalMessage.display = true 
						this.modalMessage.content = response.data.customerCreate.userErrors
						console.log(this.modalMessage)
					}

					if(response.data.customerCreate.customer != null){
						this.playGame()
					}
				
				}).fail((error) => {
					console.log(error)
					this.email.sending = false
					this.modalMessage.display = true 
					this.modalMessage.content.push("Oopsie Daisy... Something went wrong.")
				});

			}
		},
		testSpin(index){
			if(this.testing.test){
				this.testing.index = index
				console.log(this.testing)
				this.spin()
			}
		},
		init(){
	
			   this.audio.boing = new Howl({
			   src: ['https://cdn.shopify.com/s/files/1/0593/5942/8759/files/boing.mp3?v=1664663096'],
			   preload: true,
			   onload:()=>{
				   this.startGame();
			   }
			   });



			   this.audio.haha = new Howl({
				src: ['https://cdn.shopify.com/s/files/1/0593/5942/8759/files/ha-ha.mp3?v=1669675254'],
				preload: true,
				onload:()=>{
					this.startGame();
				}
				});


			    this.audio.winCredits = new Howl({
				src: ['https://cdn.shopify.com/s/files/1/0593/5942/8759/files/win-credits_9ab32561-e3da-48f5-92b9-e640d4d0b18c.mp3?v=1669239541'],
				preload: true,
				onload:()=>{
					this.startGame();
				}
				});

				this.audio.loose = new Howl({
					src: ['https://cdn.shopify.com/s/files/1/0593/5942/8759/files/loose.mp3?v=1669239541'],
					preload: true,
					onload:()=>{
						this.startGame();
					}
				});

			   this.audio.spin3 = new Howl({
				src: ['https://cdn.shopify.com/s/files/1/0593/5942/8759/files/spin-3.mp3?v=1664663273'],
				preload: true,
				onload:()=>{
					this.startGame();
				}
			   });
	
			    this.audio.spin5 = new Howl({
				src: ['https://cdn.shopify.com/s/files/1/0593/5942/8759/files/spin.mp3?v=1664478860'],
				preload: true,
				onload:()=>{
					this.startGame();
				}
			   });
	
			   this.audio.applause = new Howl({
				src: ['https://cdn.shopify.com/s/files/1/0593/5942/8759/files/winner-short.mp3?v=1664642420'],
				preload: true,
				onload:()=>{
					this.startGame();
				}
			   });


			   console.log(this.titleSvgs.spinToWin.file)
	
			   this.win_ratio = [];
			   let el = 0;
			   this.win.forEach((element) => {
				   for(i=0; i<element.ratio; i++){
					   this.win_ratio.push(el);
				   }
				   el++;
			   });
			
	   }
	},
	delimiters: ['${', '}'],
	beforeMount() {
		if( window.location.hostname === '127.0.0.1'){
			this.endPoint = "http://dev.api/bobs/customer-connect/"
		}
	},
	mounted(){
		this.init()
	}

})

app.mount("#app");



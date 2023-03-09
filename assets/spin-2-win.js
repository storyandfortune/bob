
 // Enable pusher logging - don't include this in production -------------------------------------------------

const app = Vue.createApp({

	data() {
		return {
			ready:false, 
			testing:{'test':false, 'index':null, "extra-param":true},
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
				youWon:{file:"https://cdn.shopify.com/s/files/1/0593/5942/8759/files/s2w-you-won.svg?v=1672350114"},
				playNow:{file:"https://cdn.shopify.com/s/files/1/0593/5942/8759/files/s2w-play-now.svg?v=1672350114"},
				spin_btn:{file:"https://cdn.shopify.com/s/files/1/0593/5942/8759/files/s2w-spin_btn-circle.svg?v=1672862472"}
			},
			titleFade:false,
			endPoint:"https://api.storyandfortune.com/bobs/customer-connect/",
			win:[
				{
					deg:0, 
					title:"Free <br/> Shirt", 
					code:"FREE-SHIRT", 
					svg:"https://cdn.shopify.com/s/files/1/0593/5942/8759/files/s2w-card-shirt.svg?v=1672766107",
					ratio:10
				}, 
				{
					deg:45, 
					title:"More <br/> Spins", 
					code:"MORE-SPINS", 
					svg:false,
					ratio:160
				}, 
				{
					deg:90, 
					title:"Free <br/> Postcard", 
					code:"FREE-POSTCARD", 
					svg:"https://cdn.shopify.com/s/files/1/0593/5942/8759/files/s2w-card-postcard.svg?v=1673403113",
					ratio:250
				 }, 
				{
					deg:135, 
					title:"You <br/> Lose", 
					code:"YOU-LOSE", 
					svg:false,
					ratio:70
				},
				{
					deg:180, 
					title:"Free <br/> Sticker", 
					code:"FREE-STICKERS", 
					svg:"https://cdn.shopify.com/s/files/1/0593/5942/8759/files/s2w-card-stickers.svg?v=1672766107",
					ratio:250
				},
				{
					deg:225, 
					title:"More <br/> Spins", 
					code:"MORE-SPINS", 
					svg:false,
					ratio:160
				},
				{
					deg:270, 
					title:"Free <br/> PATCH", 
					code:"FREE-PATCH", 
					svg:"https://cdn.shopify.com/s/files/1/0593/5942/8759/files/s2w-card-patch.svg?v=1672766107",
					ratio:50
				},
				{
					deg:315, 
					title:"You <br/> Lose", 
					code:"YOU-LOSE",
					svg:false,
					ratio:150
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
			lastWheelPos:0,
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
			date:null,
			modalMessage:{display:false, content:[]}
		}
	},
	methods: {
		backDoor(data){
			// case switch in data that updates certian objects

			// modal

			//change odds

			//test mode

			//reset cookie
			this.modalMessage = JSON.parse(JSON.stringify(data));
		},
		returnDate(){
			return "Valid on " + moment().format('MMM Do')
		},
		preloadSVG(){

			  let svg = []
			  let i = 0
			  for (const [key, value] of Object.entries(this.win)) {
				if(value.svg){
					svg[i] = new Image()
					svg[i].src = value.svg
					i++
				}
			  }


			  svg = []
			  i = 0
			  for (const [key, value] of Object.entries(this.titleSvgs)) {
				svg[i] = new Image()
				svg[i].src = value.file
				i++
			  }

		},
		startGame(){
			this.audio.soundLoaded++;
			if(	this.audio.soundLoaded > 5){
				const hasPlayed = window.localStorage.getItem('hasPlayed')
				this.ready = true
				//window.localStorage.removeItem('hasPlayed')
				console.log(hasPlayed)

				if(hasPlayed === "true"){
					this.gameState = "already-played"
					this.modalMessage.display = true 
					this.modalMessage.content = [{"message":'This device has already played'}]
				}
				else{
					this.gameState = "enter-email"
				}
		
			} 
		},
		playGame(){
			this.gameState = "start"
			window.localStorage.setItem('hasPlayed', 'true')
			this.changeTitle(this.titleSvgs.playNow.file)
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
				if(this.credits === currentCredits + 2){
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
				this.wheelPos = this.lastWheelPos
				console.log(this.titleSvgs.youLose.file)
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
			this.gameState = "game-over"
			this.boy.jump = "jump-out"
			this.audio.boing.play()
			
			setTimeout(() => {
				this.changeTitle(this.titleSvgs.gameOver.file)
				this.audio.loose.play(); //play sound
			}, 1000)
		
		},
		changeTitle(title){
			this.titleFade = true
			setTimeout(() => {
				this.mainTitle = title
				this.titleFade = false
			}, 450)
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
				this.lastWheelPos = -1 * (this.winning_prize.deg)

				console.log(this.lastWheelPos)

				this.audio.spin5.play(); //play sound
				this.boy.jump = ""
				this.credits--

				// show prize
				if(this.winning_prize.code != "MORE-SPINS" && this.winning_prize.code != "YOU-LOSE"){

					// fade out wheel -------------
					setTimeout(() => {
						this.addCoupon()
						this.audio.applause.play()
						this.gameState = "show-prize"
						this.changeTitle(this.titleSvgs.youWon.file)
						this.boy.jump = "jump-out"
					}, 5750)


					// show prize ---------------
					setTimeout(() => {
						this.wheelPos = this.lastWheelPos
						this.wheelActive = false
					}, 6750)

				}
				else{
					//wheel done spinning
					setTimeout(() => {
						this.gameState = "reset-wheel"
						if(this.winning_prize.code === "MORE-SPINS"){
							this.changeTitle(this.titleSvgs.spinAgain.file)
							this.winCredits()
							this.wheelPos = this.lastWheelPos
						}
						if(this.winning_prize.code === "YOU-LOSE"){
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
			//console.log(val)
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

				let dataObj = {
					'email': this.email.address, 
					'note': 'Spin to Win',
					'tags': '"spin2win","game"',
					'meta': {'key':null, 'value':null}
				}

				
				$.ajax({
					method: "POST",
					url: this.endPoint,
					data: dataObj
				}).done( (response)  => {

					
					this.email.sending = false

					if(response.data.customerCreate.userErrors.length){
						this.modalMessage.display = true 
						this.modalMessage.content = response.data.customerCreate.userErrors
						this.audio.loose.play(); //play sound
					}

					if(response.data.customerCreate.customer != null){
						this.playGame()
					}
				
				}).fail((error) => {
					console.log(error)
					this.email.sending = false
					this.modalMessage.display = true 
					this.modalMessage.content.push({"message":"Oopsie Daisy... Something went wrong."})
					this.audio.loose.play(); //play sound
				});

			}
		},
		testSpin(index){
			if(this.testing.test){
				this.testing.index = index
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

			   this.preloadSVG()

			   window.scrollTo(0, 500)

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
		this.date =  this.returnDate()
	},
	mounted(){
		this.init()

		/*
		Pusher.logToConsole = true;

		var pusher = new Pusher('ef4df188e5c9152613bd', {
		  cluster: 'us3'
		});
	   
		var channel = pusher.subscribe('my-channel');
		channel.bind('my-event', (data) => {
			 this.backDoor(data)
		});
		*/
	}

})

app.mount("#app");



var app = Vue.createApp({

	data() {
		return {
			ready:false,
			gameState:"init", // init, start, reset-wheel, show-prize, your-code
			mainTitle:"Free Prizes",
			endPoint:"https://api.storyandfortune.com/bobs/customer-connect/",
			win:[
				{
					deg:0, 
					title:"More <br/> Spins", 
					code:"MORE-SPINS", 
					ratio:50
				}, 
				{
					deg:45, 
					title:"10% <br/> Off", 
					code:"WIN-10-PERCENT-OFF", 
					ratio:75
				}, 
				{
					deg:90, 
					title:"Free <br/> Stickers", 
					code:"FREE-STICKERS", 
					ratio:75
				 },
				{
					deg:135, 
					title:"More <br/> Spins", 
					code:"MORE-SPINS", 
					ratio:50 
				},
				{
					deg:180, 
					title:"Free <br/> Postcards", 
					code:"FREE-POSTCARDS", 
					ratio:75
				},
				{
					deg:225, 
					title:"More <br/> Spins", 
					code:"MORE-SPINS", 
					ratio:50
				},
				{
					deg:270, title:"Free <br/> Emoji", 
					code:"FREE-EMOJI", 
					ratio:100
				},
				{
					deg:315, 
					title:"15% <br/> Off", 
					code:"WIN-15-PERCENT-OFF", 
					ratio:25
				}
			],
			win_ratio: [],
			winning_prize:null,
			prize:null,
			credits:3,
			wonCredits:false,
			wheelActive:true,
			wheelPos:0,
			boy:{
				armUp:false,
				jump:"jump-in"
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
				soundLoaded:0,
			},
			modalMessage:[]
		}
	},
	methods: {
		startGame(){
			this.audio.soundLoaded++;
			if(	this.audio.soundLoaded > 4){
				this.gameState = "start"
				this.ready = true

				//this.audio.boing.play()

				setTimeout(() => {
					this.boy.armUp = true
				}, 1500);
			}
		},
		winCredits(){
			let currentCredits = this.credits
			this.wonCredits = true
			this.audio.winCredits.play(); //play sound

			let winInt = setInterval(() => {
				if(this.credits === currentCredits + 3){
					clearInterval(winInt)
					this.wonCredits = false	
				}
				else{
					this.credits++
					console.log(this.credits)
				}
			}, 300)
		},
		shop(){
			window.location = "/collections/all"
		},
		spin(){
			this.credits--
			this.prize = (Math.floor(Math.random() * (1 - this.win_ratio.length)) + this.win_ratio.length) -1
			this.winning_prize = this.win[this.win_ratio[this.prize]]
			//this.winning_prize = this.win[0]
			this.wheelPos = -1 * (3600 + this.winning_prize.deg)
			this.audio.spin5.play(); //play sound
			this.boy.jump = ""
			
			//wheel done spinning
			setTimeout(() => {
				this.gameState = "reset-wheel"
				if(this.winning_prize.code === "MORE-SPINS"){
					this.winCredits()
					this.wheelPos = 0
				}
			}, 5500)

			// prepare wheel to spin again
			setTimeout(() => {
				this.gameState = "start"
			}, 5600)
		
			// show prize
			if(this.winning_prize.code != "MORE-SPINS"){

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
			window.sessionStorage.clear();
			window.location.reload();
		},
		spinAgain(){
			this.gameState = "spin"
			this.wheelActive = true
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
			console.log('send')
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
						this.modalMessage = response.data.customerCreate.userErrors
					}

					if(response.data.customerCreate.customer != null){
						this.addCoupon()
					}
				
				}).fail((error) => {
					console.log(error)
					this.email.sending = false
					this.modalMessage.push("Oopsie Daisy... Something went wrong.")
				});

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

			   this.audio.winCredits = new Howl({
				src: ['https://cdn.shopify.com/s/files/1/0593/5942/8759/files/win-credits.mp3?v=1668536092'],
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



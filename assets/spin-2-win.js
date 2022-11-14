var app = Vue.createApp({

	data() {
		return {
			ready:false,
			gameState:"init",
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
			armUp:false,
			wheelPos:0,
			valid:false,
			modalMessage:[],
			coupon_code:false,
			credits:3,
			wheelActive:true,
			email:'',
			copy :{
				defaultTitle:"Spin 2 Win",
			},
			prize:null,
			deg:null,
			preload:null,
			boing:null,
			spin3:null,
			spin5:null,
			applause:null,
			soundLoaded:0,
		}
	},
	methods: {
		startGame(){
			this.soundLoaded++;
			if(	this.soundLoaded > 3){

				this.gameState = "start"
				this.ready = true
				setTimeout(() => {
					this.armUp = true
				}, 1500);
			}
		},
		spin(){
			this.credits--

			this.prize = (Math.floor(Math.random() * (1 - this.win_ratio.length)) + this.win_ratio.length) -1;
			this.winning_prize = this.win[this.win_ratio[this.prize]];
			this.wheelPos = -1 * (3600 + this.winning_prize.deg);
			this.spin5.play(); //play sound
	
			setTimeout(() => {
				this.gameState = "reset-wheel"
				this.wheelPos = 0

				if(this.winning_prize.code === "MORE-SPINS"){
					this.credits = this.credits + 3
				}
			}, 5500);

			setTimeout(() => {
				this.gameState = "start"
			}, 5600);
		
			if(this.winning_prize.code != "MORE-SPINS"){
				setTimeout(() => {
					this.addCoupon()
					this.applause.play()
					this.gameState = "show-prize"
					this.wheelActive = false
					this.copy.defaultTitle = "You Won"
				
				}, 5750);
			}
		
		},
		addCoupon(){

			this.copy.defaultTitle = "Your Code"
			this.gameState = 'your-code'

			// add coupon to check out
			$.ajax({
				method: "GET",
				url: '/discount/' + this.winning_prize.code
			}).done( (response)  => {
				console.log(response)
			}).fail((error) => {
				console.log(error)
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
		validateEmail(email){
			return String(email)
			.toLowerCase()
			.match(
			  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			)
		},
		resetEmail(){
			this.email = ""
			this.valid = true
		},
		addEmail(){
		
			this.valid = this.validateEmail(this.email)
			if(this.valid){

				$.ajax({
					method: "POST",
					url: this.endPoint,
					data: {'email': this.email, 'note': 'Spin 2 Win'}
				}).done( (response)  => {

					console.log(response)
				
					if(response.data.customerCreate.userErrors.length){
						console.log(response.data.customerCreate.userErrors)
						this.modalMessage = response.data.customerCreate.userErrors
					}

					if(response.data.customerCreate.customer != null){
						console.log(response.data.customerCreate.customer.email)
						this.addCoupon()
					}
				
					
				}).fail((error) => {
					console.log(error)
					this.modalMessage.push("Oopsie Daisy... Something went wrong.")
				});

			}
		},
		init(){
	
			   this.boing = new Howl({
			   src: ['https://cdn.shopify.com/s/files/1/0593/5942/8759/files/boing.mp3?v=1664663096'],
			   preload: true,
			   onload:()=>{
				   console.log('loaded');
				   this.startGame();
			   }
			   });
	
			   this.spin3 = new Howl({
				src: ['https://cdn.shopify.com/s/files/1/0593/5942/8759/files/spin-3.mp3?v=1664663273'],
				preload: true,
				onload:()=>{
					this.startGame();
				}
			   });
	
			   this.spin5 = new Howl({
				src: ['https://cdn.shopify.com/s/files/1/0593/5942/8759/files/spin.mp3?v=1664478860'],
				preload: true,
				onload:()=>{
					this.startGame();
				}
			   });
	
			   this.applause = new Howl({
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
	
			   console.log('init')
			
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



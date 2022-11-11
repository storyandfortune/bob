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
			armUp:false,
			wheelPos:0,
			emailError:false,
			modalMessage:[],
			win_ratio: [],
			coupon_code:false,
			credits:3,
			wheelActive:true,
			email:'',
			copy :{
				defaultTitle:"Spin 2 Win",
				defualttagline:"Spin the wheel for a chance to win!",
				cta:"Enter your e-mail address to collect your prize."
			},
			prize:null,
			winning_prize:null,
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

			//preload image
			this.preload = new Image();
			this.preload.src = this.winning_prize.img;
	
	
			setTimeout(() => {
				this.gameState = "reset-wheel"
				this.wheelPos = 0

				if(this.winning_prize.code === "MORE-SPINS"){
					this.credits = this.credits + 3
				}
			}, 5500);
		
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
			window.sessionStorage.clear();
	
			let data = {
				prize: this.winning_prize,
				viewed:false,
				time: Date.now()
			};
			let value = JSON.stringify(data);
			window.sessionStorage.setItem("coupon", value);
	
		},
		reset(){
			window.sessionStorage.clear();
			window.location.reload();
		},
		spinAgain(){
			this.wheelActive = true
		},
		validateEmail(email){
			return String(email)
			.toLowerCase()
			.match(
			  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			)
		},
		addEmail(){
		
			let valid = this.validateEmail(this.email)

			if(valid){
			// post --------------------------
			  axios.post(this.endPoint, {'email': this.email, 'note': 'Spin 2 Win'})
				.then( (response) => {
					console.log(response)
			
					if(response.data.data.customerCreate.userErrors.length){
						console.log(response.data.data.customerCreate.userErrors)
						this.modalMessage = response.data.data.customerCreate.userErrors
					}

					if(response.data.data.customerCreate.customer != null){
						console.log(response.data.data.customerCreate.customer.email)
						this.addCoupon()
					}

				})
				.catch( (error) => {
					console.log(error)
					this.modalMessage.push(error)
				});

			}
			else{
				this.emailError = true
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
	
			   this.coupon_code = window.sessionStorage.getItem("coupon")

			   console.log('init')
			   
			   /*
			   if(this.coupon_code){
				   
				   let v  = JSON.parse(this.coupon_code);
				   console.log(v);
			   
				   $('.claimed .code').html(v.prize.code);
				   $('.claimed a').attr("href",  $('.claimed a').data("ref") + v.prize.code);
				   $('#title h2').html(v.prize.title +"!");
				   $('#title span').html("You already won! <br/> COUPON CODE: <strong>" +  v.prize.code + "</strong>");
				   $('.spin-btn').addClass('disable');
	
				   $('#box').css("transform", "rotate(-"+v.prize.deg+"deg)");
			   }
	   
			   
			   if(this.testing){
				   let that = this;
				   $('.spin-win .box span').on('click', function(){
					   let d = $(this).data('deg');
					   that.test(d);
				   });
			   }
			   */
	   }
	},
	delimiters: ['${', '}'],
	beforeMount() {
		console.log(window.location.hostname)
		if( window.location.hostname === '127.0.0.1'){
			this.endPoint = "http://dev.api/bobs/customer-connect/"
		}
		console.log(this.endPoint)
	},
	mounted(){
		this.init()
	}

})

app.mount("#app");



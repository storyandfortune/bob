

	let spinToWin = {
		win:[
			{deg:0, title:"Beef Patty", img:"", code:"", ratio:0}, 
			{deg:45, title:"25% Off", img:"https://cdn.shopify.com/s/files/1/0593/5942/8759/files/25-off.png?v=1663635694", code:"WIN25%OFF", ratio:10}, 
			{deg:90, title:"Free Stickers", img:"https://cdn.shopify.com/s/files/1/0593/5942/8759/files/FREE-Stickers.png?v=1663635695", code:"FREESTICKER", ratio:100 },
			{deg:135, title:"20% Off", img:"https://cdn.shopify.com/s/files/1/0593/5942/8759/files/20-off.png?v=1663635695", code:"WIN20%OFF", ratio:5 },
			{deg:180, title:"Free Postcards", img:"https://cdn.shopify.com/s/files/1/0593/5942/8759/files/FREE-Postcards.png?v=1663635697", code:"FREEPOSTCARDS", ratio:100},
			{deg:225, title:"10% Off", img:"https://cdn.shopify.com/s/files/1/0593/5942/8759/files/10-off.png?v=1663635695", code:"WIN10%OFF", ratio:100},
			{deg:270, title:"Free Emoji", img:"https://cdn.shopify.com/s/files/1/0593/5942/8759/files/FREE-Emoji.png?v=1663635695", code:"FREEEMOJI", ratio:100},
			{deg:315, title:"15% Off", img:"https://cdn.shopify.com/s/files/1/0593/5942/8759/files/15-off.png?v=1663635695", code:"WIN15%OFF", ratio:100}
		],
		win_ratio: [],
		coupon_code:null,
		copy :{
			defaultTitle:"Spin to Win",
			defualttagline:"Spin the wheel for a chance to win!",
			cta:"Enter your e-mail address to collect your prize."
		},
		prize:null,
		winning_prize:null,
		deg:null,
		preload:null,
		init(){

				this.win_ratio = [];
				let el = 0;
				this.win.forEach((element) => {
					for(i=0; i<element.ratio; i++){
						this.win_ratio.push(el);
					}
					el++;
				});

				this.coupon_code = window.sessionStorage.getItem("coupon");

				if(this.coupon_code){
					let v  = JSON.parse(this.coupon_code);
					console.log(v);
					$('.claimed .code').html(v.code);
					$('.claimed a').attr("href",  $('.claimed a').data("ref") + v.code);
					$('#title h2').html(v.title +"!");
					$('#title span').html("You already won!");
					$('.spin-btn').hide();

					$('#box').css("transform", "rotate(-"+v.deg+"deg)");
				}

				// make the big boy jump
				$('.gameboy').addClass('jump');
		
				/* bind -------------------------------*/
				$('.spin-win #spin .spin-btn').on('click', () => {
					this.spin();
				});

				$('.spin-win .gameboy').on('click', () => {
					this.reset();
					window.location.reload();
				});
				
			
		},
		spin(){
			this.prize = (Math.floor(Math.random() * (1 - this.win_ratio.length)) + this.win_ratio.length) -1;

			this.winning_prize = this.win[this.win_ratio[this.prize]];
			let x = 5; //min rotation
			let y = 15; // max rotation
	
			this.deg = 360 * (Math.floor(Math.random() * (x - y)) + y) + this.winning_prize.deg;
	
	
			$('#box').css("transform", "rotate(-"+this.deg+"deg)");
	
			//preload image
			this.preload = new Image();
			this.preload.src = this.winning_prize.img;
	
	
			setTimeout(() => {
				$('#title h2').html(this.winning_prize.title +"!");
				$('#title span').html(this.copy.cta);
				$('#win img').attr("src", this.winning_prize.img);
				$('.claimed a').attr("href", $('.claimed a').data("ref") + this.winning_prize.code);
				$('#spin').addClass('shrink');
	
				this.addCoupon();
	
			}, 5500);
	
			
			setTimeout(() => {
				$('#win').addClass('in');
			}, 5750);

		},
		addCoupon(){

			window.sessionStorage.clear();

			let data = {
				title: this.winning_prize.title,
				code:  this.winning_prize.code,
				deg:this.winning_prize.deg,
				time: Date.now()
			};
	
			let value = JSON.stringify(data);
			window.sessionStorage.setItem("coupon", value);

		},
		reset(){
			window.sessionStorage.clear();
		}
	}

	var waitForJQuery = setInterval(function () {
		if (typeof $ != 'undefined') {
			spinToWin.init();
			clearInterval(waitForJQuery);
		}
	}, 10);


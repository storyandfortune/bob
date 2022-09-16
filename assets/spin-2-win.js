

	let win = [
		{deg:0, title:"Beef Patty", img:"", code:"", ratio:0}, 
		{deg:45, title:"25% Off", img:"https://cdn.shopify.com/s/files/1/0593/5942/8759/files/spin2win-25percent.png?v=1663197700", code:"WIN25%OFF", ratio:10}, 
		{deg:90, title:"Free Stickers", img:"https://cdn.shopify.com/s/files/1/0593/5942/8759/files/spin2win-stickers.png?v=1663197700", code:"FREESTICKER", ratio:100 },
		{deg:135, title:"20% Off", img:"https://cdn.shopify.com/s/files/1/0593/5942/8759/files/spin2win-20percent.png?v=1663197699", code:"WIN20%OFF", ratio:5 },
		{deg:180, title:"Free Postcards", img:"https://cdn.shopify.com/s/files/1/0593/5942/8759/files/spin2win-postcards.png?v=1663197699", code:"FREEPOSTCARDS", ratio:100},
		{deg:225, title:"10% Off", img:"https://cdn.shopify.com/s/files/1/0593/5942/8759/files/spin2win-10percent.png?v=1663197699", code:"WIN10%OFF", ratio:100},
		{deg:270, title:"Free Emoji", img:"https://cdn.shopify.com/s/files/1/0593/5942/8759/files/spin2win-emoji.png?v=1663197699", code:"FREEEMOJI", ratio:100},
		{deg:315, title:"15% Off", img:"https://cdn.shopify.com/s/files/1/0593/5942/8759/files/spin2win-15percent.png?v=1663197699", code:"WIN15%OFF", ratio:100}
	];

	let win_ratio = [];
	let el = 0;
	win.forEach((element) => {
		for(i=0; i<element.ratio; i++){
			win_ratio.push(el);
		}
		el++;
	});

	let coupon_code = window.sessionStorage.getItem("coupon");

	if(coupon_code){
		let v  = JSON.parse(coupon_code);
		$('.claimed .code').html(v.code);
		$('.claimed a').attr("href",  $('.claimed a').data("ref") + v.code);
	}

	setTimeout(() => {
		$('.gameboy').addClass('jump');
	}, 750);


let spin = function(){

	let copy = {
		defaultTitle:"Spin to Win",
		defualttagline:"Spin the wheel for a chance to win!",
		cta:"Enter your e-mail address to collect your prize."
	}

	let prize = (Math.floor(Math.random() * (1 - win_ratio.length)) + win_ratio.length) -1;
	console.log(prize);

	let winning_prize = win[win_ratio[prize]];
	let x = 5; //min rotation
	let y = 25; // max rotation

	let deg = 360 * (Math.floor(Math.random() * (x - y)) + y) + winning_prize.deg;

	$('#box').css("transform", "rotate(-"+deg+"deg)");

	setTimeout(() => {
		$('#title h2').html(winning_prize.title +"!");
		$('#title span').html(copy.cta);
		$('#win img').attr("src", winning_prize.img);
		$('.claimed a').attr("href", $('.claimed a').data("ref") + winning_prize.code);
		$('#spin').addClass('shrink');

 		addCoupon();

	}, 5500);

	
	setTimeout(() => {
		$('#win').addClass('in');
	}, 5750);
}

// submit e-mail.
let addCoupon = function(){

	window.sessionStorage.clear();

	let data = {
		title: win[prize].title,
		code:  win[prize].code,
		time: Date.now()
	};

	let value = JSON.stringify(data);
	window.sessionStorage.setItem("coupon", value);
}

// reset game.
let reset = function(){
	window.sessionStorage.clear();
}



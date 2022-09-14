let spin = function(){

	let win = [
		{deg:0, title:"25% Off", img:"", code:"WIN25%OFF"}, 
		{deg:90, title:"20% Off", img:"", code:"WIN20%OFF"},
		{deg:180, title:"10% Off", img:"", code:"WIN10%OFF"},
		{deg:270, title:"15% Off", img:"", code:"WIN15%OFF"},
	];

	let copy = {
		defaultTitle:"Spin to Win",
		defualttagline:"Spin the wheel for a chance to win!",
		cta:"Enter your e-mail address to collect your prize."
	}

	let prize = (Math.floor(Math.random() * (1 - win.length)) + win.length) -1;

	let x = 5; //min rotation
	let y = 25; // max rotation

	let deg = 360 * (Math.floor(Math.random() * (x - y)) + y) + win[prize].deg;

	$('#box').css("transform", "rotate("+deg+"deg)");


	setTimeout(() => {

		$('#title h2').html( win[prize].title +"!");
		$('#title span').html(copy.cta);
		$('#spin').addClass('shrink');
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
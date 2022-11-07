let spinToWin = {
    testing:true,
    win:[
        {deg:0, title:"Beef Patty", img:"", code:"", ratio:0}, 
        {deg:45, title:"25% Off", img:"https://cdn.shopify.com/s/files/1/0593/5942/8759/files/25-off.png?v=1663635694", code:"WIN-25-PERCENT-OFF", ratio:10}, 
        {deg:90, title:"Free Stickers", img:"https://cdn.shopify.com/s/files/1/0593/5942/8759/files/FREE-Stickers.png?v=1663635695", code:"FREE-STICKERS", ratio:100 },
        {deg:135, title:"20% Off", img:"https://cdn.shopify.com/s/files/1/0593/5942/8759/files/20-off.png?v=1663635695", code:"WIN-20-PERCENT-OFF", ratio:5 },
        {deg:180, title:"Free Postcards", img:"https://cdn.shopify.com/s/files/1/0593/5942/8759/files/FREE-Postcards.png?v=1663635697", code:"FREE-POSTCARDS", ratio:100},
        {deg:225, title:"10% Off", img:"https://cdn.shopify.com/s/files/1/0593/5942/8759/files/10-off.png?v=1663635695", code:"WIN-10-PERCENT-OFF", ratio:100},
        {deg:270, title:"Free Emoji", img:"https://cdn.shopify.com/s/files/1/0593/5942/8759/files/FREE-Emoji.png?v=1663635695", code:"FREE-EMOJI", ratio:100},
        {deg:315, title:"15% Off", img:"https://cdn.shopify.com/s/files/1/0593/5942/8759/files/15-off.png?v=1663635695", code:"WIN-15-PERCENT-OFF", ratio:100}
    ],
    win_ratio: [],
    coupon_code:false,
    copy :{
        defaultTitle:"Spin to Win",
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
    startGame(){
        this.soundLoaded++;
        if(	this.soundLoaded > 3){
            //this.boing.play();
            //this.spin3.play();
            //$(".spin-win").trigger("click");
            $('.spin-win').addClass('start');
        }
    },
    spin(){

        this.prize = (Math.floor(Math.random() * (1 - this.win_ratio.length)) + this.win_ratio.length) -1;
        this.winning_prize = this.win[this.win_ratio[this.prize]];

        let x = 5; //min rotation
        let y = 15; // max rotation

        this.deg = 360 * (Math.floor(Math.random() * (x - y)) + y) + this.winning_prize.deg;


        $('#box').css("transform", "rotate(-"+this.deg+"deg)");
        this.spin5.play();

        //preload image
        this.preload = new Image();
        this.preload.src = this.winning_prize.img;


        setTimeout(() => {
            $('#title h2').html(this.winning_prize.title +"!");
            $('#title span').html(this.copy.cta);
            $('#win img').attr("src", this.winning_prize.img);
            $('.claimed a').attr("href", $('.claimed a').data("ref") + this.winning_prize.code);
            $('.game').addClass('shrink');

            this.addCoupon();

        }, 5500);

        
        setTimeout(() => {
            this.applause.play();
            $('.game').addClass('in');
        }, 5750);

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
    test(d){
         this.winning_prize = this.win.find(element => element.deg === d);
         this.addCoupon();

         let link = window.location.protocol + '//' + window.location.hostname + ":" + window.location.port+ "/discount/" +  this.winning_prize.code;
         window.location = link;
    },
    reset(){
        window.sessionStorage.clear();
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

           this.coupon_code = window.sessionStorage.getItem("coupon");

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
   
           /* bind -------------------------------*/
           if(!this.coupon_code){
               $('.spin-win #spin .spin-btn').on('click', () => {
                   this.spin();
               });
           }

           $('.spin-win .gameboy').on('click', () => {
               this.reset();
               window.location.reload();
           });

           if(this.testing){
               let that = this;
               $('.spin-win .box span').on('click', function(){
                   let d = $(this).data('deg');
                   that.test(d);
               });
           }
   },
}

var waitForJQuery = setInterval(function () {
    if (typeof $ != 'undefined') {
        spinToWin.init();
        clearInterval(waitForJQuery);
    }
}, 10);
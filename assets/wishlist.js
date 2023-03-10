$(document).ready(function () {

        let wl = {
            hasUser:{},
            user:{
                userId:null,
                email:null,
                fname:false,
                lname:false,
                list:[]
            },
            endPoint:"https://api.storyandfortune.com/bobs/wishlist/",
            email:{
                address:'something',
                valid:true,
                sending:false,
                message:'Enter your e-mail address to activate & save your wishlist.',
                errorMessage:'Enter a vailid e-mail address.'
            },
            reset(){
                $('.wishlist').removeClass('isActive');
                $('#emailAddress').val('');
            },
            resetAll(){
                this.deleteCookie();
                $('.wishlist').removeClass('isActive');
                $('#emailAddress').val('');
                $('ul.productList').html('');
            },
            validateEmail(val){
                console.log(val)
                return String(val)
                .toLowerCase()
                .match(
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                );
            },
            resetEmail(){
                $('#emailAddress').val('');
                this.email.address = "";
                this.email.valid = true;
            },
            getUser(){

                this.email.address = $('#emailAddress').val();
    
                this.email.valid = this.validateEmail(this.email.address);

                console.log('address: ' + this.email.address);
                console.log('valid: ' + this.email.valid);
                console.log('endpoint: ' + this.endPoint +'activate/');
    
              
                if(this.email.valid){
                    console.log('connecting to API');
                    this.email.sending = true;
                    $('#wish-list-drawer #wish-list-header').addClass('isSending');

                    
                    let dataObj = {
                        'email': this.email.address, 
                        'tags': '"wishlist"'
                    }
    
                    
                    $.ajax({
                        method: "POST",
                        url: this.endPoint +'activate/',
                        data: dataObj
                    }).done( (response)  => {

                        console.log(response);

                        if(response.status){

                            this.email.sending = false

                            //update user object
                            this.user.userId = response.data.id;
                            this.user.email = response.data.email;
                            this.user.fname = response.data.firstName;
                            this.user.lname = response.data.lastName;
                            this.user.list = response.data.metafield.value.split(',');
    
                            //save cookie
                            this.setCookie();
    
                            //update interface
                            $('.account').html(this.user.email);
                            $('#wish-list-drawer #wish-list-header').removeClass('isSending');
                            $('#wish-list-drawer').addClass('isActive');
                            this.listItems(this.user.list);

    
                        }
                        else{
                            alert('error');
                        }

                
                    }).fail((error) => {
                        console.log(error)
                        this.email.sending = false
                        $('#wish-list-drawer #wish-list-header').removeClass('isSending');
                    });
    
                }
                else{
                    console.log('error');
                    $('#wish-list-drawer #wish-list-header').addClass('error');
                    $('#wish-list-drawer #wish-list-header p').html(this.email.errorMessage);
                }
              
            },
            error(){},
            onKeyDown(){
                $('#wish-list-drawer #wish-list-header').removeClass('error');
                $('#wish-list-drawer #wish-list-header p').html(this.email.message);
            },
            getCookie(){
              let c = window.localStorage.getItem('bobsWishList')
              if(c){
                return {user: true, data: JSON.parse(c)};
              }
              else{
                return {user: false, data: null};
              }
            },
            setCookie(){
                let val = JSON.stringify(this.user);
                window.localStorage.setItem("bobsWishList", val)
            },
            deleteCookie(){
                window.localStorage.removeItem('bobsWishList')
            },
            addItem(item){
                console.log('add item');
                this.user.list.push(item);
                console.log(this.user.list);
                this.listItems(this.user.list);  
                this.setCookie();

                var request = $.ajax({
                    method: "POST",
                    url: this.endPoint +'update/',
                    data: {id:this.user.userId, list: JSON.stringify(this.user.list)},
                    dataType: "json"
                });

                request.done(function( json ) {
                    console.log('update metadata');
                    console.log(json);
                });

                request.fail(function( jqXHR, textStatus ) {
                    console.log( "Request failed: " + textStatus );
                });

            },
            removeItem(item){},
            listItems(items){

                //let obj = {"title":"", "handle":"", "img":"", "price":""};

                let hydrateLi = function(handle){

                    var productURL = document.location.origin + '/products/'+ handle +'.json';

                    var request = $.ajax({
                        url: productURL,
                        method: "GET",
                        dataType: "json"
                    });

                    request.done(function( json ) {
                        console.log('hydrate product');
                        console.log(json)
                        var html = `<div class="remove">x</div>
                                    <a class="appened-product" href="`+document.location.origin +`/products/`+   json.product.handle + `" />
                                        <div class="appened-image" style="background-image: url(` + json.product.image.src  + `) "></div>
                                        <div class="title">` + json.product.title + `</div>
                                    </a>`;

                        $('#product_'+ handle).html(html);
                        $('#product_'+ handle).addClass('hydrated'); 
                        console.log( $('#product_'+ handle) );
                    });

                    request.fail(function( jqXHR, textStatus ) {
                        console.log( "Request failed: " + textStatus );
                    });
                }

                // list items --------------------------------------------------------
                $('ul.product-list').html(''); 
                for(i=0; i<items.length; i++){

                    let li = `<li id="product_`+ items[i] +`"></li>`;

                    $('ul.product-list').append(li); 
                    hydrateLi(items[i]);

                }
              
            },
            init(){

                //this.resetAll();

                 window.addEventListener(
                    "wishlistAddItem",
                    (e) => {
                      console.log('add to wishlist event');
                      console.log(e.detail);
                      this.addItem(e.detail)
                    },
                    false
                );

                console.log('wishlist ready');

                this.ready = true;
                $('#wish-list-drawer #wish-list-header p').html(this.email.message);
                if( window.location.hostname === '127.0.0.1'){
                    this.endPoint = "http://dev.api/bobs/wishlist/"
                }
                //check for local object
                this.hasUser = this.getCookie();
                console.log(this.hasUser);

                if(this.hasUser.user){
                    //show whislist
                    this.user = this.hasUser.data;
                    console.log(this.user);

                    $('#wish-list-drawer').addClass('isActive');
                    $('.account').html(this.user.email);
                    this.listItems(this.user.list);  
                }              
                //bind ------------------------------------------

                //close btn
                $('#wish-list-drawer #wish-list-header .close').on('touchstart click',  () => {
                    $('#wish-list-drawer').removeClass('on');
                });

                //email btn
                $('#wish-list-drawer #wish-list-header .e-mail-input button').on('touchstart click',  () => {
                    this.getUser();
                });

                //input on keydown
                $('#wish-list-drawer #wish-list-header .e-mail-input input').on('keydown',  () => {
                    this.onKeyDown();
                });

                // remove item from wishlist

            }
        };

        wl.init();

});

/*
const wishlistApp = Vue.createApp({
    data() {
        return {
            ready:false, 
            active:false,
            user:{
                userId:null,
                email:null,
                fname:false,
                lname:false,
                list:[]
            },
            endPoint:"https://api.storyandfortune.com/bobs/wishlist/",
            email:{
                address:'something',
                valid:true,
                sending:false
            },
            date:null,
            modalMessage:{display:false, content:[]}
        }
    },
    methods: {
        reset(){
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
            console.log(this.email.address)
            console.log(this.email.valid)

          
            if(this.email.valid){

                this.email.sending = true

                let dataObj = {
                    'email': this.email.address, 
                    'tags': '"wishlist"',
                    'meta': {'key':wishlist, 'value':this.user.list}
                }

                
                $.ajax({
                    method: "POST",
                    url: this.endPoint +'activate/',
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
        error(){},
        getCookie(){
          return window.localStorage.getItem('bobsWishList')
        },
        setCookie(){
            let val = JSON.strigify(this.user);
            window.localStorage.setItem("bobsWishList", val)
        },
        deleteCookie(){
            window.localStorage.removeItem('bobsWishList')
        },
        addItem(item){},
        removeItem(item){},
        getUser(){},
        init(){
            this.ready = true;
            console.log(this.email)
            console.log('start wishlist')
        }
    },
    delimiters: ['${', '}'],
    beforeMount(){
        this.ready = true;
        if( window.location.hostname === '127.0.0.1'){
            this.endPoint = "http://dev.api/bobs/wishlist/"
        }
    },
    mounted(){
        this.init()
 
    }
})

wishlistApp.mount("#wishlistApp");

*/
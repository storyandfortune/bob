$(document).ready(function () {

        let wl = {
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
            reset(){
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
            addItem(item){
                this.user.list.push(item);
                this.listItems(this.user.list);  
            },
            removeItem(item){},
            listItems(items){
                let obj = {"title":"", "handle":"", "img":"", "price":""};

                let hydrateLi = function(title, image, handle){
                    var productURL = document.location.origin + '/collections/all/products/'+ handle +'.json';
                    var request = $.ajax({
                        url: productURL,
                        method: "GET",
                        dataType: "json"
                    });

                    request.done(function( json ) {
                        console.log('hydrate product');
                        var html = `<div class="remove"></div>
                                    <a class="appened-product" href="`+document.location.origin +`/products/`+  + handle + `" />
                                        <div class="appened-image" style="background-image: url(` + image  + `) "></div>
                                        <div class="title">` + title + `</div>
                                    </a>`;

                        $('#product_'+handle).html(li);
                        $('#product_'+handle).addClass('hydrated'); 
                    });

                    request.fail(function( jqXHR, textStatus ) {
                        console.log( "Request failed: " + textStatus );
                    });
                }

                // list items
                for(i=0; i<items.length; i++){
                    var li = `<li id="product_`+handle+`" ></li>`;
                    $('ul.productList').append(li); 
                    hydrateLi(items[i].title, items[i].images[0].src, items[i].handle);
                }
              
                

            },
            init(){
                console.log('wishlist ready');

                //check for local object
                this.user = this.getCookie();
                if(this.user){
                    //show whislist
                    $('.wishlist').addClass('isActive');
                    $('.account').html(this.user.email);
                    this.listItems(this.user.list);  
                }              
                else{
                  //show email input
                }
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
$(document).ready(function () {
        let wl = {
            hasUser:{},
            user:{
                userId:null,
                email:null,
                fname:false,
                lname:false,
                list:0
            },
            endPoint:"https://api.storyandfortune.com/bobs/wishlist/",
            closeSVG:'<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="times" class="svg-inline--fa fa-times fa-w-11" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512"><path fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path></svg>',
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
                        'list': JSON.stringify(this.user.list),
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
                            this.user.list = JSON.parse(response.data.metafield.value);
    
                            console.log(this.user);
                            
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
            addItem(obj){

                console.log('add item:');
                console.log(obj);
                
                this.user.list.hasList = true;
                this.user.list.items.push(obj);

                let post = {"id": this.user.userId, "list": JSON.stringify(this.user.list)};
                console.log(post);

                var request = $.ajax({
                    method: "POST",
                    url: this.endPoint +'update/',
                    data: post,
                    dataType: "json"
                });

                request.done(( json ) =>{
                    console.log('update metadata');
                    console.log(json);
                    console.log(this.user.list);
                  
                    $('#noItems').remove();

                    this.addElement(obj);
                    this.setCookie();
             
                });

                request.fail(( jqXHR, textStatus ) =>{
                    console.log(jqXHR);
                    console.log( "Request failed: " + textStatus );
                });
                
               

            },
            removeItem(handle, id){
       
                // remove element
                $("#"+id).remove();

                // find obj index
                let index = this.user.list.items.findIndex(item => item.handle == handle);

                // remove obj from array
                this.user.list.items.splice(index, 1);
                console.log(this.user.list);


                // update metefield
                let post = {"id": this.user.userId, "list": JSON.stringify(this.user.list)};
                console.log(post);

                var request = $.ajax({
                    method: "POST",
                    url: this.endPoint +'update/',
                    data: post,
                    dataType: "json"
                });

                request.done(( json ) =>{
                    console.log('update metadata');
                    console.log(json);
             
                    this.setCookie();
                });

                request.fail(( jqXHR, textStatus ) =>{
                    console.log(jqXHR);
                    console.log( "Request failed: " + textStatus );
                });
                
            },
            addElement(obj){
                let li = `<li id="product_`+ obj.handle + "-" + obj.variant + `" data-handle="`+obj.handle+`" ></li>`;
                $('ul.product-list').prepend(li);
                this.hydrateElement(obj);
            },
            hydrateElement(obj){
                let productURL = document.location.origin + '/products/'+obj.handle+'.json';

                let request = $.ajax({
                    url: productURL,
                    method: "GET",
                    dataType: "json"
                });

                request.done(( json ) => {
                    console.log('hydrate product');
                    console.log(json) 
                    let id = '#product_'+ obj.handle +'-'+obj.variant;

                    var html = `<div class="remove">` + this.closeSVG + `</div>
                                <div class="appened-product">
                                    <a href="`+document.location.origin +`/products/`+   json.product.handle + `" >
                                        <div class="appened-image" style="background-image: url(` + json.product.image.src  + `) "></div>
                                        <div class="title">` + json.product.title + `</div>
                                    </a>
                                    <product-form class="product-form">
                                        <form method="post" action="/cart/add" id="product-form-template--16700077998321__main" accept-charset="UTF-8" class="form" enctype="multipart/form-data" novalidate="novalidate" data-type="add-to-cart-form">
                                            <input type="hidden" name="form_type" value="product">
                                            <input type="hidden" name="utf8" value="✓">
                                            <input type="hidden" name="id" value="`+obj.variant+`">

                                            <div class="product-form__buttons" style="display: block !important;">
                                                <button type="submit" name="add" class="product-form__submit button button--full-width button--primary">Add to cart</div>
                                            </div>

                                        </form>
                                    </product-form>
                                </div>`;

                    $(id).html(html);
                    $().addClass('hydrated'); 
                });

                request.fail(( jqXHR, textStatus ) => {
                    console.log( "Request failed: " + textStatus );
                });
            },
            listItems(list){
                // list items --------------------------------------------------------
                $('ul.product-list').html(''); 
                let noitems = '<li id="noItems">Add some items to your Wishlist.</li>';

                if(list.hasList){
                    for(i=0; i<list.items.length; i++){
                        this.addElement(list.items[i]);
                    }
                }
                
                else{
                   $('ul.product-list').html(noitems); 
                }
            },
            addItemtoCart(variant){

                fetch("/cart/add.json", {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json'
                },
                    body: 'items:'+ JSON.stringify('[ { id: '+variant+', quantity: 1 } ]')
                }).then(response => response.json())
                .then(data => processCartAdd(data))
                .catch(error => console.error('Unable to add to cart.', error));

            },
            init(){

                //this.resetAll();

                 window.addEventListener(
                    "wishlistAddItem",
                    (e) => {
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
                
                
                // bind ----------------------------------------------

                // remove btn
                $('.wish-list').on('touchstart click', '.product-list li .remove',  (event) => {
                   let handle = $(event.target).parents('li').data('handle');
                   let id = $(event.target).parents('li').attr('id');
                   this.removeItem(handle, id);
                });

                 // add to cart from wishlist btn
                 $('.wish-list').on('touchstart click', '.product-list li .add_wishlist_btn',  (event) => {
                    let variant = $(event.target).data('variant');
                    this.addItemtoCart(variant);
                 });

                // close btn
                $('#wish-list-drawer #wish-list-header .close').on('touchstart click',  () => {
                    $('#wish-list-drawer').removeClass('on');
                });

                // email btn
                $('#wish-list-drawer #wish-list-header .e-mail-input button').on('touchstart click',  () => {
                    this.getUser();
                });

                // input on keydown
                $('#wish-list-drawer #wish-list-header .e-mail-input input').on('keydown',  () => {
                    this.onKeyDown();
                });

                // end bind ------------------------------------------


            }
        };

        wl.init();

});
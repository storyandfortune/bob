$(document).ready(() => {
    
    console.log('subscribe pop up');

    let popUp = {
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
        
            if(this.email.valid){
        
                this.email.sending = true
        
                let dataObj = {
                    'fname':this.firstName,
                    'lname':this.lastName,
                    'email': this.email.address
                }
        
                $.ajax({
                    method: "POST",
                    url: this.endPoint,
                    data: dataObj
                }).done( (response)  => {
        
                    console.log(response)
                    this.email.sending = false
                    this.sent = true
        
        
                }).fail((error) => {
                    console.log(error)
                    this.email.sending = false
                });
        
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
        refreshCookie(){

        },
        bind(){
            $("#some-id").on('click',  (e) => {
                console.log('do something');
            });
        },
        init(){
            setTimeout(() => {
                console.log('pop up this motherfucker up!');
            },10000);
        }
    }

    // start me up!
    popUp.init();

});
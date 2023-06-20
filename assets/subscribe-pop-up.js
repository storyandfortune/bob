document.addEventListener('DOMContentLoaded',  () => {

    console.log('ready subscribe pop up');

    let popUp = {
        endPoint:"https://api.storyandfortune.com/bobs/email/",
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
                    'email': this.email.address,
                    'tag':'Beach-Boys, Pop-Up'
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
          let c = window.localStorage.getItem('bobsPopUp')
          if(c){
            return true
          }
          else{
            return false
          }
        },
        setCookie(){
            window.localStorage.setItem("bobsPopUp", true)
        },
        deleteCookie(){
            window.localStorage.removeItem('bobsPopUp')
        },
        refreshCookie(){
            this.deleteCookie()
            this.setCookie()
        },
        bind(){

            // close button --------
            $(".pop-up-container .close").on('click',  (e) => {
                $('.pop-up-container').removeClass('animate__zoomIn').addClass('animate__zoomOut');
                setTimeout(() => {
                    $('.pop-up-container').removeClass('show');
                },500); 
            });
      
        },
        init(){

            //this.deleteCookie();

            console.log(this.getCookie());

            if(this.getCookie()){
                this.refreshCookie();
            }
            else{

                console.log(this.email);

                this.setCookie();
                this.bind();
         
                //launch pop-up
                setTimeout(() => {
                    $('.pop-up-container').addClass('show');
                    $('.form-container').addClass('animate__animated animate__zoomIn');
                },5000); 
            }

        }
    };

    // start me up!
    popUp.init();

  }, false);
document.addEventListener('DOMContentLoaded',  () => {

    let popUp = {
        endPoint:"https://api.storyandfortune.com/bobs/social/",
        email:{
            address:'something',
            valid:true,
            sending:false,
            errorMessage:'Enter a vailid e-mail address.'
        },
        reset(){
            $('#email').val('');
            $('#firstName').val('');
            $('#lastName').val('');
        },
        resetAll(){
            this.deleteCookie();
            this.reset();
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
            else{
                $('.pop-up-container .input').addClass('error');
            }
        
        },
        onKeyDown(){
            $('.pop-up-container .input').removeClass('error');
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
                $('.pop-up-container').removeClass('animate__animated animate__zoomIn').addClass('animate__animated animate__zoomOut');
                setTimeout(() => {
                    $('.pop-up-container').removeClass('show');
                },500); 
            });

            // submit button ---------
            $(".pop-up-container .submit_btn").on('click',  (e) => {
               this.addEmail();
            });

            // key down
            $(".pop-up-container inut").on('keydown',  (e) => {
                this.onKeyDown();
             });

      
        }, 
        init(){

            this.deleteCookie();

            console.log("cookie: " + this.getCookie());

            if(this.getCookie()){
                this.refreshCookie();
            }
            else{

                console.log(this.email);

                //this.setCookie();
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
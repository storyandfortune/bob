document.addEventListener('DOMContentLoaded',  () => {

    let popUp = {
        endPoint:"https://api.storyandfortune.com/bobs/social/",
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
            $('.form').removeClass('sending').addClass('sent');
        },
        addEmail(){

            let email = $('#email').val();
            let valid = this.validateEmail(email);
        
            if(valid){
        
                $('.pop-up-container .form').addClass('sending');
        
                let dataObj = {
                    'fname':$('#firstName').val(),
                    'lname':$('#lastName').val(),
                    'email': $('#email').val(),
                    'tag':'Beach-Boys, Pop-Up'
                }
        
                $.ajax({
                    method: "POST",
                    url: this.endPoint,
                    data: dataObj
                }).done( (response)  => {

                    console.log(response)
                    $('.pop-up-container .form').removeClass('sending').addClass('sent');
                    $('pop-up-btn').removeClass('on');

                }).fail((error) => {

                    console.log(error)
                    $('.pop-up-container .form').removeClass('sending').addClass('opps');

                });
        
            }
            else{
                $('.pop-up-container .form').addClass('error');
            }
        
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
        landing(){
            console.log('landing');
            $('.pop-up-btn').remove();
            $('.pop-up-container .close').remove();
            $('.pop-up-container').addClass('show');
        },
        popUp(){
            console.log('pop up');
            console.log(this.getCookie());
            if(this.getCookie()){
                this.refreshCookie();
            }
            else{
                this.setCookie();
                $('.pop-up-btn').addClass('on');
            }
        },
        bind(){

            // open button --------
            $(".pop-up-btn").on('click',  (e) => {
                $('.pop-up-container').addClass('show');
                $('.form-container').addClass('animate__animated animate__zoomIn');
                $(".pop-up-btn").removeClass('on');
             });


            // close button --------
            $(".pop-up-container .close").on('click',  (e) => {
                $('.form-container').removeClass('animate__animated animate__zoomIn').addClass('animate__animated animate__zoomOut');
                setTimeout(() => {
                    $('.pop-up-container').removeClass('show');
                    $('.form-container').removeClass('animate__animated animate__zoomOut');
                    $(".pop-up-btn").addClass('on');
                },500); 
            });

            // submit button ---------
            $(".pop-up-container .submit_btn").on('click',  (e) => {
               this.addEmail();
            });

            // key down ------
            $(".pop-up-container input").on('keydown',  (e) => {
                $('.pop-up-container .form').removeClass('error');
             });
      
        }, 
        init(){
    

            // set local endpoint
            let host = window.location.hostname.indexOf('bobs');
            if(host < 0){
                this.endPoint = "http://dev.api/bobs/social/";
            }
          

            let path = window.location.pathname.indexOf('social');
            this.bind();

            if(path >= 0){
                this.landing();
            }
            else{
                this.popUp();
            }
        }
    };

    // start me up!
    popUp.init();

  }, false);
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
        
            let valid = this.validateEmail(this.email.address)
        
            if(valid){
        
                $('.form').addClass('sending');
        
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
                    $('.form').removeClass('sending').addClass('sent');
                    $('pop-up-btn').removeClass('on');

                }).fail((error) => {

                    console.log(error)
                    $('.form').removeClass('sending').addClass('opps');

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
            $(".pop-up-container inut").on('keydown',  (e) => {
                this.onKeyDown();
             });
      
        }, 
        init(){

            //this.deleteCookie();

            console.log("cookie: " + this.getCookie());

            if(this.getCookie()){
                this.refreshCookie();
            }
            else{
                //this.setCookie();
                $('.pop-up-btn').addClass('on');
                this.bind();
            }

        }
    };

    // start me up!
    popUp.init();

  }, false);
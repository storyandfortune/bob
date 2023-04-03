
 // Enable pusher logging - don't include this in production -------------------------------------------------

 const app = Vue.createApp({

	data() {
		return {
			ready:false,
            endpoint:"https://api.storyandfortune.com/social/",
            firstName:"",
            lastName:"",
			email:{
				address:'',
				valid:true,
				sending:false
			},
			date:null
		}
	},
	methods: {
		returnDate(){
			return "Valid on " + moment().format('MMM Do')
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

			if(this.email.valid){

				this.email.sending = true
				let dataObj = {
                    'firstName':this.firstName,
                    'lastName':this.lastName,
					'email': this.email.address, 
					'tags': '"soscial-landing"',
				}

				$.ajax({
					method: "POST",
					url: this.endPoint,
					data: dataObj
				}).done( (response)  => {

					console.log(response)
					this.email.sending = false

					if(response.status){
						this.playGame()
					}
					else{
						this.modalMessage.display = true 
						this.modalMessage.content = response.data.userErrors
						this.audio.loose.play(); //play sound
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
		init(){
			this.ready = true
	   }
	},
	delimiters: ['${', '}'],
	beforeMount() {
		if( window.location.hostname === '127.0.0.1'){
			this.endPoint = "http://dev.api/bobs/social/"
		}
		this.date =  this.returnDate()
	},
	mounted(){
		this.init()
	}
})

app.mount("#app");



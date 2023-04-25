
 // Enable pusher logging - don't include this in production -------------------------------------------------

 const app = Vue.createApp({

	data() {
		return {
			ready:false,
            endpoint:"https://api.storyandfortune.com/bobs/social/",
            firstName:"",
            lastName:"",
			email:{
				address:'',
				valid:true,
				sending:false
			}
		}
	},
	methods: {
		newMethod(){},
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


				}).fail((error) => {
					console.log(error)
					this.email.sending = false
				});

			}

		},
		init(){
			console.log(this.email.sending)
			this.ready = true
	   }
	},
	delimiters: ['${', '}'],
	beforeMount() {
		if( window.location.hostname === '127.0.0.1'){
			this.endPoint = "http://dev.api/bobs/social/"
		}
	},
	mounted(){
		this.init()
	}
})

app.mount("#app");



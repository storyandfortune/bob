

const app = Vue.createApp({

	data() {
		return {
			ready:false,
            endPoint:"https://api.storyandfortune.com/bobs/",
			showModal:false,
            firstName:"",
            lastName:"",
			subscribe:true,
			formState:{
				verify :false,
				form:true,
				thanks:false,
				error:false,
				message:'This is the message.'
			},
			email:{
				address:'',
				valid:true,
				sending:false
			}
		}
	},
	methods: {
		resetFormState(){
			this.formState.verify = false;
			this.formState.form = false;
			this.formState.thanks = false;
			this.formState.error = false;
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

				this.email.sending = true

				let dataObj = {
                    'fname':this.firstName,
                    'lname':this.lastName,
					'email': this.email.address,
					'subscribe':this.subscribe,
					'tag':'75th-anniversary'
				}

				$.ajax({
					method: "POST",
					url: this.endPoint + 'social/',
					data: dataObj
				}).done( (response)  => {
					console.log(response)
					this.email.sending = false
					this.formState.message = response.message
					this.resetFormState()
					this.formState.thanks = true
				}).fail((error) => {
					console.log(error)
					this.email.sending = false
					this.resetFormState()
					this.formState.error = true
				});

		

		},
		verifyEmail(){


			this.email.valid = this.validateEmail(this.email.address)

			if(this.email.valid){

			this.email.sending = true
			let dataObj = {
				'fname':this.firstName,
				'lname':this.lastName,
				'email': this.email.address,
				'subscribe':this.subscribe.toString()
			}
			$.ajax({
				method: "POST",
				url: this.endPoint + "verify/add/",
				data: dataObj
			}).done( (response)  => {
				console.log(response)
				this.email.sending = false
				this.formState.message = response.message

				if(response.status === true && response.newUser === true){
					this.resetFormState()
					setTimeout(() => {	this.formState.verify = true}, 1000)
				
				}
				else if(response.status === true && response.newUser === false){
					this.resetFormState()
					this.formState.thanks = true
				}
				else{
					this.resetFormState()
					this.formState.error = true
				}

			}).fail((error) => {
				console.log(error)
				this.email.sending = false
				this.formState.message = error
				this.resetFormState()
				this.formState.error = true
			});
		}
		},
		checkVerify(id){
			let dataObj = {
				'id':id
			}
			this.email.sending = true
			$.ajax({
				method: "POST",
				url: this.endPoint + "verify/check/",
				data: dataObj
			}).done( (response)  => {

				console.log(response)

				this.email.address = response.data.fields[0].value
				this.firstName = response.data.fields[1].value
				this.lastName = response.data.fields[2].value
				this.subscribe = response.data.fields[3].value
				this.formState.message = response.data.message

				if(response.status){
					this.addEmail()
				}
			}).fail((error) => {
				console.log(error)
				this.email.sending = false
				this.resetFormState()
			    this.formState.error = true
			});
		},
		updateQR(){

				let dataObj = {
					'qrscan':'75th-anniversary'
				}

				/**/
				$.ajax({
					method: "POST",
					url: this.endPoint + "qr/",
					data: dataObj
				}).done( (response)  => {

					console.log(response)
					this.email.sending = false
					this.sent = true


				}).fail((error) => {
					console.log(error)
					this.email.sending = false
				});
		},
		init(){
			
			const queryString = window.location.search;
	
			if(queryString === "?qr=true"){
				this.updateQR()
			}

			console.log();
			if(queryString.substring(0, 7) === "?verify"){
			   let id = queryString.slice(8);
			   this.email.sent = true;
			   this.checkVerify(id)
			}

			
			this.ready = true
	   }
	},
	delimiters: ['${', '}'],
	beforeMount() {
		if( window.location.hostname === '127.0.0.1'){
			this.endPoint = "http://dev.api/bobs/"
		}
	},
	mounted(){
		console.log('init 75th')
		this.init()
	}
})

app.mount("#app");



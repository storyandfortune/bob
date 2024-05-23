

const app = Vue.createApp({

	data() {
		return {
			ready:false,
            endPoint:"https://api.storyandfortune.com/bobs/",
			live:true,
			showModal:false,
            firstName:"",
            lastName:"",
            addressOne:"",
            addressTwo:"",
            city:"",
            state:"",
            zip:"",
			sent:false,
			email:{
				address:'',
				valid:true,
				sending:false
			}
		}
	},
	methods: {
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
					'tag':'75th-anniversary'
				}

				$.ajax({
					method: "POST",
					url: this.endPoint + 'social/',
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
		updateQR(){
			const queryString = window.location.search;
			if( queryString === "?qr=true"){
				console.log(queryString);
				console.log("update QR");


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
		

			}
		},
		toggleModal(){
			this.showModal = !this.showModal
		},
		init(){
			this.sent = false;
			this.ready = true
			this.updateQR()
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



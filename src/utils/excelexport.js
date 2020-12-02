export default{

   exportExcel:(url,params)=> {

	window.location.href =
		url +'?'+
		params +
		"&token=" +
		window.localStorage.getItem("token") +
		"";


 }

}
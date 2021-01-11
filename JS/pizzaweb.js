/**
 * @author Johnny Tsheke
 */
/*
 * La fonction suivante vérifie qu'au moins une checkbox de nom taille est cochée
 */
function validPizzaForm(){
	n=$("input[name=taille]:checked").length;
	if(n<1){
		alert("Précisez la taille de la pizza svp");
		return(false); //ceci empêche que le formulaire ne soit soumis
	}	
}
$(document).ready(function(){

	$(":submit").eq(0).click(function(){ 
		return validPizzaForm();
	});
});
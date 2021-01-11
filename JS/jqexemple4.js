/**
 * @author Johnny Tsheke
 */
$(document).ready(function(){
	$("p").click(function(){
	$("p").each(function(index){
		if(index==0){
			$(this).html("Acces par balise -Tag- avec jQuery");
		}});	
	});
});

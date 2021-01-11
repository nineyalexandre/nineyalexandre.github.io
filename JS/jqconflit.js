/**
 * @author Johnny Tsheke
 * Charger ce code juste après jQuery si crainte conflits avec $
 */
$jq=jQuery.noConflict();//nouveau prefix jQuery
$jq( document ).ready(function( $ ) {
// Code jQuery avec alias $jq
$jq("h1").css("color","red"); 
});
// Code autre libraries avec alias $ 
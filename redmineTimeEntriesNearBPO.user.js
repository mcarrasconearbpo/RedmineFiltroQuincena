// ==UserScript==
// @name        Redmine - Tiempo dedicado por quincena
// @namespace   nearbpo.com
// @description Agrega la opción de filtrar por quincena actual
// @include     http://redmine.nearbpo.com/time_entries*
// @require     http://code.jquery.com/jquery-1.10.1.min.js
// @grant       none
// @version     1
// ==/UserScript==

// Como redmine usa prototype para evitar conflictos hacemos:
var $j = jQuery.noConflict();

$j(document).ready(function() {
    $j("#period").append('<option value="quincena_actual">quincena actual</option>');
    $j("#period").append('<option value="quincena_actual_informe">quincena actual (informe de horas)</option>');

    $j("#period").change(function() {
        var selectedValue=$j("#period option:selected").val();
        
        // Si el valor seleccionado empieza con la cadena "quincena_actual"
        if((/^quincena_actual/).test(selectedValue)){
        
            var today = new Date();
            var rango = getRangoQuincena(today);
            
            var rangeParams = "from="+rango.from.toLocaleFormat( " %Y-%m-%d" )+"&to="+rango.to.toLocaleFormat( " %Y-%m-%d" );
                        
            if(selectedValue=="quincena_actual_informe"){
                newUrl = "/time_entries/report?period_type=2&"+rangeParams+"&columns=day&criteria[]=member";
            } else {
                newUrl = "/time_entries?period_type=2&from="+rangeParams;
            }
            
            window.location.href = newUrl;
        }
        
    });
    
    function getRangoQuincena(date){
        var from = new Date(date), to = new Date(date);            
        if(date.getDate()<16){
            from.setDate(1);
            to.setDate(15);
        } else {
            from.setDate(16);
            to.setMonth(to.getMonth()+1);
                
            // el día 0 es el ultimo día del mes 
            // anterior a la fecha en ECMAScript
            to.setDate(0);
        }
        
        return {"from":from, "to": to};
    }
    
});
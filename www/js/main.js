var diaActual = null;
var eventoId = null;
var nameDia = new Array(9);
nameDia[10] = 'Sábado';
nameDia[11] = 'Domingo';
nameDia[12] = 'Lunes';
nameDia[13] = 'Martes';
nameDia[14] = 'Miércoles';
nameDia[15] = 'Jueves';
nameDia[16] = 'Viernes';
nameDia[17] = 'Sábado';
nameDia[18] = 'Domingo';


/* PAGE: PROGRAMACION */
$('#programacion').on('pagecreate', function(){
	$.mobile.loading( "show" );
	$.ajax({
		url: 'http://api.maanjustudio.com/eventos',
		dataType: "jsonp",
		async: true,
		success: function (result) {
			ajaxEventos.parseJSONP(result);
		},
		error: function (request,error) {
			alert('Network error has occurred please try again!');
		}
	});         
});

var ajaxEventos = {  
	parseJSONP:function(result){  
		$.each(result.eventos, function(i, row) {
			if (diaActual == row.dia_evento) {
				$('#event-list').append('<li><a href="" data-id="' + row.id + '" data-transition="slide"><h2>' + row.post_title +'</h2><p>Lugar: ' + row.nombre_lugar + '</p><p class="ui-li-aside"><strong>'+ row.hora +'</strong></p></a></li>');
			} else {
				diaActual = row.dia_evento;
				$('#event-list').append('<li data-role="list-divider">'+row.dia_evento+' de Octubre, '+ nameDia[row.dia_evento] +'</li>');
				$('#event-list').append('<li><a href="" data-id="' + row.id + '" data-transition="slide"><h2>' + row.post_title +'</h2><p>Lugar: ' + row.nombre_lugar + '</p><p class="ui-li-aside"><strong>'+ row.hora +'</strong></p></a></li>');
			}
		});
		
		$('#event-list').listview('refresh');
	}
}

$(document).on('vclick', '#event-list li a', function(){ 
	eventoId = $(this).attr('data-id');
	console.log(eventoId);
	$.mobile.changePage( "#evento", { transition: "slide" });    
});

/* PAGE: EVENTO */
$('#evento').on('pagebeforeshow', function(){
	$.mobile.loading( "show" );
	$('#evento-data').empty();
	$('#evento h1').empty();

	$.ajax({
		url: 'http://api.maanjustudio.com/evento/'+eventoId,
		dataType: "jsonp",
		async: true,
		success: function (result) {
			ajaxEvento.parseJSONP(result);
		},
		error: function (request,error) {
			alert('Network error has occurred please try again!');
		}
	});
});

var ajaxEvento = {  
	parseJSONP:function(result){  
		$.each(result.eventos, function(i, row) {
			$('#evento h1').append(row.post_title);
			$('#evento-data').append('<p><strong>Lugar:</strong> '+ row.nombre_lugar +'</p>');
			$('#evento-data').append('<p><strong>Fecha:</strong> '+ row.fecha +'</p>');
			$('#evento-data').append('<p><strong>Hora:</strong> '+ row.hora +'</p>');
			$('#evento-data').append('<p>'+row.post_content+'</p>');
			$('#evento-data').append('<a href="https://www.facebook.com/sharer/sharer.php?u=http://feriadesanlucas.com/evento/'+row.post_name+'/" class="ui-btn ui-corner-all" target="_blank">Compartir en Facebook</a>');
			$('#evento-data').append('<a href="http://twitter.com/share?text='+row.post_title+'&url=http://feriadesanlucas.com/evento/'+row.post_name+'/&hashtags=SanLucas2015" class="ui-btn ui-corner-all" target="_blank">Twitear este Evento</a>');
		});
	}
}

/* PAGE: MAPA */
$('#mapa').on( "pagecreate", function() {
	var defaultLatLng = new google.maps.LatLng(37.7697479, -3.7733684);
	drawMap(defaultLatLng);

	function drawMap(latlng) {
		var myOptions = {
			zoom: 13,
			center: latlng,
			mapTypeId: google.maps.MapTypeId.SATELLITE,
			panControl: false,
			zoomControl: false,
			mapTypeControl: false,
			scaleControl: false,
			streetViewControl: false,
			overviewMapControl: false
		};

		var map = new google.maps.Map(document.getElementById("map-canvas"), myOptions);
		var todo = new google.maps.KmlLayer('http://fsl14.maanjustudio.com/webapp15/kml/todo.kml'); 
		todo.setMap(map);
	}
});

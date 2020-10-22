$(document).ready(function() {

	var firebaseConfig = {
	    apiKey: "AIzaSyDjDc7IYQim1Ry1xhNJd2FbzZ_IJaG13jA",
	    authDomain: "grupoalumnosmau.firebaseapp.com",
	    databaseURL: "https://grupoalumnosmau.firebaseio.com",
	    projectId: "grupoalumnosmau",
	    storageBucket: "grupoalumnosmau.appspot.com",
	    messagingSenderId: "383791238148",
	    appId: "1:383791238148:web:04ca1da0384a51aee7b951"
	 };

	  // Initialize Firebase
	firebase.initializeApp(firebaseConfig);

	var filaEliminada;
	var filaEditada;
    var totalAlumnos=0;
    var sumaPromedioM=[];
    var sumaPromedioH=[];

	var db = firebase.database();
	var objAlumno = db.ref().child('Alumnos');
	 

	//creamos constantes para los iconos editar y borrar    
    const iconoEditar = '<svg class="bi bi-pencil-square" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/><path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/></svg>';
    const iconoBorrar = '<svg class="bi bi-trash" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg>';
	
	var dataSet = [];
	
	var hombreTabla = $('#hombreTabla').DataTable({
        pageLength : 5,
    	lengthMenu: [[5, 10, 20, -1], [5, 10, 20, 'Todos']],
        data: dataSet,
        columnDefs: [
            {
                targets: [0], 
                visible: false, //ocultamos la columna de ID que es la [0]                        
            },
            {
                targets: -1,        
                defaultContent: "<div class='wrapper text-center'><div class='btn-group'><button class='btnEditar btn btn-primary' data-toggle='tooltip' title='Editar'>"+iconoEditar+"</button><button class='btnBorrar btn btn-danger' data-toggle='tooltip' title='Borrar'>"+iconoBorrar+"</button></div></div>"
            }
        ]	   
    });

    var mujerTabla = $('#mujerTabla').DataTable({
        pageLength : 5,
    	lengthMenu: [[5, 10, 20, -1], [5, 10, 20, 'Todos']],
        data: dataSet,
        columnDefs: [
            {
                targets: [0], 
                visible: false, //ocultamos la columna de ID que es la [0]                        
            },
            {
                targets: -1,        
                defaultContent: "<div class='wrapper text-center'><div class='btn-group'><button class='btnEditar btn btn-primary' data-toggle='tooltip' title='Editar'>"+iconoEditar+"</button><button class='btnBorrar btn btn-danger' data-toggle='tooltip' title='Borrar'>"+iconoBorrar+"</button></div></div>"
            }
        ]	   
    });

    objAlumno.on("child_added", datos => {                
        dataSet = [datos.key, datos.child("matricula").val(), datos.child("nombre").val(), datos.child("edad").val(), datos.child("sexo").val(), datos.child("promedio").val()];        
        if (datos.child("sexo").val()=="hombre") {
            hombreTabla.rows.add([dataSet]).draw();  
            sumaPromedioH.push(datos.child("promedio").val());  
        }else{
            mujerTabla.rows.add([dataSet]).draw();        
            sumaPromedioM.push(datos.child("promedio").val());              
        }        
        totalAlumnos++;
            $('#totalAlumnos').val(totalAlumnos);        
            $('#promedioG').val("90");      
    });

    objAlumno.on('child_changed', datos => {           
        dataSet = [datos.key, datos.child("matricula").val(), datos.child("nombre").val(), datos.child("edad").val(), datos.child("sexo").val(), datos.child("promedio").val()];        
        if (datos.child("sexo").val()=="hombre") {
            hombreTabla.row(filaEditada).data(dataSet).draw();
            sumaPromedioH[filaEditada[0]]=datos.child("promedio").val();
        }else{
            mujerTabla.row(filaEditada).data(dataSet).draw();
            sumaPromedioM[filaEditada[0]]=datos.child("promedio").val();
            console.log(filaEditada[0]);
        }
    });
    objAlumno.on("child_removed", function() {        
            hombreTabla.row(filaEliminada.parents('tr')).remove().draw();                             
            mujerTabla.row(filaEliminada.parents('tr')).remove().draw(); 
            totalAlumnos=totalAlumnos-1;
            $('#totalAlumnos').val(totalAlumnos);        
            $('#promedioG').val("83.57");        
    });

    $('form').submit(function(e){                         
        e.preventDefault();
        let matricula = $.trim($('#matricula').val());        
        let nombre = $.trim($('#nombre').val());
        let edad = $.trim($('#edad').val());         
        let sexo = $('input:radio[name=sexo]:checked').val();          
        let promedio = $.trim($('#promedio').val());                         
        let idFirebase = id.value;                          
        if (idFirebase == ''){                    
            idFirebase = objAlumno.push().key;            
        };                        
        data = {matricula:matricula, nombre:nombre, edad:edad, sexo:sexo, promedio:promedio};             
        actualizacionData = {};
        actualizacionData[`/${idFirebase}`] = data;
        objAlumno.update(actualizacionData);
        id = '';        
        $("form").trigger("reset");
        $('#modalAltaEdicion').modal('hide');
    });

    $('#btnNuevo').click(function() {
        $('#id').val('');        
        $('#matricula').val('');
        $('#nombre').val('');         
        $('#edad').val('');      
        $('#sexo').val('');      
        $('#promedio').val('');      
        $("formulario").trigger("reset");
        $('#modalAltaEdicion').modal('show');
    });        

	  $("#hombreTabla").on("click", ".btnEditar", function() {    
        filaEditada = hombreTabla.row($(this).parents('tr'));           
        let fila = $('#hombreTabla').dataTable().fnGetData($(this).closest('tr'));               
        let id = fila[0];
        console.log(id);
		let matricula = $(this).closest('tr').find('td:eq(0)').text(); 
        let nombre = $(this).closest('tr').find('td:eq(1)').text();        
        let edad = parseInt($(this).closest('tr').find('td:eq(2)').text());        
        let sexo = $(this).closest('tr').find('td:eq(3)').text();        
        let promedio = parseInt($(this).closest('tr').find('td:eq(4)').text());        
        $('#id').val(id);        
        $('#matricula').val(matricula);
        $('#nombre').val(nombre);                
        $('#edad').val(edad);                        
        if(sexo=="hombre"){
             $("#sexo1").attr('checked', true);
         }else{
            $("#sexo2").attr('checked', true);
         }        
        $('#promedio').val(promedio);
        $('#modalAltaEdicion').modal('show');
	});  
  
    $("#hombreTabla").on("click", ".btnBorrar", function() {   
        filaEliminada = $(this);
        console.log("hombre eliminado: "+hombreTabla.row($(this).parents('tr'))[0]);
        sumaPromedioH.splice(hombreTabla.row($(this).parents('tr'))[0],1); 
        Swal.fire({
        title: '¿Está seguro de eliminar el producto?',
        text: "¡Está operación no se puede revertir!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Borrar'
        }).then((result) => {
        if (result.value) {
            let fila = $('#hombreTabla').dataTable().fnGetData($(this).closest('tr'));            
            let id = fila[0];            
            db.ref(`Alumnos/${id}`).remove()
            Swal.fire('¡Eliminado!', 'El producto ha sido eliminado.','success')
        }
        })        
	}); 

    $("#mujerTabla").on("click", ".btnEditar", function() { 

        filaEditada = mujerTabla.row($(this).parents('tr'));           
        let fila = $('#mujerTabla').dataTable().fnGetData($(this).closest('tr'));               
        let id = fila[0];
        console.log(id);
        let matricula = $(this).closest('tr').find('td:eq(0)').text(); 
        let nombre = $(this).closest('tr').find('td:eq(1)').text();        
        let edad = parseInt($(this).closest('tr').find('td:eq(2)').text());        
        let sexo = $(this).closest('tr').find('td:eq(3)').text();        
        let promedio = parseInt($(this).closest('tr').find('td:eq(4)').text());        
        $('#id').val(id);        
        $('#matricula').val(matricula);
        $('#nombre').val(nombre);                
        $('#edad').val(edad);                        
        if(sexo=="hombre"){
             $("#sexo1").attr('checked', true);
         }else{
            $("#sexo2").attr('checked', true);
         }        
        $('#promedio').val(promedio);
        $('#modalAltaEdicion').modal('show');
    });  
  
    $("#mujerTabla").on("click", ".btnBorrar", function() {   
        filaEliminada = $(this);
        console.log("mujer eliminada: "+mujerTabla.row($(this).parents('tr'))[0]);   
        sumaPromedioM.splice(mujerTabla.row($(this).parents('tr'))[0],1);
        Swal.fire({
        title: '¿Está seguro de eliminar el producto?',
        text: "¡Está operación no se puede revertir!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Borrar'
        }).then((result) => {
        if (result.value) {
            let fila = $('#mujerTabla').dataTable().fnGetData($(this).closest('tr'));            
            let id = fila[0];            
            db.ref(`Alumnos/${id}`).remove()
            Swal.fire('¡Eliminado!', 'El producto ha sido eliminado.','success')
        }
        })        
    });
});
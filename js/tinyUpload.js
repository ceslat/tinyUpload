/*
 * tinyUpload v0.7
 *
 * Created by Ceslat
 *
 * Copyright (c) 2014
 * Dual licensed under the GPL v.3 licenses.
 *
 * http://github.com/ceslat/tinyUpload
 */


function humanFileSize(size) {
    var i = Math.floor( Math.log(size) / Math.log(1024) );
    return ( size / Math.pow(1024, i) ).toFixed(2) * 1 + ' ' + ['Bytes', 'kB', 'MB', 'GB', 'TB'][i];
};

function processData(f){
	var li = document.createElement('li');
	var a = document.createElement('a');
	var img = document.createElement('img');
	var name = document.createElement('p');
	var bytes = document.createElement('p');
	var progress = document.createElement('progress');

	a.addEventListener('click', (function(li){
		return function(){
			li.parentNode.removeChild(li);
		};
	})(li), false);

	img.src = 'img/file.png';

	if(f.name.length > 14){
		name.innerHTML = f.name.toLowerCase().substr(0,14) + '...';
	}
	else{
		name.innerHTML = f.name.toLowerCase();
	}
	bytes.innerHTML = humanFileSize(f.size);

	document.getElementById('list').appendChild(li);

	li.appendChild(a);
	li.appendChild(img);
	li.appendChild(name);
	li.appendChild(bytes);
	li.appendChild(progress);

	if (f.type.match('image.*')){
		var reader = new FileReader();
		reader.onload = (function(img){
			return function(e){
			img.src = e.target.result;
		};
		})(img);
		reader.readAsDataURL(f);
	}

	var data = new FormData();
	data.append('file', f);

	var request = new XMLHttpRequest();

	request.onload = (function(li, a){
		return function(r){
			var resp = JSON.parse(r.target.response);
			if(resp.status == 'OK'){
				var file = document.createElement('input');
				file.type = 'hidden';
				file.name = 'files[]';
				file.value = resp.files;
				li.appendChild(file);
				a.className = "icon ok";
			}else{
				a.className = "icon ko";
				a.title = resp.message;
			}
		}
	})(li, a);

	request.upload.addEventListener('progress', (function(progress){
		return function(e){
			progress.value = e.loaded/e.total;
			if(progress.value == 1){
				progress.parentNode.removeChild(progress);
			}
		}
	})(progress), false);

	request.open('POST', 'upload.php');
	request.send(data);
}

function handleDragOver(evt) {
	evt.stopPropagation();
	evt.preventDefault();
	evt.dataTransfer.dropEffect = 'copy';
}

function handleFileDrag(evt) {
	evt.stopPropagation();
	evt.preventDefault();

	var files = evt.dataTransfer.files;

	for (var i = 0, f; f = files[i]; i++) {
		processData(f);
	}
}

function handleFileSelect(evt){
	var files = evt.target.files;

	for (var i = 0, f; f = files[i]; i++) {
		processData(f);
	}
}

var dropArea = document.getElementById('dropArea');
var files = document.getElementById('files');
dropArea.addEventListener('dragover', handleDragOver, false);
dropArea.addEventListener('drop', handleFileDrag, false);
files.addEventListener('change', handleFileSelect, false);

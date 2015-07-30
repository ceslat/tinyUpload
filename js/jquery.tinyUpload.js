/*
 * jquery.tinyUpload.js v1.0
 *
 * Created by Ceslat
 *
 * Copyright (c) 2015
 * Dual licensed under the GPL v.3 licenses.
 *
 * http://github.com/ceslat/tinyUpload
 */

(function($){
	function humanFileSize(size) {
		var i = Math.floor( Math.log(size) / Math.log(1024) );
		return ( size / Math.pow(1024, i) ).toFixed(2) + ' ' + ['Bytes', 'kB', 'MB', 'GB', 'TB'][i];
	}

	function processData(f, input, url, multiple, defaults){
        var li = document.createElement('li');
	    var a = document.createElement('a');
	    var img = document.createElement('img');
	    var name = document.createElement('p');
	    var bytes = document.createElement('p');
	    var progress = document.createElement('progress');
	    var ext = f.name.split('.').pop();

        switch(ext) {
            //image
            case 'jpg':
                img.src = '/static/img/file_img.png';
                break;
            case 'jpeg':
                img.src = '/static/img/file_img.png';
                break;
            case 'png':
                img.src = '/static/img/file_img.png';
                break;
            case 'gif':
                img.src = '/static/img/file_img.png';
                break;
            case 'bmp':
                img.src = '/static/img/file_img.png';
                break;
            //doc
            case 'doc':
                img.src = '/static/img/file_doc.png';
                break;
            case 'docx':
                img.src = '/static/img/file_doc.png';
                break;
            //music
            case 'mp3':
                img.src = '/static/img/file_mp3.png';
                break;
            //pdf
            case 'pdf':
                img.src = '/static/img/file_pdf.png';
                break;
            //ppt
            case 'ppt':
                img.src = '/static/img/file_ppt.png';
                break;
            case 'pptx':
                img.src = '/static/img/file_ppt.png';
                break;
            //video
            case 'avi':
                img.src = '/static/img/file_video.png';
                break;
            case 'mp4':
                img.src = '/static/img/file_video.png';
                break;
            case 'mpg':
                img.src = '/static/img/file_video.png';
                break;
            case 'mpeg':
                img.src = '/static/img/file_video.png';
                break;
            case 'ogv':
                img.src = '/static/img/file_video.png';
                break;
            //xls
            case 'xls':
                img.src = '/static/img/file_xls.png';
                break;
            case 'xlsx':
                img.src = '/static/img/file_xls.png';
                break;
            //compress
            case 'zip':
                img.src = '/static/img/file_zip.png';
                break;
            case 'rar':
                img.src = '/static/img/file_zip.png';
                break;
            case '7z':
                img.src = '/static/img/file_zip.png';
                break;
            case 'tar':
                img.src = '/static/img/file_zip.png';
                break;
            case 'gz':
                img.src = '/static/img/file_zip.png';
                break;
            //other
            default:
                img.src = '/static/img/file_txt.png';
        }

        if(f.name.length > 14){
            name.innerHTML = f.name.toLowerCase().substr(0,14) + '...';
        }
        else{
            name.innerHTML = f.name.toLowerCase();
        }
        bytes.innerHTML = humanFileSize(f.size);

        if (f.type.match('image.*')){
			var reader = new FileReader();
            reader.onloadend = function(){
                img.src = reader.result;
            };
			reader.readAsDataURL(f);
		}

        li.appendChild(a);
        li.appendChild(img);
        li.appendChild(name);
        li.appendChild(bytes);
        li.appendChild(progress);

        if(multiple==false){
            input.next('ul.tinyUpload-list').find('li').remove();
        }
        input.next('ul.tinyUpload-list').append(li);

		var data = new FormData();
		data.append('file', f);
        //For Django csrf POST, include csrf.js, and uncomment the next line.
        //data.append('csrfmiddlewaretoken', getCookie('csrftoken'));

        $.ajax({
            url: url,
            data: data,
            method: 'POST',
            dataType: 'json',
            cache: false,
            processData: false,
            contentType: false,
            success: function(data, textStatus, jqXHR) {
                if(data.status){
                    $(li).append('<input type="hidden" name="files[]" class="tinyUpload-hidden-file" value="' + data.files + '"/>');
                    $(li).find('a').addClass('result ok');
                    $(li).find('a').attr('title', defaults.text_upload_success);
                }
                else{
                    $(li).find('a').addClass('result ko');
                    $(li).find('a').attr('title', defaults.text_upload_error);
                }
				console.log('tinyUpload - upload success status text: ' + textStatus);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $(li).find('a').addClass('result ko');
                $(li).find('a').attr('title', defaults.text_upload_error);
				$(li).find('progress').remove();
                console.log('tinyUpload - upload error status text: ' + textStatus);
                console.log('tinyUpload - upload error response text: ' + jqXHR.responseText);
                console.log('tinyUpload - upload error thrown: ' + errorThrown);
            },
            xhr: function () {
                var xhr = new window.XMLHttpRequest();
                xhr.upload.addEventListener("progress", function (evt) {
                    var progress = $(li).find('progress');
                    if(evt.lengthComputable){
                        var percentComplete = evt.loaded / evt.total;
                        progress.val(percentComplete);
                        console.log(percentComplete);
                    }
				    if(progress.val() >= 1){
					    progress.remove()
				    }
                }, false);
                return xhr;
            }
        });
	}
	var methods = {
		init: function(options){

			var defaults = {
				text: 'Drag and Drop your files here.',
                text_upload_error: 'Error to upload file :(, view console log for more details.',
                text_upload_success: 'File upload complete :).',
				extensions: []
			};

			var options = $.extend(defaults, options);

			if(options.url){
				return this.each(function(){
					var input = $(this);
                    var multiple = false;
                    input.addClass('tinyUpload-file');
                    if(options.extensions.length > 0){
                        input.attr('accept', options.extensions.join());
                    }
                    if(input.attr('multiple')){
                        multiple = true;
                        input.wrap('<div class="tinyUpload"></div>');
                        $('<h4 class="tinyUpload-text">' + options.text + '</h4>').insertBefore(input);
                        var parent = $(this).parents('.tinyUpload');

                        parent.on('dragover', function(e){
                            e.stopPropagation();
                            e.preventDefault();
                            e.dataTransfer.dropEffect = 'copy';
                        });

                        parent.on('drop', function(e){
                            e.stopPropagation();
                            e.preventDefault();
                            $(e.originalEvent.dataTransfer.files).each(function(){
                                processData(this, input, options.url, multiple, defaults);
                            });
                        });
                    }

					$('<ul class="tinyUpload-list"></ul>').insertAfter(input);

					input.on('change', function(e){
						$(e.target.files).each(function(){
							processData(this, input, options.url, multiple, defaults);
						});
					});

					$('ul.tinyUpload-list').on('click','a', function(){
						$(this).parent().remove();
					});
				});
			}
			else{
				$.error('Missing url options');
			}
		},
        destroy: function() {
            return this.each(function(){
                $(this).removeClass('tinyUpload-file');
                $(this).next('ul.tinyUpload-list').remove();
                if($(this).prev('h4.tinyUpload-text').length > 0){
                    $(this).prev('h4.tinyUpload-text').remove();
                }
                if($(this).parent('div.tinyUpload').length > 0){
                    $(this).unwrap();
                }
            });
        }
	};

	$.fn.tinyUpload = function( method ) {
		if ( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		}
		else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		}
		else {
			$.error( 'This Method ' +  method + ' does not exit in jQuery.easyCalendar' );
		}
	};
})(jQuery);
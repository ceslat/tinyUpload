/***
 * Copyright (c) 2014
 * Licensed under the MIT License.
 *
 * Name: jquery.tinyUpload v0.7
 * Author: César Latorre
 * Version: 1.0
 * Web: https://github.com/ceslat/tinyUpload
 */


(function($){
	function humanFileSize(size) {
		var i = Math.floor( Math.log(size) / Math.log(1024) );
		return ( size / Math.pow(1024, i) ).toFixed(2) + ' ' + ['Bytes', 'kB', 'MB', 'GB', 'TB'][i];
	}

	function processData(f, input, url, multiple){
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
                img.src = 'img/file_img.png';
                break;
            case 'jpeg':
                img.src = 'img/file_img.png';
                break;
            case 'png':
                img.src = 'img/file_img.png';
                break;
            case 'gif':
                img.src = 'img/file_img.png';
                break;
            case 'bmp':
                img.src = 'img/file_img.png';
                break;
            //doc
            case 'doc':
                img.src = 'img/file_doc.png';
                break;
            case 'docx':
                img.src = 'img/file_doc.png';
                break;
            //music
            case 'mp3':
                img.src = 'img/file_mp3.png';
                break;
            //pdf
            case 'pdf':
                img.src = 'img/file_pdf.png';
                break;
            //ppt
            case 'ppt':
                img.src = 'img/file_ppt.png';
                break;
            case 'pptx':
                img.src = 'img/file_ppt.png';
                break;
            //video
            case 'avi':
                img.src = 'img/file_video.png';
                break;
            case 'mp4':
                img.src = 'img/file_video.png';
                break;
            case 'mpg':
                img.src = 'img/file_video.png';
                break;
            case 'mpeg':
                img.src = 'img/file_video.png';
                break;
            case 'ogv':
                img.src = 'img/file_video.png';
                break;
            //xls
            case 'xls':
                img.src = 'img/file_xls.png';
                break;
            case 'xlsx':
                img.src = 'img/file_xls.png';
                break;
            //compress
            case 'zip':
                img.src = 'img/file_zip.png';
                break;
            case 'rar':
                img.src = 'img/file_zip.png';
                break;
            case '7z':
                img.src = 'img/file_zip.png';
                break;
            case 'tar':
                img.src = 'img/file_zip.png';
                break;
            case 'gz':
                img.src = 'img/file_zip.png';
                break;
            //other
            default:
                img.src = 'img/file_txt.png';
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

        $.ajax({
            url: url,
            data: data,
            method: 'POST',
            dataType: 'json',
            cache: false,
            processData: false,
            contentType: false,
            success: function(r){
                if(r.status){
                    $(li).append('<inpùt type="hidden" name="files[]" value="' + r.files + '">');
                    $(li).find('a').addClass('result ok');
                }
                else{
                    $(li).find('a').addClass('result ko');
                    $(li).find('a').attr('title', r.message);
                }
            },
            error: function(){

            },
            xhr: function () {
                var xhr = new window.XMLHttpRequest();
                xhr.addEventListener("progress", function (e) {
                    var progress = $(li).find('progress');
                    progress.val(e.loaded / e.total);
				    if(progress.val() == 1){
					    progress.remove()
				    }
                });
                return xhr;
            }
        });
	}
	var methods = {
		init: function(options){

			var defaults = {
				text: 'Drag and Drop your files here.',
				extensions: []
			};

			var options = $.extend(defaults, options);

			if(options.url){
				return this.each(function(){
					var input = $(this);
                    var multiple = false;
                    if(options.extensions.length > 0){
                        input.attr('accept', options.extensions.join());
                    }
                    if(input.attr('multiple')){
                        multiple = true;
                        input.wrap('<div class="tinyUpload"></div>');
                        $('<h4>' + options.text + '</h4>').insertBefore(input);
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
                                processData(this, input, options.url, multiple);
                            });
                        });
                    }

					$('<ul class="tinyUpload-list"></ul>').insertAfter(input);

					input.on('change', function(e){
						$(e.target.files).each(function(){
							processData(this, input, options.url, multiple);
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
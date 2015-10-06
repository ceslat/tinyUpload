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
        var video = document.createElement('video');
        var audio = document.createElement('audio');
        var file = document.createElement('div');
        var description = document.createElement('div');
        var name = document.createElement('p');
        var bytes = document.createElement('p');
        var progress = document.createElement('progress');
        
        description.className = 'description';
        file.className = 'file';
        name.innerHTML = f.name.toLowerCase();
        bytes.innerHTML = humanFileSize(f.size);

        li.appendChild(a);
        if (f.type.match('image.*')){
            var reader = new FileReader();
            reader.onloadend = function(){
                img.src = reader.result;
            };
            reader.readAsDataURL(f);
            file.appendChild(img);
        }
        else if (f.type.match('video.*')) {
            var reader = new FileReader();
            reader.onloadend = function () {
                video.controls = true;
                video.src = reader.result;
            };
            reader.readAsDataURL(f);
            file.appendChild(video);
        }
        else if (f.type.match('audio.*')) {
            var reader = new FileReader();
            reader.onloadend = function () {
                audio.controls = true;
                audio.src = reader.result;
            };
            reader.readAsDataURL(f);
            file.appendChild(audio);
        }
        else{
            img.src = 'data:image/png;base64,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';
            file.appendChild(img);
        }
        li.appendChild(file);
        description.appendChild(name);
        description.appendChild(bytes);
        description.appendChild(progress);
        li.appendChild(description);

        if(multiple==false){
            input.next('ul.tinyUpload-list').find('li').remove();
        }
        input.next('ul.tinyUpload-list').append(li);

        var data = new FormData();
        data.append('file', f);
        //For Django csrf POST, include csrf.js, and uncomment the next line.
        data.append('csrfmiddlewaretoken', getCookie('csrftoken'));

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
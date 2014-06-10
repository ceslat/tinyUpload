<?php
$output_dir = "uploads/";

$ret = array();

try{
    foreach($_FILES as $files){
        if(move_uploaded_file($files["tmp_name"], $output_dir.$files["name"])){
            $ret[] = $files["name"];
        }
        else{
            switch ($files['error']) {
                case UPLOAD_ERR_OK:
                    $response = 'No hay ningún error, el archivo subido con éxito.';
                    break;
                case UPLOAD_ERR_INI_SIZE:
                    $response = 'El archivo subido excede la directiva upload_max_filesize en php.ini.';
                    break;
                case UPLOAD_ERR_FORM_SIZE:
                    $response = 'El archivo subido excede la directiva MAX_FILE_SIZE que se especificó en el formulario HTML.';
                    break;
                case UPLOAD_ERR_PARTIAL:
                    $response = 'El archivo subido fue sólo parcialmente cargado.';
                    break;
                case UPLOAD_ERR_NO_FILE:
                    $response = 'Ningún archivo fue subido.';
                    break;
                case UPLOAD_ERR_NO_TMP_DIR:
                    $response = 'Falta una carpeta temporal.';
                    break;
                case UPLOAD_ERR_CANT_WRITE:
                    $response = 'No se pudo escribir el archivo en el disco.';
                    break;
                case UPLOAD_ERR_EXTENSION:
                    $response = 'Envío de archivo detenida por extensión.';
                    break;
                default:
                    $response = 'Error de subida Desconocido.';
                    break;
            }
            $return = array(
                'status' => 'KO',
                'files' => '',
                'message' => $response
            );
            print json_encode($return);
            exit;
        }
    }
    $return = array(
        'status' => 'OK',
        'files' => $ret,
        'message' => ''
    );
    print json_encode($return);
}
catch (Exception $e){
    $return = array(
        'status' => 'KO',
        'files' => '',
        'message' => $e
    );
    print json_encode($return);
}

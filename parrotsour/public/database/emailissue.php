<?php
 if( !empty($_POST['email']) || !empty($_PUT['email'])){
    // TODO - issue comments get posted, but not properly sent in email msg body
    $email=$_POST['email'];
    $image=$_POST['image'];
    $comments=$_POST['comments'];

	if (!isset($email)){
		$email=$_PUT['email'];
	}
	if (!isset($image)){
		$image=$_PUT['image'];
    }
    $headers="From:".$email."\r\n";
    $headers .= "MIME-Version: 1.0\r\n"; 
    $headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";
    
    $img = str_replace('data:image/png;base64,', '', $image);  
    $img = str_replace(' ', '+', $img);  
    $data = base64_decode($img);

    $nowtime = time();
    if (!is_dir("images")){
      mkdir("images");
    }
    $success = file_put_contents("images/issue".$nowtime.".png", $data); 
    
    $my_file = "issue".$nowtime.".png";
    $my_path = "images/";
    $my_subject = "Issue Reported";
    $my_message = "Reported by ".$email.': '.$comments;
    mail_attachment($my_file, $my_path, "jem3973@rit.edu", $email, $email, $email, $my_subject, $my_message);        
    mail_attachment($my_file, $my_path, "john.mccarthy.24@us.af.mil", $email, $email, $email, $my_subject, $my_message);
}

function mail_attachment($filename, $path, $mailto, $from_mail, $from_name, $replyto, $subject, $msg) {
  $file = $path.$filename;
  $file_size = filesize($file);
  $handle = fopen($file, "r");
  $content = fread($handle, $file_size);
  fclose($handle);
  $content = chunk_split(base64_encode($content));
  $uid = md5(uniqid(time()));
 
  $eol = PHP_EOL;

  $header = "From: ".$from_name." <".$from_mail.">".$eol;
  $header .= "Reply-To: ".$replyto.$eol;
  $header .= "MIME-Version: 1.0".$eol;
  $header .= "Content-type: multipart/alternative; boundary=\"----=_NextPart_" . $uid . "\"";

  $message = "This is multipart message using MIME\n";

  $message .= "------=_NextPart_" . $uid . "\n";
  $message .= "Content-Type: text/plain; charset=UTF-8\n";
  $message .= "Content-Transfer-Encoding: 7bit". "\n\n";
  $message .= "".$msg . "\n text\n\n";
  $message .="------=_NextPart_" . $uid . "\n";

  $message .= "Content-Type: application/octet-stream; name=\"".$filename."\"".$eol; // use different content types here
  $message .= "Content-Transfer-Encoding: base64".$eol;
  $message .= "Content-Disposition: attachment; filename=\"".$filename."\"".$eol;
  $message .= $content.$eol;
  $message .= "------=_NextPart_" . $uid . "--";
 
  if (@mail($mailto, $subject, $message, $header, " -fwebmaster@parrotsour.com")) {
    echo "mail send ... OK"; // or use booleans here
  } else {
    $errorMessage = error_get_last()['message'];
    http_response_code(500);
    echo $errorMessage;
    echo "mail send ... ERROR!";
 }
}
?>
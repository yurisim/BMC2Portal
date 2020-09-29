
// Displays a snackbar notification in the lower portion of the screen
async function snackbar(text, timeout, color){
  color = color || "#4caf50"
  var x = document.getElementById("snackbar");
  x.innerHTML = text;
  x.className = "show";
  x.style.backgroundColor = color;
  timeout = (timeout === undefined) ? 3000 : timeout;
  setTimeout(function(){ x.className = x.className.replace("show", ""); }, timeout);
}
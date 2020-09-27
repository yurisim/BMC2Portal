
// make an input box have default text
var defaultSearchText = "Enter search text here";
function WaterMark(txt, evt) 
{
    if(txt.value.length == 0 && evt.type == "blur")        
    {
        txt.style.color = "gray";
        txt.value = defaultSearchText;
    }
    if(txt.value == defaultSearchText && evt.type == "focus") 
    {
        txt.style.color = "white";
        txt.value=""; 
    }
}

// search the fighter unit directory and filter out non-matching text
function filterTable(tableId, searchTextId){

    var input, filter, table, tr, td, i;
    input = document.getElementById(searchTextId);
    filter = input.value.toUpperCase();
    table = document.getElementById(tableId);
    tr = table.getElementsByTagName("tr");
    console.log(filter)
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        td2 = tr[i].getElementsByTagName("td")[1];
        if (td && td2) {
        if (td.innerHTML.toUpperCase().indexOf(filter) > -1 || td2.innerHTML.toUpperCase().indexOf(filter) > -1 || filter===defaultSearchText.toUpperCase()){
            tr[i].style.display = "";
        } else {
            tr[i].style.display = "none";
        }
        }       
    }
}
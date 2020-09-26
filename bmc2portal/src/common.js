
// make an input box have default text
var defaultSearchText = "Enter search text here";

let common = {
    WaterMark(txt, evtType) {
        var itm = txt.target;
        if(itm.value.length === 0 && evtType === "blur")        
        {
            itm.style.color = "gray";
            itm.value = defaultSearchText;
        }
        if(itm.value === defaultSearchText && evtType === "focus") 
        {
            itm.style.color = "white";
            itm.value=""; 
        }
    },

    // search the fighter unit directory and filter out non-matching text
    filterTable(tableId, searchTextId){
        var input, filter, table, tr, td, td2, i;
        input = document.getElementById(searchTextId);
        filter = input.value.toUpperCase();
        table = document.getElementById(tableId);
        tr = table.getElementsByTagName("tr");
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
}

export default common;
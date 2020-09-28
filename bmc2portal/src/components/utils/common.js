let common = {

    defaultText: "Enter search text...",

    WaterMark(txt, evtType, defaultTxt) {
        var itm = txt.target;
        if(itm.value.length === 0 && evtType === "blur")        
        {
            itm.style.color = "gray";
            itm.value = defaultTxt;
        }
        if(itm.value === defaultTxt && evtType === "focus") 
        {
            itm.style.color = "white";
            itm.value=""; 
        }
    },

    // search the fighter unit directory and filter out non-matching text
    filterTable(tableId, searchTextId, cells ){
        if (cells === undefined || cells.length === 0){
            return
        }

        var input, filter, table, tr, i;
        input = document.getElementById(searchTextId);
        filter = input.value.toUpperCase();
        table = document.getElementById(tableId);
        tr = table.getElementsByTagName("tr");
        for (var i = 1; i < tr.length; i++) {
            let foundInRow = false;
            for (var j =0; j < cells.length; j++){
                let td = tr[i].getElementsByTagName("td")[j]
                if (td){
                    if (td.innerHTML.toUpperCase().indexOf(filter) > -1 || filter === this.defaultText.toUpperCase()){
                        tr[i].style.display="";
                        foundInRow = true;
                    }
                }
            }
            if (!foundInRow) {
                tr[i].style.display="none";
            }   
        }
    }
}

export default common;
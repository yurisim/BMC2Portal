package pdfreader

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"os/exec"
	"path/filepath"
	"strings"

	"github.com/blevesearch/bleve"
)

//JSONFileIndex describes the JSON index files for bleve
type JSONFileIndex struct {
	Name string `json:"filename"`
	Path string `json:"filepath"`
	Content string `json:"content"`
}

func init(){
	mapping := bleve.NewIndexMapping()
	_, err := bleve.New("loas.index", mapping)
	if (err != nil){
		fmt.Println(err)
	}
	fmt.Println("!! Initialized bleve.")
}

//IndexFiles traverses directory to index all PDFs
func IndexFiles(basePath string, indexName string){
	err := filepath.Walk(basePath, func(path string, info os.FileInfo, err error) error {
		newPath,_ := filepath.Abs(path)
		extension := filepath.Ext(newPath)
		if extension == ".pdf"{
			var name = strings.ReplaceAll(path, basePath, "")
			indexFile(path, name, "loas.index")
		}
		return nil	
	})
	if err != nil{
		fmt.Println(err)
	}
}

//PDFToJSON converts a PDF file to JSON, indexable by bleve
func indexFile(basePath string, fileName string, indexName string) {
	filePath := basePath
	//var extension = filepath.Ext(fileName)
	//var name = fileName[0:len(fileName)-len(extension)]
	
	fmt.Println("Processing " + basePath + " " + fileName)

	cmd := exec.Command("java", "-jar", "pdfbox.jar", "ExtractText", filePath)
	output, err := cmd.CombinedOutput()
	if err != nil {
		fmt.Println(err, "PDFBox", string(output))
	}
	fmt.Println("Exracted text from pdf.")

	fmt.Println("Reading .txt...")
	
	txtPath := strings.ReplaceAll(basePath, ".pdf", ".txt")
	dat, err := ioutil.ReadFile(txtPath)
	os.Remove(txtPath)

	fmt.Println("Read .txt")

	idx := &JSONFileIndex{
		Name: fileName,
		Path: filePath,
		Content: string(dat),
	}

	marshal, err := json.Marshal(idx)

	if err != nil {
		fmt.Println("Marshal invalid")
	}	

	fmt.Println("Converting to JSON...")
	
	newPath := strings.ReplaceAll(filePath,".pdf",".json")
	err = ioutil.WriteFile(newPath, marshal, 0644)
	if err != nil {
		fmt.Println("unable JSON")
	}

	fmt.Println("Opening index")
		// now open it read-only
	index, err := bleve.OpenUsing("loas.index", map[string]interface{}{
		"read_only": false,
	})
	//defer index.Close()
	fmt.Println("Index open")

	if (err != nil){
		fmt.Println("!!!! Error", err)
	}
	if index != nil {
		fmt.Println("Indexing")
		err := index.Index(fileName, idx)
		if err != nil{
			fmt.Println(err)
		}
	}
	count, err := index.DocCount()
	fmt.Println(count)

	index.Close()
}

//
//
// TODO -- Break down search results to the page granular level
//
//

//QueryBlevePhrase searches for a phrase in the index
func QueryBlevePhrase(word string){
	// now open it read-only
	index, _ := bleve.OpenUsing("loas.index", map[string]interface{}{
		"read_only": true,
	})
	defer index.Close()

	query := bleve.NewPhraseQuery(strings.Split(word," "), "content")
	searchRequest := bleve.NewSearchRequestOptions(query, 15, 0, false)
	
	if (index !=nil){
		searchResult, _ := index.Search(searchRequest)

		fmt.Println(searchResult.Hits)

		for i :=0; i < searchResult.Hits.Len(); i++ {
			fmt.Println(searchResult.Hits[i].ID)
			for key := range searchResult.Hits[i].Locations { 
				fmt.Println("Key: " + key)
			}
		}
	}
}

//QueryBleve searches for a keyword in the index
func QueryBleve(word string){
	// now open it read-only
	index, _ := bleve.OpenUsing("loas.index", map[string]interface{}{
		"read_only": true,
	})
	defer index.Close()
	query := bleve.NewQueryStringQuery(word)
	
    searchRequest := bleve.NewSearchRequestOptions(query, 15, 0, false)
	if (index !=nil){
		searchResult, _ := index.Search(searchRequest)

		fmt.Println(searchResult)
	}
}
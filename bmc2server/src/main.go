package main

import (
	//pdfreader "bmc2server/pdfreader"
	server "bmc2server/server"
)

func main() {
	//pdfreader.IndexFiles("docs/LOAs", "loas.index")
	//pdfreader.QueryBlevePhrase("limited maneuvering category")
	//pdfreader.QueryBleve("limited maneuvering category")
	srv := server.Build()
	srv.Run()
}

package main

import (
	"bmc2server/server"
)

func main() {
	srv := server.Build()
	srv.Run()
}

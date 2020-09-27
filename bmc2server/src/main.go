package main

import (
	server "bmc2server/server"
)

func main() {
	srv := server.Build()
	srv.Run()
}

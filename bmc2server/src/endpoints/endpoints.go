package endpoints

import (
	"net/http"
	"sync"
	// "github.com/go-pg/pg"
	// "github.com/kataras/iris"
)

// EP type that will hold an initialized instance of all endpoints
type EP struct {
	//db *pg.DB
	// Holds the SSE channels for every user connected to this server instance
	userNotifiers *sync.Map
	client        *http.Client
}

// Build will return an initialized EP structure given the set parameters
// func Build(DB *pg.DB) *EP {
// 	return &EP{
// 		userNotifiers: &sync.Map{},
// 		db:            DB,
// 		client:        &http.Client{Transport: &http.Transport{TLSClientConfig: &tls.Config{InsecureSkipVerify: true}}},
// 	}
// }

// // RundownGet is used to get the current rundown list
// func (e *EP) RundownGet(ctx iris.Context) {

// 	rundown := ""
// 	//&models.Rundown

// 	errorPresent := false

// 	// Parse JSON and return error
// 	if err := ctx.ReadJSON(rundown); err != nil {
// 		ctx.StatusCode(iris.StatusBadRequest) // https://tools.ietf.org/html/rfc7231#section-6.5.1
// 		log.Println(err)
// 		errorPresent = true
// 	}

// 	// Select a user by the email from the post body
// 	if err := e.db.Model(rundown).
// 		Select(); err != nil {
// 		if err == pg.ErrNoRows {
// 			ctx.StatusCode(iris.StatusInternalServerError) // https://tools.ietf.org/html/rfc7235#section-3.1
// 		} else {
// 			ctx.StatusCode(iris.StatusUnprocessableEntity) // https://tools.ietf.org/html/rfc4918#section-11.2
// 		}
// 		log.Println(err)
// 		errorPresent = true
// 	}

// 	if !errorPresent {
// 		log.Println("Getting rundown successfully")
// 	}
// }

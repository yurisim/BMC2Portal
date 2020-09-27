package server

import (
	"crypto/tls"
	"log"
	"net/http"
	"sync"

	echo "github.com/labstack/echo/v4"
)

// EP type that will hold an initialized instance of all endpoints
type EP struct {
	//db *pg.DB
	userNotifiers *sync.Map
	client        *http.Client
}

// BuildEP will return an initialized EP structure given the set parameters
func BuildEP() *EP {
	log.Println("Building endpoints...")
	return &EP{
		userNotifiers: &sync.Map{},
		//db:            DB,
		client: &http.Client{Transport: &http.Transport{TLSClientConfig: &tls.Config{InsecureSkipVerify: true}}},
	}
}

//
//
// TODO - Figure out how to provide .env toggle for mock on server or interact with DB.
//
//

//AirspaceListGet returns data for all airspaces
// SELECT * FROM AIRSPACELIST
func (e *EP) AirspaceListGet(ctx echo.Context) error {
	asList := GetAirspaceList()
	return ctx.JSON(http.StatusOK, asList)
}

//AirspaceGet returns information from a particular airspace
// SELECT * FROM AIRSPACELIST WHERE NAME=NAME
func (e *EP) AirspaceGet(ctx echo.Context) error {
	aspace := GetAirspace(ctx.Param("name"))
	return ctx.JSON(http.StatusOK, aspace)
}

//UnitListGet returns data for all units
func (e *EP) UnitListGet(ctx echo.Context) error {
	uList := GetUnitList()
	return ctx.JSON(http.StatusOK, uList)
}

//UnitGet returns data for all units
func (e *EP) UnitGet(ctx echo.Context) error {
	unit := GetUnit(ctx.Param("name"), "KTIK")
	return ctx.JSON(http.StatusOK, unit)
}

//LOAsGet returns all of the ATCAgencies and their LOAs
func (e *EP) LOAsGet(ctx echo.Context) error {
	loas := GetLOAList()
	return ctx.JSON(http.StatusOK, loas)
}

//LessonsLearnedGet returns all of the lessons learned
func (e *EP) LessonsLearnedGet(ctx echo.Context) error {
	lessons := GetLessonsLearned()
	return ctx.JSON(http.StatusOK, lessons)
}

//AllTagsGet returns all existing database tags (LL)
func (e *EP) AllTagsGet(ctx echo.Context) error {
	tags := GetAllTags()
	return ctx.JSON(http.StatusOK, tags)
}

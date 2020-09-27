package server

import (
	"log"
	"os"

	echo "github.com/labstack/echo/v4"
	middleware "github.com/labstack/echo/v4/middleware"
	"github.com/subosito/gotenv"
)

//A Server struct contains all the information necessary to create a server
type Server struct {
	API       *EP
	App       *echo.Echo
	hasStatic bool
}

//Build function establishes a connection to the database and starts the server service.
func Build() *Server {

	log.Println("Loading environment...")
	gotenv.Load()

	log.Println("Constructing server...")
	srv := &Server{}

	log.Println("Connecting to database...")
	//srv.ConnectToDatabase()

	log.Println("Exposing API...")
	srv.BuildAPI()

	return srv
}

//ConnectToDatabase establishes a connection to the database with the following credentials
func (s *Server) ConnectToDatabase() {
	dbUser := os.Getenv("DATABASE_USER")

	if dbUser == "" {
		log.Fatalln("No DATABASE_USER environment variable set")
	}

	dbPwd := os.Getenv("DATABASE_PASSWORD")

	if dbPwd == "" {
		log.Fatalln("No DATABASE_PASSWORD environment variable set")
	}

	dbURL := os.Getenv("DATABASE_URL")

	if dbURL == "" {
		log.Fatalln("No DATABASE_URL environment variable set")
	}

	dbName := os.Getenv("DATABASE_NAME")

	if dbName == "" {
		log.Fatalln("No DATABASE_NAME environment variable set")
	}

	dbTLS := os.Getenv("DATABASE_TLS")
	dbTLSServerName := os.Getenv("DATABASE_TLS_SERVER_NAME")
	dbTLSSkipVerify := false
	dbTLSDBCipher := false

	if dbTLS == "secure" {
		dbTLSSkipVerify = false
		dbTLSDBCipher = true
	} else if dbTLS == "secure-skip" {
		dbTLSSkipVerify = true
		dbTLSDBCipher = true
	} else if dbTLS == "insecure" {
		dbTLSSkipVerify = true
		dbTLSDBCipher = false
	}

	log.Println("TLSServerName: ", dbTLSServerName)
	log.Println("TLSSkipVerify", dbTLSSkipVerify)
	log.Println("TLSDBCipher", dbTLSDBCipher)

	// do DB connection logic here
}

//BuildAPI builds the endpoints as found below
func (s *Server) BuildAPI() {
	s.API = BuildEP()
	s.BuildAppLayer()
}

//BuildAppLayer maps endpoints to endpoint functions as found in the endpoint package
func (s *Server) BuildAppLayer() {
	e := echo.New()

	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORS())

	e.GET("/api/airspacelist", s.API.AirspaceListGet)
	e.GET("/api/airspace/:name", s.API.AirspaceGet)
	e.GET("/api/unitlist", s.API.UnitListGet)
	e.GET("/api/unit/:name", s.API.UnitGet)
	e.GET("/api/loas", s.API.LOAsGet)
	e.GET("/api/lessonslearned", s.API.LessonsLearnedGet)
	e.GET("/api/lessontags", s.API.AllTagsGet)

	if s.hasStatic == true {
		e.Static("/", "../../bmc2portal/build")
	}

	s.App = e

	log.Println("Built routes.")
}

//Run starts the server service
func (s *Server) Run() {
	serverURL := os.Getenv("SERVER_URL")
	serverCert := os.Getenv("SERVER_CERT")
	serverKey := os.Getenv("SERVER_KEY")
	serverSecure := os.Getenv("SERVER_SECURE")

	serveStatic := os.Getenv("SERVE_STATIC")

	if serveStatic == "" {
		serveStatic = "false"
	}

	if serverURL == "" {
		log.Fatalln("No SERVER_URL environment variable set")
	}

	if serverSecure == "" {
		log.Fatalln("No SERVER_SECURE environment variable set")
	}

	if serverSecure != "disable" {
		if serverCert == "" {
			log.Fatalln("No SERVER_CERT environment variable set")
		}
		if serverKey == "" {
			log.Fatalln("No SERVER_KEY environment variable set")
		}
	}

	log.Println("Environment set. Starting service...")

	s.hasStatic = (serveStatic == "true")

	// Start server
	s.App.Logger.Fatal(s.App.Start(":8080"))

	log.Println("!! SERVER STARTED !!")
}

// if serverSecure == "disable" {
// 	s.App.Run(iris.Addr(serverURL))
// } else if serverSecure == "cert" {
// 	s.App.Run(iris.TLS(serverURL, serverCert, serverKey))
// } else if serverSecure == "auto" {
// 	s.App.Run(iris.AutoTLS(serverURL, serverCert, serverKey))
// } else {
// 	log.Fatalln("Invalid SERVER_SECURE environment variable set")
// }

// //BuildLoggerLayer sets up the logger helpful comment
// func (s *Server) BuildLoggerLayer() iris.Handler {

// 	requestLogger := logger.New(logger.Config{
// 		Status: true,
// 		IP:     true,
// 		Method: true,
// 		Path:   true,
// 		Query:  true,

// 		// if !empty then its contents derives from `ctx.GetHeader("User-Agent")
// 		//MessageHeaderKeys: []string{"User-Agent"},
// 	})

// 	return requestLogger
// }

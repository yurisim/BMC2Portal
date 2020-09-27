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
	//API *endpoints.EP
	//e *echo
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
	// srv.BuildAPI()

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

	// dbConnection := pg.Connect(&pg.Options{
	// 	User:     dbUser,
	// 	Password: dbPwd,
	// 	Addr:     dbURL,
	// 	Database: dbName,
	// })

	// if dbTLS == "secure" || dbTLS == "secure-skip" {
	// 	dbConnection = pg.Connect(&pg.Options{
	// 		User:     dbUser,
	// 		Password: dbPwd,
	// 		Addr:     dbURL,
	// 		Database: dbName,
	// 		TLSConfig: &tls.Config{
	// 			ServerName:               dbTLSServerName,
	// 			InsecureSkipVerify:       dbTLSSkipVerify,
	// 			PreferServerCipherSuites: dbTLSDBCipher,
	// 		},
	// 	})
	// }

	// s.DB = dbConnection

	// if showSQL, err := strconv.ParseBool(os.Getenv("DEBUG_SHOW_SQL")); err == nil && showSQL {

	// 	log.Println("!! Showing all SQL queries !!")

	// 	//s.DB.AddQueryHook(AfterQuery(event *pg.QueryEvent) {
	// 	//	query, err := event.FormattedQuery()
	// 	//	if err != nil {
	// 	//		panic(err)
	// 	//	}

	// 	//	log.Printf("%s %s", time.Since(event.StartTime), query)
	// 	//})
	// }
}

//BuildAPI builds the endpoints as found below
func (s *Server) BuildAPI() {
	// s.API = endpoints.Build(s.DB)
}

//BuildIris maps endpoints to endpoint functions as found in the endpoint package
func (s *Server) BuildIris() {
	// app := iris.New()

	// app.Use(recover.New())

	// if useProm, err := strconv.ParseBool(os.Getenv("EXPORT_PROMETHEUS")); err == nil && useProm {
	// 	app.Use()
	// 	app.Use(prometheusMiddleware.New("JSADT", 0.3, 1.2, 5.0).ServeHTTP)
	// }

	// app.Use(s.BuildLoggerLayer())

	// csrfSecret := os.Getenv("CSRF_SECRET")

	// if csrfSecret != "" {
	// 	app.Use(s.BuildCSRFLayer(csrfSecret))
	// } else {
	// 	log.Println("!! CSRF Protection Disabled !!")
	// }

	// *********************************** THIS KEEP

	// webdir := os.Getenv("DEBUG_WEB_DIR")

	// if webdir == "" {
	// 	webdir = "/html"
	// }

	// if webdir != "" {
	// 	log.Printf("!! Serving files from '%s' at '/' !!", webdir)
	// 	app.HandleDir("/", webdir)
	// }

	// var v1 iris.Party

	// if useCORS, err := strconv.ParseBool(os.Getenv("DEBUG_ALLOW_ALL_ORIGINS")); err == nil && useCORS {

	// 	log.Println("!! CORS AllowedOrigins set to * !!")

	// 	crs := cors.New(cors.Options{
	// 		AllowedOrigins:   []string{"*"}, // allows everything, use that to change the hosts.
	// 		AllowCredentials: true,
	// 		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "PATCH"},
	// 	})

	// 	v1 = app.Party("/v1", crs).AllowMethods(iris.MethodOptions)
	// } else {
	// 	v1 = app.Party("/v1").AllowMethods(iris.MethodOptions)
	// }

	// //These are API endpoints that do not require authentication tokens
	// publicRoutes := v1.Party("/public")
	// {
	// 	publicRoutes.Get("/rundown", s.API.RundownGet)

	// 	//?? Not used?
	// 	//publicRoutes.Get("/metrics", iris.FromStd(promhttp.Handler()))
	// }

	// //protectedRoutes := v1.Party("/protected")
	// //{
	// //}

	// //adminRoutes := protectedRoutes.Party("/admin")
	// //{
	// //}

	// //userRoutes := protectedRoutes.Party("/user")
	// //{
	// //}
	//s.App = app
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

	e := echo.New()

	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	// Routes
	// e.POST("/users", createUser)
	// e.GET("/users/:id", getUser)
	// e.PUT("/users/:id", updateUser)
	// e.DELETE("/users/:id", deleteUser)

	if serveStatic == "true" {
		e.Static("/", "../../bmc2portal/build")
	}

	// Start server
	e.Logger.Fatal(e.Start(":8080"))
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

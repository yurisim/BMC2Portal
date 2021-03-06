package server

import (
	"fmt"
	"time"
)

//Airspace Contains Airspace Information
type Airspace struct {
	Name      string   `json:"name"`
	AtcAgency string   `json:"atcAgency"`
	LoaLoc    []string `json:"loaLoc"`
	Units     string   `json:"units"`
}

// Unit Represents data from a Unit
type Unit struct {
	Name     string `json:"name"`
	Phone    string `json:"DSN"`
	Airfield string `json:"airfield"`
	IFG      string `json:"ifgLoc"`
	Spins    string `json:"spinsLoc"`
	Logo     string `json:"logo"`
}

//ATCAgency maps an agency to it's LOA
type ATCAgency struct {
	Name string   `json:"name"`
	LOAs []string `json:"loaLoc"`
}

//Lesson stores lesson leanred information
type Lesson struct {
	Date        string   `json:"date"`
	Tags        []string `json:"tags"`
	Title       string   `json:"title"`
	Content     string   `json:"content"`
	Contributor string   `json:"contributor"`
	Validator   string   `json:"validator"`
}

//GetLesson Mocks a lesson
func GetLesson(tags []string, contentuniq string) Lesson {
	formatIdeal := "2006-01-02"
	t, _ := time.Parse(formatIdeal, "2020-09-27")

	content := "ipsem loreum titum " + contentuniq
	if contentuniq == "fourth" {
		content = content + "This is a really long  " +
			"lesson learned hardcoded as an example. this should be removed during production " +
			"QC. TODO - remove this and have a MOCKED/GOMOCKED return that includes a long " +
			"lesson learned content. <br/><br/>" +
			"Truthfully, this div could be several paragraphs long. Let's try it out. <br/><br/>" +
			"This is a really long " +
			"lesson learned hardcoded as an example. this should be removed during production " +
			"QC. TODO - remove this and have a MOCKED/GOMOCKED return that includes a long " +
			"lesson learned content."
	}
	lesson := &Lesson{
		Date:        t.Format(formatIdeal),
		Tags:        tags,
		Title:       "ipsum lorem",
		Content:     content,
		Contributor: "John McCarthy",
		Validator:   "Scotty Seidenberger",
	}
	return *lesson
}

//GetAirspace Mocks an airspace
func GetAirspace(name string) Airspace {
	atc := "Jacksonville ARTCC"
	if name == "W133" {
		atc = "Memphis ARTCC"
	} else if name == "Wiley East" {
		atc = "UNKNOWN"
	} else if name == "W155" {
		atc = "Houston ARTCC"
	}

	loaLoc := m[atc]

	fmt.Println(loaLoc)
	// TODO - replace this with a lookup - ATCAgency -> LOA Loc
	aspace := &Airspace{
		Name:      name,
		AtcAgency: atc,
		LoaLoc:    loaLoc,
		Units:     name + " FS," + name + " FW",
	}
	return *aspace
}

//GetAirspaceList Mocks the airspace list
func GetAirspaceList() []Airspace {
	var a = make([]Airspace, 6)
	a[0] = GetAirspace("W122")
	a[1] = GetAirspace("W133")
	a[2] = GetAirspace("W470")
	a[3] = GetAirspace("W155")
	a[4] = GetAirspace("W151")
	a[5] = GetAirspace("Wiley East")
	return a
}

//GetUnit mocks info for a particular unit
func GetUnit(unitName string, afld string) Unit {
	u := &Unit{
		Name:     unitName,
		Phone:    "405-867-5309",
		Airfield: afld,
		Spins:    "spins.pdf",
		IFG:      "ifg.pdf",
		Logo:     "logo.png",
	}
	return *u
}

//GetUnitList Mocks the list of units
func GetUnitList() []Unit {
	var a = make([]Unit, 10)
	a[0] = GetUnit("122 FS", "KTIK")
	a[1] = GetUnit("42 FS", "KTIK")
	a[2] = GetUnit("43 FS", "KTIK")
	a[3] = GetUnit("122 FW", "KPAM")
	a[4] = GetUnit("42 FW", "KPAM")
	a[5] = GetUnit("43 FW", "KPAM")
	a[6] = GetUnit("99 FS", "KTIK")
	a[7] = GetUnit("93 FS", "KTIK")
	a[8] = GetUnit("965 FS", "KTIK")
	a[8] = GetUnit("69 FS", "KTIK")
	a[9] = GetUnit("960 AACS", "KTIK")
	return a
}

var m = make(map[string][]string)

func init() {
	var pdfs [7]string
	pdfs[0] = "Abuquerque ARTCC"
	pdfs[1] = "Jacksonville ARTCC.pdf"
	pdfs[2] = "FACSFAC Vacapes.pdf"
	pdfs[3] = "Denver ARTCC.pdf"
	pdfs[4] = "Houston ARTCC.pdf"
	pdfs[5] = "Houston ARTCC LOA for W-228A-D.pdf"
	pdfs[6] = "Memphis ARTCC.pdf"
	m["Albuqurque ARTCC"] = pdfs[0:1]
	m["Jacksonville ARTCC"] = pdfs[1:2]
	m["FACSFAC Vacapes"] = pdfs[2:3]
	m["Denver ARTCC"] = pdfs[3:4]
	m["Houston ARTCC"] = pdfs[4:6]
	m["Memphis ARTCC"] = pdfs[6:]
}

//GetATCInfo mocks info for a specific ATC agency
func GetATCInfo(agency string) ATCAgency {

	agent := &ATCAgency{
		Name: agency,
		LOAs: m[agency],
	}
	return *agent
}

//GetLOAList mocks all of the LOAs
func GetLOAList() []ATCAgency {
	var a = make([]ATCAgency, 5)

	a[0] = GetATCInfo("Jacksonville ARTCC")
	a[1] = GetATCInfo("FACSFAC Vacapes")
	a[2] = GetATCInfo("Denver ARTCC")
	a[3] = GetATCInfo("Houston ARTCC")
	a[4] = GetATCInfo("Memphis ARTCC")
	return a
}

//GetLessonsLearned mocks all of the lessons learned
func GetLessonsLearned() []Lesson {
	var a = make([]Lesson, 5)
	a[0] = GetLesson([]string{"W122"}, "first")
	a[1] = GetLesson([]string{"W122"}, "second")
	a[2] = GetLesson([]string{"W133"}, "third")
	a[3] = GetLesson([]string{"Red Flag"}, "fourth")
	a[4] = GetLesson([]string{"W122", "Red Flag"}, "fifth")
	return a
}

//GetAllTags mocks retrieving existing tags from the database
func GetAllTags() []string {
	var a = make([]string, 11)
	a[0] = "W122"
	a[1] = "W1"
	a[2] = "W2"
	a[3] = "W3"
	a[4] = "W4"
	a[5] = "W5"
	a[6] = "W166"
	a[7] = "W177"
	a[8] = "W155"
	a[9] = "W151"
	a[10] = "RED FLAG"
	return a
}

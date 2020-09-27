package mock

//Airspace Contains Airspace Information
type Airspace struct {
	Name      string `json:"name"`
	AtcAgency string `json:"atcAgency"`
	LoaLoc    string `json:"loaLoc"`
	Units     string `json:"units"`
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

type ATCAgency struct {
	Name   string `json:"name"`
	LOALoc string `json:"loaLoc"`
}

//GetAirspace Mocks an airspace
func GetAirspace(name string) Airspace {
	atc := "Jacksonville Center"
	if name == "W133" {
		atc = "Giantkiller"
	}

	loaLoc := atc + "LOA.pdf"

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
	var a = make([]Airspace, 5)
	a[0] = GetAirspace("W122")
	a[1] = GetAirspace("W133")
	a[2] = GetAirspace("W470")
	a[3] = GetAirspace("W155")
	a[4] = GetAirspace("W151")
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

//GetATCInfo mocks info for a specific ATC agency
func GetATCInfo(agency string) ATCAgency {
	agent := &ATCAgency{
		Name:   agency,
		LOALoc: agency + "LOA.pdf",
	}
	return *agent
}

//GetLOAList mocks all of the LOAs
func GetLOAList() []ATCAgency {
	var a = make([]ATCAgency, 5)

	a[0] = GetATCInfo("Jacksonville Center")
	a[1] = GetATCInfo("FACSFAC VACAPES")
	a[2] = GetATCInfo("Denver ARTCC")
	a[3] = GetATCInfo("Houston ARTCC")
	a[4] = GetATCInfo("Memphis Center")
	return a
}

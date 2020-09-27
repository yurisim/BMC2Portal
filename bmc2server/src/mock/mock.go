package mock

//Airspace Contains Airspace Information
type Airspace struct {
	Name      string `json:"name"`
	AtcAgency string `json:"atcAgency"`
	LoaLoc    string `json:"loaLoc"`
	Units     string `json:"units"`
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

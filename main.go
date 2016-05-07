package main

import (
	"database/sql"
	"fmt"
	"github.com/gragas/woobloo/config"
	_ "github.com/lib/pq"
	"net/http"
)

var db *sql.DB

func main() {
	var err error
	config := config.LoadConfig("config.json")
	db, err = sql.Open(config.DBType, config.ConnectionString())
	if err != nil {
		panic(err)
	}
	http.HandleFunc("/", indexHandler)
	http.ListenAndServe(config.ServerAddr, nil)
}

// Handlers
func indexHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Hello, World!")
}

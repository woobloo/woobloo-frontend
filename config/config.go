package config

import (
	"encoding/json"
	"io/ioutil"
)

type Config struct {
	ServerAddr string
}

func LoadConfig(configPath string) *Config {
	bytes, err := ioutil.ReadFile(configPath)
	if err != nil {
		panic(err)
	}
	config := new(Config)
	err = json.Unmarshal(bytes, config)
	if err != nil {
		panic(err)
	}
	return config
}

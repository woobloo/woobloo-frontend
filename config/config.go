package config

import (
	"fmt"
	"encoding/json"
	"errors"
	"io/ioutil"
	"reflect"
	"strings"
)

type Config struct {
	DBType     string
	DBUser     string
	DBName     string
	SSLMode    string
	ServerAddr string
}

func (c *Config) ConnectionString() string {
	v := reflect.ValueOf(*c)
	numFields := v.NumField()
	attributeStrings := make([]string, 0)
	for i := 0; i < numFields; i++ {
		inter := v.Field(i).Interface()
		val, ok := inter.(string)
		if !ok {
			msg := fmt.Sprintf("Failed to generate ConnectionString: %v is not a string.", inter)
			panic(errors.New(msg))
		}
		var attrString string
		shouldAdd := true
		switch v.Type().Field(i).Name {
		case "DBUser":
			attrString = "user"
		case "DBName":
			attrString = "dbname"
		case "SSLMode":
			attrString = "sslmode"
		default:
			shouldAdd = false
		}
		if !shouldAdd {
			continue
		}
		attributeStrings = append(attributeStrings, attrString + "=" + val)
	}
	return strings.Join(attributeStrings, " ")
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

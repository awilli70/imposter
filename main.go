package main

import (
    "github.com/gin-gonic/gin"
    "github.com/gin-contrib/cors"
    "fmt"
)

type Role int

const (
    ROLE_UNASSIGNED Role = iota
    ROLE_CREWMATE
    ROLE_IMPOSTER
)

type Player struct {
    Name string
    Number string
    Type Role
}

var players = make(map[string]*Player)

func register(c *gin.Context) {
    p := new(Player)
    p.Name = c.PostForm("name") 
    p.Number = c.PostForm("number")
    p.Type = ROLE_UNASSIGNED

    players[p.Name] = p
    for k, _ := range players {
        fmt.Println(k, players[k])
    }
    c.Status(200)
}

func main() {
    router := gin.Default()
    router.Use(cors.Default())
    router.POST("/register", register)
    router.Run(":8080")
}

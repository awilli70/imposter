package main

import (
    "github.com/gin-gonic/gin"
    "github.com/gin-contrib/cors"
    "github.com/gorilla/websocket"
    "container/list"
    "fmt"
    "net/http"
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
    role Role
    Alive bool
}

type PlayerList struct {
    Players []Player
}

var players = make(map[string]Player)

var connChannels = list.New()

var upgrader = websocket.Upgrader{
    ReadBufferSize: 1024,
    WriteBufferSize: 1024,
    CheckOrigin: func(r *http.Request) bool {
        origin := r.Header.Get("Origin")
        return origin == "http://localhost:5173"
    },
}

func updateAllWS() {
    for e := connChannels.Front(); e != nil; e = e.Next() {
        if channel, ok := e.Value.(chan bool); ok {
            channel <- true
        }
    }
}

func register(c *gin.Context) {
    // Add player to playermap
    p := Player{
        Name: c.PostForm("name"),
        Number: c.PostForm("number"),
        role: ROLE_UNASSIGNED,
        Alive: true,
    }

    players[p.Name] = p
    for k, _ := range players {
        fmt.Println(k, players[k])
    }
    updateAllWS();
    c.Status(200)
}

func togglePlayer(c *gin.Context) {
    // Add player to playermap
    p := players[c.PostForm("name")]
    p.Alive = !p.Alive
    players[p.Name] = p

    for k, _ := range players {
        fmt.Println(k, players[k])
    }
    updateAllWS();
    c.Status(200)
}

func flatPlayers() PlayerList {
    flatList := make([]Player, 0, len(players))
    for  _, v := range players {
        flatList = append(flatList, v)
    }

    p := PlayerList{
        Players: flatList,
    }
    fmt.Println(p)

    return p 
}

func socketReader(ws *websocket.Conn, comms chan bool) {
    _, _, err := ws.ReadMessage()
    if err != nil {
        fmt.Println("Closing Reader")
        comms <- false
        return
    }
}

func playerWS(c *gin.Context) {
    // upgrade connection to websocket
    ws, err := upgrader.Upgrade(c.Writer, c.Request, nil)
    if err != nil {
        fmt.Println("Failed to upgrade", err)
        return
    }
    updateChan := make(chan bool)
    e := connChannels.PushBack(updateChan)
    defer ws.Close()
    defer connChannels.Remove(e)
    
    err = ws.WriteJSON(flatPlayers())
    if err != nil {
        fmt.Println("Failed to write playerlist on initial conn", err)
        return
    }
    go socketReader(ws, updateChan)
    for {
        msg := <- updateChan
        if !msg {
            fmt.Println("Closing Writer")
            return
        }
        err = ws.WriteJSON(flatPlayers())
        if err != nil {
            fmt.Println("Failed to write playerlist from chan update", err)
            return
        }
    }
}

func main() {
    router := gin.Default()
    router.Use(cors.Default())
    router.POST("/register", register)
    router.POST("/togglePlayer", togglePlayer)
    router.GET("/players", playerWS)
    router.Run(":8080")
}

package main

import (
    "github.com/gin-gonic/gin"
    "github.com/gin-contrib/cors"
    "github.com/gorilla/websocket"
    "container/list"
    "fmt"
    "net/http"
    "math/rand/v2"
    "strconv"
)

type role int

const (
    ROLE_UNASSIGNED role = 1
    ROLE_CREWMATE role = 2
    ROLE_IMPOSTER role = 3
)

type Player struct {
    Name string
    Number string
    Role role
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
        return true
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
        Role: ROLE_UNASSIGNED,
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

func startGame (c *gin.Context) {
    imposterCt, _ := strconv.Atoi(c.PostForm("imposters"))
    var imposters = make(map[int]bool)

    for i := range (imposterCt) {
        idx := rand.IntN(len(players))
        if _, ok := imposters[idx]; ok {
            i--
            continue
        }
        imposters[idx] = true
        fmt.Println(idx)

    }
    idx := 0
    for k, v := range players {
        if _, ok := imposters[idx]; ok {
            v.Role = ROLE_IMPOSTER
        } else {
            v.Role = ROLE_CREWMATE
        }
        players[k] = v
        idx++
    }

    updateAllWS();
    c.Status(200)
}

func resetGame (c *gin.Context) {
    for k, v := range players {
        v.Role = ROLE_UNASSIGNED
        v.Alive = true
        players[k] = v
    }
    updateAllWS();
    c.Status(200)
}

func resetAll(c *gin.Context) {
    clear(players)
    updateAllWS();
    c.Status(200)
}

func main() {
    router := gin.Default()
    router.Use(cors.Default())
    api := router.Group("/api")
    api.POST("/register", register)
    api.POST("/togglePlayer", togglePlayer)
    api.GET("/players", playerWS)
    api.POST("/start", startGame)
    api.POST("/reset", resetGame)
    api.POST("/restart", resetAll)
    router.StaticFS("/assets", http.Dir("ui/dist/assets"))
    router.StaticFile("/", "ui/dist/index.html")
    router.StaticFile("/imposter.png", "ui/dist/imposter.png")
    router.Run(":8080")
}

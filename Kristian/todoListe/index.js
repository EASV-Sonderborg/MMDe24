


//fetcher to-dos

async function fetchTodos() {
    let response = await fetch('https://dummyjson.com/todos')
    let jsonResponse = await response.json()

    console.log(response)
    console.log(jsonResponse)

    //vise todos - tilføje til vores liste
    let list = document.querySelector(".myList")
    
    for (let todoItem of jsonResponse.todos) {
    
        if (todoItem.completed) {
            list.innerHTML += `<li>WIN! ${todoItem.todo}</li>`
        } else {
              list.innerHTML += `<li>LOSE... ${todoItem.todo}</li>`
        }

    
    }

}

fetchTodos()

let skipCount = 30
let total = 0

async function loadMore(){
    //tilføjer de næste 30 fra API/server
    //URL: https://dummyjson.com/todos?skip=30


    if (total != 0 && skipCount >= total) {
        return alert("Ikke flere todos")
    }

    let response = await fetch('https://dummyjson.com/todos?skip=' + skipCount)
    let jsonResponse = await response.json()
    total = jsonResponse.total;


    skipCount += 30

    console.log(response)
    console.log(jsonResponse)

    //vise todos - tilføje til vores liste
    let list = document.querySelector(".myList")
    
    for (let todoItem of jsonResponse.todos) {
    
        if (todoItem.completed) {
            list.innerHTML += `<li>WIN! ${todoItem.todo}</li>`
        } else {
              list.innerHTML += `<li>LOSE... ${todoItem.todo}</li>`
        }

    
    }

}


/*
function turnToJason(response){
    return response.json()
}

fetch('https://dummyjson.com/todos')
.then(lavDetOmTilJSON)
.then(byNogetMedMitData)

function lavDetOmTilJSON(response) {
    return response.json()
}

function byNogetMedMitData(result) {
    console.log(result.todos)
    let myList = document.querySelector(".myList")

    for (let myTodo of result.todos) {
        let todoText = myTodo.todo

    let className = myTodo.completed ? "completed" : "not-completed"

        myList.innerHTML += `<li class="${className}">${todoText}</li>`
    }
}


let offset = 30;

function loadMore() {
    fetch("https://dummyjson.com/todos?limit=30&skip=" + offset)
        .then(lavDetOmTilJSON)
        .then(byNogetMedMitData);

    offset += 30;
}

*/
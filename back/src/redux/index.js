const redux=require("redux")
const createStore =redux.createStore


const SET_USER= "SET_USER"
const REMOVE_USER="REMOVE_USER"

function setUser(user){
    return{
        type:SET_USER,
        payload:user
    }
}

function removeUser(){
    return{
        type:REMOVE_USER
    }
}
const initialState={
    user: [{id: 20, username: "md", password: 4, role: "supervisor", firstname: "Michael Dinglis"}]
}

// [{id: 20, username: "md", password: 4, role: "supervisor", firstname: "Michael Dinglis"}]

const reducer=(state=initialState,action)=>{
    switch(action.type){
        case SET_USER:
            return{
                user:action.payload
            }
        case REMOVE_USER:
            return{
                user:null
            }
        default: return state
    }
}

const store=createStore(reducer)

export default store
export {setUser,removeUser}
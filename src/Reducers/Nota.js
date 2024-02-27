import { ADD_NOTAS,ADD_ALl_NOTAS,DELETD_NOTAS } from "../Action/Notas"




export const initialState = {
    notas:[]
}

export const NotasReducers =(state = initialState, { type, payload }) => {
  switch (type) {

  case ADD_NOTAS:
    
    return { ...state,
        notas: [...state.notas, payload],
     }
    
    case ADD_ALl_NOTAS:
        return{
            ...state,
            notas: [...state.notas, ...payload],
        }

    case DELETD_NOTAS:
        state.notas= state.notas.filter((nota => nota.id !== payload))
        return{
            ...state
        }
  default:
    return state
  }
}

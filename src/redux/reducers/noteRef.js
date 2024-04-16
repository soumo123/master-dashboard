const initialState = { 
    arr : false
}
  
  const noteRef = (state = initialState, action) => {
    switch (action.type) {
      case 'SET_REFRESH' :
        return { ...state, arr: action.data };

      default:
        return state;
    }
  }

  export default noteRef;
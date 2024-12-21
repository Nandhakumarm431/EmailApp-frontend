import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: '',
    clientID: '',
    activeStyle:''
}

const slice = createSlice({
    name: 'mySlice',
    initialState,
    reducers: {
        setValue: (state, action) => {
            state.value = action.payload;
        },
        setClientID: (state, action) => {
            state.clientID = action.payload;
        },
        setactiveStyle: (state, action) => {
            state.activeStyle = action.payload;
        }
    }
})

export const { setValue, setClientID, setactiveStyle } = slice.actions;
export default slice.reducer;
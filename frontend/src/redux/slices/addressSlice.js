import {createSlice} from "@reduxjs/toolkit";
import {toast} from "react-toastify";


const userSlice = createSlice({
    name: "address",
    initialState: {
        userWalletAddress: null,
    },
    reducers: {
        setUserWalletAddress: (state, action) => {
            state.userWalletAddress = action.payload
        }
    },
});


export const {setUserWalletAddress} = userSlice.actions;
export default userSlice.reducer;

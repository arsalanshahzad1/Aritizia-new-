import {configureStore} from '@reduxjs/toolkit';
import addressReducer from './slices/addressSlice';

import storage from 'redux-persist/lib/storage'
import {combineReducers} from "redux";
import {persistReducer} from 'redux-persist'


const reducers = combineReducers({
    address: addressReducer,
})
const persistConfig = {
    key: 'user',
    storage
};
const persistedReducer = persistReducer(persistConfig, reducers);

export default configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    }),
});

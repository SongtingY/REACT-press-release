import {combineReducers} from 'redux';
import { configureStore} from '@reduxjs/toolkit'
import { CollapsedReducer } from './reducer/CollapsedReducer';
import { LoadingReducer } from './reducer/LoadingReducer';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

const persistConfig = {
    key: 'songss',
    storage,
    blacklist:["LoadingReducer"]
  }  
 
const reducer = combineReducers({
    CollapsedReducer,
    LoadingReducer
})

const persistedReducer = persistReducer(persistConfig, reducer)

const store = configureStore({reducer: persistedReducer, middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })});
const persiststore = persistStore(store);

export {store, persiststore};
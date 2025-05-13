import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { combineReducers } from "redux";
import authSlice from "./authSlice";
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";

const persistConfig = {
    key: "root",
    storage,
};

const rootReducer = combineReducers({
    auth: persistReducer(persistConfig, authSlice),
});

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER], // ✅ Ignore redux-persist actions or warnings
            },
        }),
});

export const persistor = persistStore(store);
export default store;




// import {configureStore} from '@reduxjs/toolkit';
// import authSlice from './authSlice';

// const store = configureStore({  
//     reducer: {    
//         auth : authSlice,
//     }
// })

// export default store; // userData






// import { configureStore } from "@reduxjs/toolkit";
// import authReducer from "./authSlice";
// import storage from "redux-persist/lib/storage"; // Local storage
// import { persistReducer, persistStore } from "redux-persist";

// const persistConfig = {
//     key: "auth",
//     storage,
// };

// const persistedAuthReducer = persistReducer(persistConfig, authReducer);

// const store = configureStore({
//     reducer: {
//         auth: persistedAuthReducer,
//     },
// });

// export const persistor = persistStore(store);
// export default store;


